/**
 * loginController.js
 *
 * Unified login endpoint: POST /api/login
 *
 * Routing logic:
 *   1. admin@charani.in   → hardcoded admin credentials → store lastLogin in Firestore
 *   2. *@outlook.com       → look up in `trainers` collection, bcrypt compare
 *   3. everything else    → look up in `students` collection, bcrypt compare
 */

import db from "../config/firebase.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// Firestore references
const studentsRef = db.collection("students");
const trainersRef = db.collection("trainers");
const usersRef = db.collection("users");   // for admin lastLogin record

// ---------------------------------------------------------------------------
// Hardcoded admin credentials (development / seeded admin)
// ---------------------------------------------------------------------------
const ADMIN_EMAIL = "admin@charani.in";
const ADMIN_PASSWORD = "Admin@520";

// ---------------------------------------------------------------------------
// POST /api/login
// ---------------------------------------------------------------------------
export const unifiedLogin = async (req, res) => {
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

      // Record lastLogin in Firestore  →  users/admin/
      await usersRef.doc("admin").set({
        email: ADMIN_EMAIL,
        role: "admin",
        lastLogin: Date.now(),
      }, { merge: true });

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
        .where("email", "==", normalizedEmail)
        .get();

      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "Trainer account not found. Please register first.",
        });
      }

      // If there are multiple documents (e.g. an application doc and a registration doc),
      // find the one that has a password set.
      let doc = snapshot.docs.find(d => d.data().password);
      if (!doc) {
        doc = snapshot.docs[0];
      }

      const userData = { id: doc.id, ...doc.data() };

      if (!userData.password) {
        return res.status(400).json({
          success: false,
          message: "Trainer account is not fully set up. Please register first.",
        });
      }

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
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    const doc = snapshot.docs[0];
    const userData = { id: doc.id, ...doc.data() };

    if (!userData.password) {
      return res.status(400).json({
        success: false,
        message: "Account is not fully set up. Please register first.",
      });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    userData.role = "student"; // Explicitly set role for safety
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

