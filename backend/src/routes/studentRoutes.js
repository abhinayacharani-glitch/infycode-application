import express from "express";
const router = express.Router();

import {
  saveTestResult,
  getStudentResults,
  getMyResults,
  enrollInCourse,
  getEnrolledCourses,
  getStudentProfile,
  updateStudentProfile,
  getStudentBatches
} from "../controllers/studentController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

// ✅ Profile Management
router.get("/profile", verifyToken, getStudentProfile);
router.put("/profile", verifyToken, updateStudentProfile);

// ✅ Student save results
router.post("/test-results", verifyToken, saveTestResult);

// ✅ Student fetch own results
router.get("/my-results", verifyToken, getMyResults);

// ✅ Student Enrollment
router.post("/enroll/:courseId", verifyToken, enrollInCourse);
router.get("/enrolled-courses", verifyToken, getEnrolledCourses);
router.get("/my-batches", verifyToken, getStudentBatches);

// ✅ Admin fetch all results
router.get("/admin/results", verifyToken, isAdmin, getStudentResults);

export default router;
