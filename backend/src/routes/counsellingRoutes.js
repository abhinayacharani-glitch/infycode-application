import express from "express";
import { 
  bookSlot, 
  getAdminRequests, 
  assignTrainer, 
  getTrainerSessions, 
  getStudentSessions,
  checkAndShiftSlots
} from "../controllers/counsellingController.js";
import { verifyToken, isAdmin, isStudent, isTrainer } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/book", verifyToken, isStudent, bookSlot);
router.get("/requests", verifyToken, isAdmin, getAdminRequests);
router.put("/assign-trainer", verifyToken, isAdmin, assignTrainer);
router.post("/process-shifts", verifyToken, isAdmin, checkAndShiftSlots);
router.get("/trainer-sessions", verifyToken, isTrainer, getTrainerSessions);
router.get("/student-sessions", verifyToken, isStudent, getStudentSessions);

export default router;
