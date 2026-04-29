import express from "express";
const router = express.Router();

import { adminDashboard, createBatch, getDashboardStats, getAdminProfile, updateAdminProfile } from "../controllers/adminController.js";
import { updateApplicationStatus } from "../controllers/trainerApplicationController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

// ✅ Admin Dashboard (protected — admin only)
router.get("/dashboard", verifyToken, isAdmin, adminDashboard);

// ✅ Admin Stats  (protected — admin only)
router.get("/stats", verifyToken, checkRole(["admin"]), getDashboardStats);

// ✅ Admin Batches  (protected — admin only)
router.post("/batches", verifyToken, checkRole(["admin"]), createBatch);

// ✅ Admin Profile (protected — admin only)
router.get("/profile", verifyToken, checkRole(["admin"]), getAdminProfile);
router.put("/profile", verifyToken, checkRole(["admin"]), updateAdminProfile);

// ✅ Admin Trainer Management (protected — admin only)
router.put("/trainers/:id/status", verifyToken, checkRole(["admin"]), updateApplicationStatus);
import { markAllStudentResultsAsSeen } from "../controllers/studentController.js";

// ✅ Admin Student Results Management (protected — admin only)
router.put("/student-results/mark-seen", verifyToken, checkRole(["admin"]), markAllStudentResultsAsSeen);

export default router;