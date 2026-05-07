import crypto from "crypto";
import db from "../config/firebase.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/sendEmail.js";
import admin from 'firebase-admin';

const resetTokensRef = db.collection("passwordResetTokens");

// ─────────────────────────────────────────────
// Helper: find all users by email (admins / trainers / students)
// Returns array: [{ ...userData, _ref: "admins"|"trainers"|"students", _key: firebaseKey }]
// ─────────────────────────────────────────────
const findUsersByEmail = async (email, role) => {
  const normalizedEmail = email.trim().toLowerCase();

  const checkIn = async (collectionName) => {
    const snapshot = await db.collection(collectionName)
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { ...doc.data(), _ref: collectionName, _key: doc.id };
    }
    return null;
  };

  const normalizedRole = role ? String(role).trim().toLowerCase() : null;

  // 1. If role is provided, ONLY check that specific role
  if (normalizedRole === "admin") {
    const u = await checkIn("admins");
    return u ? [u] : [];
  } else if (normalizedRole === "trainer") {
    const u = await checkIn("trainers");
    return u ? [u] : [];
  } else if (normalizedRole === "student") {
    const u = await checkIn("students");
    return u ? [u] : [];
  }

  // 2. If NO role is provided, check all and return all matches
  const users = [];
  const uA = await checkIn("admins");
  if (uA) users.push(uA);

  const uT = await checkIn("trainers");
  if (uT) users.push(uT);

  const uS = await checkIn("students");
  if (uS) users.push(uS);

  return users;
};

// ─────────────────────────────────────────────
// POST /forgot-password
// Generates a 6-digit OTP, stores it on the user record, sends OTP email
// ─────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const users = await findUsersByEmail(email, role);

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "Email ID not found" });
    }

    const user = users[0];

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 1 * 60 * 1000; // 1 minute (Updated from 5 minutes)

    // Store OTP on the user's own Firebase record
    await db.collection(user._ref).doc(user._key).update({
      resetOTP: otp,
      otpExpiry,
    });

    // Send OTP email
    await sendEmail({
      to: email.trim().toLowerCase(),
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a73e8;">Password Reset OTP</h2>
          <p>Hi <strong>${user.fullName || user.fullname || user.username || "User"}</strong>,</p>
          <p>Your OTP for password reset is:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px;
                      color: #1a73e8; margin: 20px 0; text-align: center; background: #f0f0f0;">
            ${otp}
          </div>
          <p>This OTP is valid for <strong>1 minute</strong>. Do not share it with anyone.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    if (error.message.includes("550") || error.responseCode === 550) {
      return res.status(400).json({
        success: false,
        message: "Email does not exist. Please enter a valid email"
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to send OTP email. Please try again."
    });
  }
};

// ─────────────────────────────────────────────
// POST /verify-otp
// Validates OTP + expiry. On success: clears OTP, generates a short-lived reset token
// ─────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const users = await findUsersByEmail(email, role);

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "Email ID not found" });
    }

    const providedOtpForm = String(otp).trim();
    let validUser = null;
    let expiredUser = null;

    // Iterate through all matched accounts to find the one holding the correct OTP
    for (const u of users) {
      if (u.resetOTP && String(u.resetOTP).trim() === providedOtpForm) {
        if (Date.now() > (u.otpExpiry || 0)) {
          expiredUser = u;
        } else {
          validUser = u;
          break;
        }
      }
    }

    if (expiredUser && !validUser) {
      // Clear expired OTP from Firebase
      await db.collection(expiredUser._ref).doc(expiredUser._key).update({
        resetOTP: admin.firestore.FieldValue.delete(),
        otpExpiry: admin.firestore.FieldValue.delete(),
      });
      return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
    }

    if (!validUser) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const user = validUser;

    // ✅ OTP is valid — clear it from Firebase
    await db.collection(user._ref).doc(user._key).update({
      resetOTP: admin.firestore.FieldValue.delete(),
      otpExpiry: admin.firestore.FieldValue.delete(),
    });

    // Generate a short-lived reset token (15 min) for the reset-password step
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000;

    await resetTokensRef.doc(resetToken).set({
      email: email.trim().toLowerCase(),
      expiresAt: resetTokenExpiry,
      userRef: user._ref,
      userKey: user._key,
    });

    res.json({
      message: "OTP verified successfully",
      token: resetToken,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ success: false, error: "OTP verification failed. Please try again." });
  }
};

// ─────────────────────────────────────────────
// POST /reset-password
// Uses the reset token from verifyOTP to update the user's password (unchanged logic)
// ─────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Token, new password, and confirm password are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Get token from Firebase
    const doc = await resetTokensRef.doc(token).get();

    if (!doc.exists) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const tokenData = doc.data();

    // Check expiry
    if (Date.now() > tokenData.expiresAt) {
      await resetTokensRef.doc(token).delete();
      return res.status(400).json({ message: "Reset token has expired. Please start over." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in Firebase
    await db.collection(tokenData.userRef).doc(tokenData.userKey).update({
      password: hashedPassword,
    });

    // Delete token so it can't be reused
    await resetTokensRef.doc(token).delete();

    res.json({ message: "Password reset successful. You can now log in with your new password." });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ error: "Failed to reset password. Please try again." });
  }
};

