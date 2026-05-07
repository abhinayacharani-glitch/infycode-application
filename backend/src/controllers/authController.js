import db from "../config/firebase.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

const studentsRef = db.collection("students");
const adminsRef = db.collection("admins");
const trainersRef = db.collection("trainers");
const tempRegistrationsRef = db.collection("tempRegistrations");

const coursesRef = db.collection("courses");

// Helper: Generate next Student ID (INFY-110, INFY-111)
const generateNextStudentID = async () => {
  const snapshot = await studentsRef.get();
  const count = snapshot.size;
  const nextNumber = 110 + count;
  return `INFY-${nextNumber}`;
};

// ✅ STUDENT REGISTER
export const studentRegister = async (req, res) => {
  try {
    const { fullname, email, phno, password, confirmPassword } = req.body;

    if (!fullname || !email || !phno || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingSnapshot = await studentsRef
      .where("email", "==", email.trim().toLowerCase())
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 1 * 60 * 1000; // 1 minute
    const sessionExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const hashedPassword = await bcrypt.hash(password, 10);
    const sanitizedEmail = email.trim().toLowerCase().replace(/\./g, ",");
    const tempKey = `student_${sanitizedEmail}`;

    await tempRegistrationsRef.doc(tempKey).set({
      fullname: fullname.trim(),
      email: email.trim().toLowerCase(),
      phno: phno.trim(),
      password: hashedPassword,
      role: "student",
      otp,
      expiresAt: otpExpiresAt,
      sessionExpiresAt: sessionExpiresAt,
      createdAt: new Date().toISOString(),
    });

    // Send OTP email
    await sendEmail({
      to: email.trim().toLowerCase(),
      subject: "Registration OTP for Student",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a73e8;">Student Registration OTP</h2>
          <p>Hi <strong>${fullname.trim()}</strong>,</p>
          <p>Your OTP for completing student registration is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 5px; margin: 20px 0; text-align: center; background: #f0f0f0;">
            ${otp}
          </div>
          <p>This OTP is valid for <strong>1 minute</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully" });
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

// ✅ STUDENT LOGIN
export const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // 1. Step 1 — Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // 2. Step 2 — Check Email Exists in Database
    const snapshot = await studentsRef
      .where("email", "==", email.trim().toLowerCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    userData.id = userDoc.id;

    // 3. Step 3 — Check Password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      console.warn(`[Student Login] Password mismatch for email: ${email}`);
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(userData);

    res.json({
      success: true,
      role: userData.role,
      token,
    });
  } catch (error) {
    console.error("Student Login Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ VERIFY REGISTRATION OTP
export const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    const isTrainerEmail = email?.trim().toLowerCase().endsWith("@outlook.com");

    if (!email || (!isTrainerEmail && !otp) || !role) {
      return res.status(400).json({ message: "Email, OTP, and role are required" });
    }

    const sanitizedEmail = email.trim().toLowerCase().replace(/\./g, ",");
    const tempKey = `${role.toLowerCase()}_${sanitizedEmail}`;

    const tempDoc = await tempRegistrationsRef.doc(tempKey).get();

    if (!tempDoc.exists) {
      return res.status(400).json({
        success: false,
        message: "Registration session expired. Please register again."
      });
    }

    const registrationData = tempDoc.data();

    // 1. Check Session Expiry (5 minutes)
    if (Date.now() > (registrationData.sessionExpiresAt || 0)) {
      await tempRegistrationsRef.doc(tempKey).delete();
      return res.status(400).json({
        success: false,
        message: "Registration session expired. Please register again."
      });
    }

    // 2. Check OTP Expiry (1 minute)
    if (Date.now() > registrationData.expiresAt) {
      return res.status(410).json({
        success: false,
        message: "OTP expired"
      });
    }

    // 3. Check OTP Value (BYPASS for trainers)
    if (!isTrainerEmail && otp.toString() !== registrationData.otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (isTrainerEmail) {
      console.log(`[verifyRegistrationOTP] DEV MODE: OTP bypass for trainer ${email}`);
    }

    // 4. Deferred Email Check: Check if permanently registered
    let targetCollection;
    if (isTrainerEmail) {
      targetCollection = trainersRef;
    } else if (role.toLowerCase() === "admin") {
      targetCollection = adminsRef;
    } else if (role.toLowerCase() === "trainer") {
      targetCollection = trainersRef;
    } else if (role.toLowerCase() === "student") {
      targetCollection = studentsRef;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    const permanentSnapshot = await targetCollection
      .where("email", "==", email.trim().toLowerCase())
      .limit(1)
      .get();

    if (!permanentSnapshot.empty) {
      await tempRegistrationsRef.doc(tempKey).delete();
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // OTP is valid and email is unique! Create the real user.
    const { otp: _, expiresAt: __, sessionExpiresAt: ___, createdAt: ____, ...userData } = registrationData;

    let finalUserData = {
      ...userData,
      role: isTrainerEmail ? "trainer" : (role.toLowerCase() === "admin" ? "admin" : "student"),
      createdAt: new Date().toISOString(),
    };

    if (finalUserData.role === "student") {
      finalUserData.studentId = await generateNextStudentID();
    }

    await targetCollection.add(finalUserData);

    // Remove temp registration
    await tempRegistrationsRef.doc(tempKey).delete();

    res.status(201).json({
      success: true,
      message: "OTP verified successfully. Please login."
    });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ RESEND REGISTRATION OTP
export const resendRegistrationOTP = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    const sanitizedEmail = email.trim().toLowerCase().replace(/\./g, ",");
    const tempKey = `${role.toLowerCase()}_${sanitizedEmail}`;

    const tempDoc = await tempRegistrationsRef.doc(tempKey).get();

    if (!tempDoc.exists) {
      return res.status(400).json({
        success: false,
        message: "Registration session expired. Please register again."
      });
    }

    const registrationData = tempDoc.data();

    // Check Session Expiry (5 minutes)
    if (Date.now() > (registrationData.sessionExpiresAt || 0)) {
      await tempRegistrationsRef.doc(tempKey).delete();
      return res.status(400).json({
        success: false,
        message: "Registration session expired. Please register again."
      });
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const newOtpExpiresAt = Date.now() + 1 * 60 * 1000; // 1 minute

    await tempRegistrationsRef.doc(tempKey).update({
      otp: newOtp,
      expiresAt: newOtpExpiresAt,
    });

    // Send new OTP email
    await sendEmail({
      to: email.trim().toLowerCase(),
      subject: `New Registration OTP for ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a73e8;">New Registration OTP</h2>
          <p>Your new OTP for completing ${role.toLowerCase()} registration is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 5px; margin: 20px 0; text-align: center; background: #f0f0f0;">
            ${newOtp}
          </div>
          <p>This OTP is valid for <strong>1 minute</strong>.</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });
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