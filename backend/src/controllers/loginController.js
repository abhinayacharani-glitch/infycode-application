/**
 * loginController.js
 *
 * Unified login endpoint: POST /api/login
 *
 * Routing logic:
 *   1. admin@charani.in   → hardcoded admin credentials → store lastLogin in Firebase
 *   2. *@outlook.com       → look up in `trainers` node, bcrypt compare
 *   3. everything else    → look up in `students` node, bcrypt compare
 */

import db from "../config/firebase.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Firebase references
const studentsRef = db.ref("students");
const trainersRef = db.ref("trainers");
const usersRef = db.ref("users");   // for admin lastLogin record

// ---------------------------------------------------------------------------
// Hardcoded admin credentials (development / seeded admin)
// ---------------------------------------------------------------------------
const ADMIN_EMAIL = "admin@charani.in";
const ADMIN_PASSWORD = "Admin@520";

// ---------------------------------------------------------------------------
// POST /api/login
// ---------------------------------------------------------------------------
export const unifiedLogin = async (req, res) => {
  let userData; // Declare here so it's available in all branches
  try {
    const { email, password } = req.body;

    // ── Basic validation ────────────────────────────────────────────────────
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Email format validation ─────────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // ════════════════════════════════════════════════════════════════════════
    // 1. ADMIN – hardcoded credentials
    // ════════════════════════════════════════════════════════════════════════
    if (normalizedEmail === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      // Build a lightweight user object for token generation
      const adminUser = {
        id: "admin", // Hardcoded ID for the root admin account
        email: ADMIN_EMAIL,
        role: "admin",
        fullName: "Admin",
      };

      const token = generateToken(adminUser);

      // Record lastLogin in Firebase  →  users/admin/
      await usersRef.child("admin").set({
        email: ADMIN_EMAIL,
        role: "admin",
        lastLogin: Date.now(),
      });

      return res.status(200).json({
        success: true,
        role: "admin",
        token,
        fullName: adminUser.fullName,
        email: adminUser.email,
      });
    }

    // ════════════════════════════════════════════════════════════════════════
    // 2. TRAINER – email ends with @outlook.com
    // ════════════════════════════════════════════════════════════════════════
    if (normalizedEmail.endsWith("@outlook.com")) {
      const snapshot = await trainersRef
        .orderByChild("email")
        .equalTo(normalizedEmail)
        .once("value");

      if (!snapshot.exists()) {
        return res.status(404).json({
          success: false,
          message: "Trainer account not found. Please register first.",
        });
      }

      let userData;
      snapshot.forEach((child) => {
        userData = child.val();
        userData.id = child.key;
      });

      // Validate password
      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Incorrect password",
        });
      }

      userData.role = "trainer"; // Ensure role is present for token generation
      const token = generateToken(userData);
      
      // Clean up sensitive data before sending
      const { password: _, ...safeUserData } = userData;

      return res.status(200).json({
        success: true,
        role: "trainer",
        token,
        ...safeUserData,
        fullName: userData.fullName || userData.fullname || userData.name,
        email: userData.email,
      });
    }

    // ════════════════════════════════════════════════════════════════════════
    // 3. STUDENT – fallback
    // ════════════════════════════════════════════════════════════════════════
    const snapshot = await studentsRef
      .orderByChild("email")
      .equalTo(normalizedEmail)
      .once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    snapshot.forEach((child) => {
      userData = child.val();
      userData.id = child.key;
    });

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = generateToken(userData);

    return res.status(200).json({
      success: true,
      role: "student",
      token,
      fullName: userData.fullName || userData.fullname || userData.username || userData.name,
      email: userData.email,
    });

  } catch (error) {
    console.error("[unifiedLogin] Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
