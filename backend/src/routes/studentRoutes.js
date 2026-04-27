import express from "express";
const router = express.Router();

import { saveTestResult, getStudentResults, getMyResults } from "../controllers/studentController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

// ✅ Student save results
router.post("/test-results", verifyToken, saveTestResult);

// ✅ Student fetch own results
router.get("/my-results", verifyToken, getMyResults);

// ✅ Admin fetch all results
router.get("/admin/results", verifyToken, isAdmin, getStudentResults);

export default router;
