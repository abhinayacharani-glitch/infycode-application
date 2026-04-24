import express from "express";
import {
  getPublishedFAQs,
  submitFAQ,
  getPendingFAQs,
  updateFAQStatus,
  deleteFAQ,
  publishFAQ,
  getNewPublishedFAQs
} from "../controllers/faqController.js";

const router = express.Router();

// Public routes
router.get("/", getPublishedFAQs);
router.post("/", submitFAQ);
router.get("/published", getNewPublishedFAQs); // New endpoint for homepage

// Admin routes (In a real app, add auth middleware here)
router.get("/pending", getPendingFAQs);
router.put("/:id", updateFAQStatus);
router.delete("/:id", deleteFAQ);
router.post("/publish", publishFAQ); // New endpoint for publishing answers

export default router;
