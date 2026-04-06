import express from "express";
const router = express.Router();

import { adminRegister, adminLogin, adminDashboard, createBatch } from "../controllers/adminController.js";
import { getDashboardStats } from "../controllers/admindashboardapis.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

// ✅ Admin Register
router.post("/register", adminRegister);

// ✅ Admin Login
router.post("/login", adminLogin);

// ✅ Admin Dashboard
router.get("/dashboard", verifyToken, isAdmin, adminDashboard);

// ✅ Admin Stats
router.get("/stats", verifyToken, isAdmin, getDashboardStats);

// ✅ Admin Batches
router.post("/batches", verifyToken, isAdmin, createBatch);

export default router;