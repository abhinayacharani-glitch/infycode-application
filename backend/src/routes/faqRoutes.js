import express from "express";
import {
  getPublishedFAQs,
  submitFAQ,
  getPendingFAQs,
  updateFAQStatus,
  deleteFAQ,
} from "../controllers/faqController.js";

const router = express.Router();

// Public routes
router.get("/", getPublishedFAQs);
router.post("/", submitFAQ);

// Admin routes (In a real app, add auth middleware here)
router.get("/pending", getPendingFAQs);
router.put("/:id", updateFAQStatus);
router.delete("/:id", deleteFAQ);

export default router;
