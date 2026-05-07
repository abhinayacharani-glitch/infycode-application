import db from "../config/firebase.js";
import { sendFAQEmail } from "../services/emailService.js";

const faqsRef = db.collection("faqs");
const newFaqsRef = db.collection("FAQs"); // New collection for published FAQs

/**
 * @desc Get all published FAQs
 * @route GET /api/faqs
 */
export const getPublishedFAQs = async (req, res) => {
  try {
    const snapshot = await faqsRef.where("status", "==", "published").get();
    const faqs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ faqs });
  } catch (error) {
    console.error("Error fetching published FAQs:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

/**
 * @desc Submit a new FAQ question
 * @route POST /api/faqs
 */
export const submitFAQ = async (req, res) => {
  try {
    const { question, userEmail, userName } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const newFAQ = {
      question,
      userEmail: userEmail || "Anonymous",
      userName: userName || "Visitor",
      answer: "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const docRef = await faqsRef.add(newFAQ);
    res.status(201).json({ message: "Question submitted successfully for review", id: docRef.id });
  } catch (error) {
    console.error("Error submitting FAQ:", error);
    res.status(500).json({ error: "Failed to submit question" });
  }
};

/**
 * @desc Get all pending FAQs (Admin only)
 * @route GET /api/admin/faqs/pending
 */
export const getPendingFAQs = async (req, res) => {
  try {
    const snapshot = await faqsRef.where("status", "==", "pending").get();
    const faqs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ faqs });
  } catch (error) {
    console.error("Error fetching pending FAQs:", error);
    res.status(500).json({ error: "Failed to fetch pending FAQs" });
  }
};

/**
 * @desc Update/Approve FAQ (Admin only)
 * @route PUT /api/admin/faqs/:id
 */
export const updateFAQStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer, status } = req.body; // status could be 'published' or 'pending'

    const updateData = {};
    if (answer !== undefined) updateData.answer = answer;
    if (status !== undefined) updateData.status = status;
    updateData.updatedAt = new Date().toISOString();

    const docRef = faqsRef.doc(id);
    await docRef.update(updateData);
    
    const doc = await docRef.get();
    res.status(200).json({ message: "FAQ updated successfully", faq: { id, ...doc.data() } });
  } catch (error) {
    console.error("Error updating FAQ:", error);
    res.status(500).json({ error: "Failed to update FAQ" });
  }
};

/**
 * @desc Delete FAQ (Admin only)
 * @route DELETE /api/admin/faqs/:id
 */
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    await faqsRef.doc(id).delete();
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
};

/**
 * @desc Publish a new FAQ and send email notification
 * @route POST /publish-faq
 */
export const publishFAQ = async (req, res) => {
  try {
    const { question, answer, userEmail } = req.body;
    console.log(`[Backend] Publishing FAQ for: ${userEmail || "Anonymous"}`);
    
    if (!question || !answer) {
      return res.status(400).json({ error: "Question and answer are required" });
    }

    const emailToUse = userEmail || "gayathria.charani@gmail.com"; // Fallback to admin if user email is missing

    const docRef = newFaqsRef.doc();
    const newFAQ = {
      id: docRef.id,
      question,
      answer,
      userEmail: emailToUse,
      createdAt: new Date().toISOString(),
    };

    // Save data to Firestore under "FAQs" collection
    await docRef.set(newFAQ);

    // Send email to user (don't let email failure block the success response)
    sendFAQEmail(emailToUse, question, answer).catch(err => {
      console.error("Email delivery failed during publish:", err);
    });

    res.status(201).json({ message: "FAQ published successfully", faq: newFAQ });
  } catch (error) {
    console.error("Error publishing FAQ:", error);
    res.status(500).json({ error: "Failed to publish FAQ" });
  }
};

/**
 * @desc Get all FAQs from the new "FAQs" collection for the frontend
 * @route GET /published-faqs
 */
export const getNewPublishedFAQs = async (req, res) => {
  try {
    const snapshot = await newFaqsRef.get();
    const faqs = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ faqs });
  } catch (error) {
    console.error("Error fetching published FAQs from FAQs collection:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

