import express from "express";
const router = express.Router();

import { adminDashboard, createBatch, getDashboardStats } from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

// ✅ Admin Dashboard (protected — admin only)
router.get("/dashboard", verifyToken, isAdmin, adminDashboard);

// ✅ Admin Stats  (protected — admin only)
router.get("/stats", verifyToken, checkRole(["admin"]), getDashboardStats);

// ✅ Admin Batches  (protected — admin only)
router.post("/batches", verifyToken, checkRole(["admin"]), createBatch);

export default router;