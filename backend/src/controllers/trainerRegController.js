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
const usersRef    = db.ref("users");

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
    const resolvedName  = fullName || fullname || name || "";
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
    const trainerId      = shortId();
    const createdAt      = Date.now();

    // ── Save to  trainers/<push-id>/  ───────────────────────────────────────
    const newRef = trainersRef.push();
    await newRef.set({
      email:     normalizedEmail,
      fullName:  resolvedName.trim() || normalizedEmail.split("@")[0],
      phone:     resolvedPhone.trim(),
      password:  hashedPassword,
      role:      "trainer",
      trainerId,
      createdAt,
    });

    // ── Mirror to  users/trainer_<id>/  (as specified in the requirements) ──
    await usersRef.child(`trainer_${trainerId}`).set({
      email:     normalizedEmail,
      password:  hashedPassword,
      role:      "trainer",
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
        trainer: data.trainerName || data.trainer,
        students: parseInt(data.enrolled) || 0,
        capacity: parseInt(data.capacity) || 30,
        startDate: data.startDateTime ? data.startDateTime.split('T')[0] : "",
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

