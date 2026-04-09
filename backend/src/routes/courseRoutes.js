import express from "express";
const router = express.Router();
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseLike
} from "../controllers/courseController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

// Public routes
router.get("/", getCourses);
router.post("/", verifyToken, isAdmin, createCourse);
router.put("/:id", verifyToken, isAdmin, updateCourse);
router.delete("/:id", verifyToken, isAdmin, deleteCourse);
router.put("/:id/like", verifyToken, toggleCourseLike);

export default router;
