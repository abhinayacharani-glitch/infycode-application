import express from "express";
const router = express.Router();

import { trainerRegister, trainerVerifyOtp, trainerDashboard } from "../controllers/trainerRegController.js";
import { verifyToken, isTrainer } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

// ✅ Trainer Register  — POST /api/trainer/register
// Accepts: { email, password } — email MUST end with @trainer.com
router.post("/register", trainerRegister);

// ✅ Trainer OTP Verify — POST /api/trainer/verify-otp
// DEV MODE: always succeeds regardless of otp value
router.post("/verify-otp", trainerVerifyOtp);

// ✅ Trainer Dashboard  — GET /api/trainer/dashboard (protected)
router.get("/dashboard", verifyToken, checkRole(["trainer"]), trainerDashboard);

export default router;