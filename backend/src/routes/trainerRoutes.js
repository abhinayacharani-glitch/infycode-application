import express from "express";
const router = express.Router();

import { trainerRegister, trainerLogin, trainerDashboard } from "../controllers/TrainerController.js";
import { verifyToken, isTrainer } from "../middleware/authMiddleware.js";

// ✅ Trainer Register
router.post("/register", trainerRegister);

// ✅ Trainer Login
router.post("/login", trainerLogin);

// ✅ Trainer Dashboard
router.get("/dashboard", verifyToken, isTrainer, trainerDashboard);

export default router;