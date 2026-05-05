import express from "express";
const router = express.Router();
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controllers/calendarController.js";
import { verifyToken, isTrainer } from "../middleware/authMiddleware.js";

// All calendar routes require trainer authentication
router.use(verifyToken, isTrainer);

router.post("/events", createEvent);
router.get("/events", getEvents);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

export default router;
