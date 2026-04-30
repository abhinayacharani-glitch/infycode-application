import express from "express";
const router = express.Router();

import { trainerRegister, trainerVerifyOtp, trainerDashboard, getTrainerProfile, updateTrainerProfile, getTrainerBatches } from "../controllers/trainerRegController.js";
import { submitApplication } from "../controllers/trainerApplicationController.js";
import { verifyToken, isTrainer } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

// ✅ Trainer Application Form — POST /api/trainer/apply (public)
router.post("/apply", submitApplication);

// ✅ Trainer Register  — POST /api/trainer/register
// Accepts: { email, password } — email MUST end with @trainer.com
router.post("/register", trainerRegister);

// ✅ Trainer OTP Verify — POST /api/trainer/verify-otp
// DEV MODE: always succeeds regardless of otp value
router.post("/verify-otp", trainerVerifyOtp);

// ✅ Trainer Dashboard  — GET /api/trainer/dashboard (protected)
router.get("/dashboard", verifyToken, checkRole(["trainer"]), trainerDashboard);

// ✅ Trainer Profile — GET & PUT /api/trainer/profile (protected)
router.get("/profile", verifyToken, isTrainer, getTrainerProfile);
router.put("/profile", verifyToken, isTrainer, updateTrainerProfile);

// ✅ Trainer Batches — GET /api/trainer/batches (protected)
router.get("/batches", verifyToken, isTrainer, getTrainerBatches);

export default router;