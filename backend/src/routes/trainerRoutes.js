import express from "express";
const router = express.Router();

import { trainerRegister, trainerVerifyOtp, trainerDashboard, getTrainerProfile, updateTrainerProfile, getTrainerBatches, startBatch, getBatchStudents, getTrainerQueries, solveTrainerQuery, markQueryReadByTrainer, getQueryById } from "../controllers/trainerRegController.js";
import { submitApplication } from "../controllers/trainerApplicationController.js";
import { verifyToken, isTrainer } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  getTrainerNotifications,
  markNotificationsRead,
  sendTrainerNotification,
  deleteTrainerNotification,
  seedTrainerNotifications,
} from "../controllers/trainerNotificationController.js";

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
router.get("/batches/:batchId/students", verifyToken, isTrainer, getBatchStudents);
router.put("/batches/:id/start", verifyToken, checkRole(["admin", "trainer"]), startBatch);

// ✅ Trainer Queries (protected)
router.get("/queries", verifyToken, isTrainer, getTrainerQueries);
router.get("/queries/:queryId", verifyToken, isTrainer, getQueryById);
router.put("/queries/:queryId/solve", verifyToken, isTrainer, solveTrainerQuery);
router.put("/queries/:queryId/read", verifyToken, isTrainer, markQueryReadByTrainer);


// ✅ Trainer Notifications (protected — trainer only)
router.get("/notifications", verifyToken, isTrainer, getTrainerNotifications);
router.put("/notifications/mark-read", verifyToken, isTrainer, markNotificationsRead);
router.delete("/notifications/:id", verifyToken, isTrainer, deleteTrainerNotification);
router.post("/notifications/seed", verifyToken, isTrainer, seedTrainerNotifications);

// ✅ Send notification TO a trainer (admin or student can call this)
// Protected: caller must be logged in (admin/student/trainer)
router.post("/notifications", verifyToken, sendTrainerNotification);

export default router;