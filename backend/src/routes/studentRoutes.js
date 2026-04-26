import express from "express";
const router = express.Router();
import { enrollInCourse, getEnrolledCourses } from "../controllers/studentController.js";
import { verifyToken, isStudent } from "../middleware/authMiddleware.js";

// All student routes require token and student role
router.use(verifyToken, isStudent);

router.post("/enroll/:courseId", enrollInCourse);
router.get("/enrolled-courses", getEnrolledCourses);

export default router;
