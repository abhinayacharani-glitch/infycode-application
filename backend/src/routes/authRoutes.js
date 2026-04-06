import express from "express";
const router = express.Router();

import {
  studentRegister,
  studentLogin,
  verifyRegistrationOTP,
  resendRegistrationOTP,
} from "../controllers/authController.js";

import {
  verifyToken,
  isAdmin,
  isStudent,
} from "../middleware/authMiddleware.js";

// STUDENT
router.post("/student/register", studentRegister);
router.post("/student/login", studentLogin);

// REGISTRATION OTP (Admin/Trainer/Student)
router.post("/auth/verify-registration-otp", verifyRegistrationOTP);
router.post("/auth/resend-registration-otp", resendRegistrationOTP);

// DASHBOARDS
router.get("/student/dashboard", verifyToken, isStudent, (req, res) => {
  res.json({ message: "Welcome Student Dashboard" });
});

export default router;