import db from "../config/firebase.js";

const faqsRef = db.ref("faqs");

/**
 * @desc Get all published FAQs
 * @route GET /api/faqs
 */
export const getPublishedFAQs = async (req, res) => {
  try {
    const snapshot = await faqsRef.once("value");
    const data = snapshot.val() || {};
    const faqs = Object.entries(data)
      .map(([id, faq]) => ({ id, ...faq }))
      .filter((faq) => faq.status === "published")
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

    const newFAQRef = faqsRef.push();
    const newFAQ = {
      question,
      userEmail: userEmail || "Anonymous",
      userName: userName || "Visitor",
      answer: "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await newFAQRef.set(newFAQ);
    res.status(201).json({ message: "Question submitted successfully for review", id: newFAQRef.key });
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
    const snapshot = await faqsRef.once("value");
    const data = snapshot.val() || {};
    const faqs = Object.entries(data)
      .map(([id, faq]) => ({ id, ...faq }))
      .filter((faq) => faq.status === "pending")
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

    await faqsRef.child(id).update(updateData);
    
    const snapshot = await faqsRef.child(id).once("value");
    res.status(200).json({ message: "FAQ updated successfully", faq: { id, ...snapshot.val() } });
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
    await faqsRef.child(id).remove();
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    res.status(500).json({ error: "Failed to delete FAQ" });
  }
};
