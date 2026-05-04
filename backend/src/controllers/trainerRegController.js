/**
 * trainerRegController.js
 *
 * Trainer-specific registration endpoint that satisfies:
 *   - Email MUST end with @outlook.com
 *   - OTP is SIMULATED (dev mode) — verification always succeeds regardless of value
 *   - Saves trainer under  users/trainer_<id>/  AND  trainers/<push-id>/  in Firebase
 *
 * Routes:
 *   POST /api/trainer/register        → step 1: accept email + password
 *   POST /api/trainer/verify-otp      → step 2: verify OTP (always passes in dev)
 */

import db from "../config/firebase.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const trainersRef = db.ref("trainers");
const usersRef = db.ref("users");

// ─── Helper: generate a short unique ID ─────────────────────────────────────
const shortId = () => Math.random().toString(36).slice(2, 9);

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/trainer/register
// Body: { email, password }
// ═══════════════════════════════════════════════════════════════════════════
export const trainerRegister = async (req, res) => {
  try {
    const { email, password, fullName, fullname, name, phone, phno, confirmPassword } = req.body;

    // ── Resolve optional fields ─────────────────────────────────────────────
    const resolvedName = fullName || fullname || name || "";
    const resolvedPhone = phone || phno || "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Email format ────────────────────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ── Trainer domain restriction ──────────────────────────────────────────
    if (!normalizedEmail.endsWith("@outlook.com")) {
      return res.status(400).json({
        success: false,
        message: "Trainer email must end with @outlook.com",
      });
    }

    // ── Password length ─────────────────────────────────────────────────────
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ── Confirm password (optional field) ───────────────────────────────────
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // ── Duplicate check ─────────────────────────────────────────────────────
    const existing = await trainersRef
      .orderByChild("email")
      .equalTo(normalizedEmail)
      .once("value");

    if (existing.exists()) {
      return res.status(400).json({
        success: false,
        message: "A trainer with this email already exists",
      });
    }

    // ── Hash password ───────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);
    const trainerId = shortId();
    const createdAt = Date.now();

    // ── Save to  trainers/<push-id>/  ───────────────────────────────────────
    const newRef = trainersRef.push();
    await newRef.set({
      email: normalizedEmail,
      fullName: resolvedName.trim() || normalizedEmail.split("@")[0],
      phone: resolvedPhone.trim(),
      password: hashedPassword,
      role: "trainer",
      trainerId,
      createdAt,
    });

    // ── Mirror to  users/trainer_<id>/  (as specified in the requirements) ──
    await usersRef.child(`trainer_${trainerId}`).set({
      email: normalizedEmail,
      password: hashedPassword,
      role: "trainer",
      isVerified: true,
      createdAt,
    });

    // ── DEV MODE: OTP is simulated — no real OTP generated or sent ──────────
    // In production replace this section with real OTP generation + email send.
    console.log(
      `[trainerRegister] DEV MODE: OTP skipped for ${normalizedEmail}. Registration complete.`
    );

    return res.status(201).json({
      success: true,
      message: "Trainer registered successfully",
      role: "trainer"
    });

  } catch (error) {
    console.error("[trainerRegister] Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/trainer/verify-otp
// Body: { email, otp }
// DEV MODE: always returns success regardless of otp value
// ═══════════════════════════════════════════════════════════════════════════
export const trainerVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // DEV MODE — OTP check is bypassed intentionally
    console.log(
      `[trainerVerifyOtp] DEV MODE: OTP "${otp}" accepted automatically for ${email}`
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      role: "trainer"
    });

  } catch (error) {
    console.error("[trainerVerifyOtp] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// ═══════════════════════════════════════════════════════════════════════════
// GET /api/trainer/dashboard
// ═══════════════════════════════════════════════════════════════════════════
export const trainerDashboard = async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to the Trainer Dashboard" });
  } catch (error) {
    console.error("[trainerDashboard] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/trainer/profile
// ═══════════════════════════════════════════════════════════════════════════
export const getTrainerProfile = async (req, res) => {
  try {
    const { email, id } = req.user;
    let trainerKey = id;

    let snapshot = await trainersRef.child(trainerKey).once("value");

    if (!snapshot.exists()) {
      console.log(`[getTrainerProfile] Trainer not found by ID (${trainerKey}), falling back to email lookup...`);
      const emailSnapshot = await trainersRef.orderByChild("email").equalTo(email).once("value");
      if (!emailSnapshot.exists()) {
        return res.status(404).json({ success: false, message: "Trainer not found" });
      }
      emailSnapshot.forEach(child => {
        trainerKey = child.key;
        snapshot = child; // Re-assign for child.val()
      });
    }

    let profileData = snapshot.val ? snapshot.val() : snapshot;
    profileData.id = trainerKey;
    profileData.role = "trainer"; // Hardcode for safety

    delete profileData.password;

    return res.status(200).json({ success: true, profile: profileData });
  } catch (error) {
    console.error("[getTrainerProfile] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PUT /api/trainer/profile
// ═══════════════════════════════════════════════════════════════════════════
export const updateTrainerProfile = async (req, res) => {
  try {
    const { email, id } = req.user;
    let trainerKey = id;

    // 1. Verify trainer exists (try ID first, then fallback to Email lookup)
    let snapshot = await trainersRef.child(trainerKey).once("value");

    if (!snapshot.exists()) {
      console.log(`[updateTrainerProfile] Trainer not found by ID (${trainerKey}), falling back to email lookup...`);
      const emailSnapshot = await trainersRef.orderByChild("email").equalTo(email).once("value");
      if (!emailSnapshot.exists()) {
        console.error(`[updateTrainerProfile] Trainer NOT found even by email: ${email}`);
        return res.status(404).json({ success: false, message: `Trainer account not found for email: ${email}` });
      }
      emailSnapshot.forEach(child => {
        trainerKey = child.key;
      });
    }

    const fields = ['fullName', 'phone', 'location', 'experience', 'expertise', 'courses', 'mode', 'about', 'profileImage', 'role'];
    const updateData = {};

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length > 0) {
      await trainersRef.child(trainerKey).update(updateData);
    }

    // Fetch the absolute latest data from DB to ensure sync
    const updatedSnapshot = await trainersRef.child(trainerKey).once("value");
    const fullProfile = updatedSnapshot.val();
    fullProfile.id = trainerKey;
    fullProfile.role = "trainer"; // Hardcode for safety
    delete fullProfile.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: fullProfile,
      data: updateData
    });
  } catch (error) {
    console.error("[updateTrainerProfile] CRITICAL ERROR:", error.message);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/trainer/batches
// ═══════════════════════════════════════════════════════════════════════════
export const getTrainerBatches = async (req, res) => {
  try {
    const { email } = req.user;

    // 1. Get Trainer's full name from profile
    const trainerSnapshot = await trainersRef.orderByChild("email").equalTo(email).once("value");
    if (!trainerSnapshot.exists()) {
      return res.status(404).json({ success: false, message: "Trainer not found" });
    }

    let trainerFullName = "";
    trainerSnapshot.forEach(child => {
      trainerFullName = child.val().fullName || child.val().fullname || child.val().name;
    });

    // 2. Fetch all batches
    const batchesRef = db.ref("batch");
    const snapshot = await batchesRef.once("value");
    const batchesRaw = snapshot.val() || {};

    // 3. Filter and normalize
    const batches = Object.entries(batchesRaw)
      .map(([id, data]) => ({
        id: data.batchId || id,
        firebaseId: id,
        course: data.courseName || data.course,
        name: data.name || "",
        trainer: data.trainerName || data.trainer,
        students: parseInt(data.enrolled) || 0,
        capacity: parseInt(data.capacity) || 30,
        startDate: data.startDateTime ? data.startDateTime.split('T')[0] : "",
        startDateTime: data.startDateTime || "",
        endDate: "", // Logic to calculate endDate based on duration could go here
        duration: data.duration || "N/A",
        mode: "Online", // Defaulting to Online as per previous requirements
        status: data.status || "Active",
        lastUpdated: data.createdAt || new Date().toISOString()
      }))
      .filter(b => b.trainer === trainerFullName);

    return res.status(200).json({ success: true, batches });
  } catch (error) {
    console.error("[getTrainerBatches] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PUT /api/trainer/batches/:id/start  (also used by Admin via same endpoint)
// ═══════════════════════════════════════════════════════════════════════════
export const startBatch = async (req, res) => {
  try {
    const { id } = req.params; // firebase push key
    const { email, role } = req.user;
    const isAdmin = role === "admin";

    // 1. Resolve calling user's trainer profile (non-fatal for admins)
    const trainerSnapshot = await trainersRef.orderByChild("email").equalTo(email).once("value");
    let callerFullName = "";
    let callerTrainerKey = null;
    if (trainerSnapshot.exists()) {
      trainerSnapshot.forEach(child => {
        callerFullName = child.val().fullName || child.val().fullname || child.val().name || "";
        callerTrainerKey = child.key;
      });
    }

    // 2. Fetch batch
    const batchRef = db.ref("batch").child(id);
    const batchSnap = await batchRef.once("value");
    if (!batchSnap.exists()) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }
    const batchData = batchSnap.val();

    // 3. Re-activation guard — prevent starting an already-active batch
    if (batchData.status === "Active") {
      return res.status(400).json({
        success: false,
        message: "Batch has already been started. Cannot start it again."
      });
    }

    // 4. Authorization (admins bypass trainer check)
    if (!isAdmin) {
      if (!trainerSnapshot.exists()) {
        return res.status(404).json({ success: false, message: "Trainer not found" });
      }
      const assignedTrainer = batchData.trainerName || batchData.trainer || "";
      if (assignedTrainer !== callerFullName) {
        return res.status(403).json({ success: false, message: "You are not assigned to this batch" });
      }
    }

    // 5. Activate batch in Firebase
    const startedAt = new Date().toISOString();
    await batchRef.update({
      status: "Active",
      batchStatus: "started",
      batchStartedAt: startedAt,
      startedAt,
      lastUpdated: startedAt
    });

    // --- Friendly display values ------------------------------------------------
    const courseName = batchData.courseName || batchData.course || "the course";
    const batchName  = batchData.name || courseName;
    const trainerName = batchData.trainerName || batchData.trainer || "Your trainer";

    const startDisplay = batchData.startDateTime
      ? new Date(batchData.startDateTime).toLocaleString("en-US", {
          month: "long", day: "numeric", year: "numeric",
          hour: "2-digit", minute: "2-digit"
        })
      : (batchName.includes(" - ") ? batchName.split(" - ").pop() : new Date(startedAt).toLocaleString("en-US", {
          month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
        }));
    // ---------------------------------------------------------------------------

    // 6. Push in-app notification to the assigned trainer
    try {
      let targetTrainerKey = callerTrainerKey;

      // If admin started it, look up trainer by their name on the batch
      if (!targetTrainerKey && trainerName) {
        const nameSnap = await trainersRef.orderByChild("fullName").equalTo(trainerName).once("value");
        if (nameSnap.exists()) nameSnap.forEach(c => { targetTrainerKey = c.key; });
      }

      if (targetTrainerKey) {
        await db.ref("trainerNotifications").child(targetTrainerKey).child("items").push({
          title: `🚀 Batch Started: ${courseName}`,
          text:  `Your batch "${batchName}" (ID: ${batchData.batchId || id}) for ${courseName} has been officially activated. Scheduled start: ${startDisplay}. Please be ready to conduct the sessions.`,
          type:  "success",
          senderName: "Admin",
          senderRole: "admin",
          batchId: batchData.batchId || id,
          courseId: batchData.courseId || "",
          read: false,
          createdAt: Date.now()
        });
        console.log(`[startBatch] ✅ Notification sent to trainer key: ${targetTrainerKey}`);
      }
    } catch (notifErr) {
      console.error("[startBatch] ⚠️ Trainer notification failed:", notifErr.message);
    }

    // 7. Send batch-start emails to enrolled students (once only)
    if (batchData.emailSentAt) {
      console.log("[startBatch] ℹ️ Emails already sent at", batchData.emailSentAt, "— skipping.");
    } else {
      try {
        const sendEmail = (await import("../utils/sendEmail.js")).default;
        const studentsInBatch = batchData.students ? Object.values(batchData.students) : [];

        if (studentsInBatch.length > 0) {
          const emailPromises = studentsInBatch.map(student => {
            if (!student.email) return Promise.resolve();
            return sendEmail({
              to: student.email,
              subject: `🎉 Your Batch Has Started – ${courseName}`,
              html: `
                <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9fafb;border-radius:12px;">
                  <div style="background:linear-gradient(135deg,#3b82f6,#6366f1);border-radius:10px;padding:28px;text-align:center;margin-bottom:24px;">
                    <h1 style="color:white;margin:0;font-size:24px;">🚀 Your Batch Has Started!</h1>
                  </div>
                  <div style="background:white;border-radius:10px;padding:24px;">
                    <p style="color:#374151;font-size:16px;">Hello <strong>${student.name || "Student"}</strong>,</p>
                    <p style="color:#374151;font-size:15px;">
                      We are happy to inform you that your enrolled batch for <strong>${courseName}</strong> has officially started.
                    </p>
                    <div style="background:#f0f9ff;border-left:4px solid #3b82f6;border-radius:6px;padding:16px;margin:20px 0;">
                      <p style="margin:0 0 8px;color:#1e40af;font-size:14px;"><strong>📚 Batch Name:</strong> ${batchName}</p>
                      <p style="margin:0 0 8px;color:#1e40af;font-size:14px;"><strong>👨‍🏫 Trainer:</strong> ${trainerName}</p>
                      <p style="margin:0 0 8px;color:#1e40af;font-size:14px;"><strong>📅 Start Date &amp; Time:</strong> ${startDisplay}</p>
                      <p style="margin:0 0 8px;color:#1e40af;font-size:14px;"><strong>🆔 Batch ID:</strong> ${batchData.batchId || id}</p>
                      <p style="margin:0;color:#1e40af;font-size:14px;"><strong>🖥️ Mode:</strong> Online Live</p>
                    </div>
                    <p style="color:#374151;font-size:15px;">Please login to your <strong>InfyCode student dashboard</strong> for complete batch details and session links.</p>
                    <p style="color:#6b7280;font-size:13px;margin-top:24px;">Best regards,<br/><strong>The InfyCode Team</strong></p>
                  </div>
                </div>
              `
            }).catch(err => console.error(`[startBatch] Email failed → ${student.email}:`, err.message));
          });

          await Promise.allSettled(emailPromises);

          // Mark emails as sent — prevents re-send on duplicate clicks
          await batchRef.update({ emailSentAt: new Date().toISOString() });
          console.log(`[startBatch] ✅ Emails sent to ${studentsInBatch.length} students.`);
        } else {
          console.log("[startBatch] ℹ️ No students in batch — skipping emails.");
        }
      } catch (emailErr) {
        console.error("[startBatch] ⚠️ Email blast error:", emailErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Batch "${batchName}" started successfully! Trainer notified and student emails dispatched.`
    });
  } catch (error) {
    console.error("[startBatch] ❌ Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
