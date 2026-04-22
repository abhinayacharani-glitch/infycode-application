/**
 * authMiddleware.js
 *
 * Exports:
 *   verifyToken  — validates Bearer JWT and attaches decoded payload to req.user
 *   isAdmin      — role guard: admin only
 *   isTrainer    — role guard: trainer only
 *   isStudent    — role guard: student only
 *   checkRole    — generic role guard: checkRole(['admin', 'trainer'])
 */

import jwt from "jsonwebtoken";

// ─── VERIFY TOKEN ────────────────────────────────────────────────────────────
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  try {
    const token   = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user      = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

// ─── ADMIN CHECK ─────────────────────────────────────────────────────────────
export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access only" });
  }
  next();
};

// ─── STUDENT CHECK ───────────────────────────────────────────────────────────
export const isStudent = (req, res, next) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({ success: false, message: "Student access only" });
  }
  next();
};

// ─── TRAINER CHECK ───────────────────────────────────────────────────────────
export const isTrainer = (req, res, next) => {
  if (!req.user || req.user.role !== "trainer") {
    return res.status(403).json({ success: false, message: "Trainer access only" });
  }
  next();
};

// ─── GENERIC ROLE CHECK ──────────────────────────────────────────────────────
/**
 * checkRole(['admin'])               — single role
 * checkRole(['admin', 'trainer'])    — multiple roles (OR logic)
 */
export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};