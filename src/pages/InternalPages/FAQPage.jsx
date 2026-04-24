import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNewPublishedFAQs, submitFAQ } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiChevronDown, FiMail, FiUser, FiMessageSquare, FiArrowLeft } from "react-icons/fi";
import "./FAQPage.css";

const FAQPage = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    question: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const data = await getNewPublishedFAQs();
      setFaqs(data.faqs || []);
    } catch (err) {
      console.error("Failed to load FAQs", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitFAQ(formData);
      setShowSuccess(true);
      setFormData({ userName: "", userEmail: "", question: "" });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error("Failed to submit FAQ", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="faq-page">
      <div className="faq-page-container">
        {/* Back Navigation */}
        <button onClick={() => navigate(-1)} className="faq-nav-back">
          <FiArrowLeft size={18} />
          <span>Go Back</span>
        </button>

        {/* Header Section */}
        <motion.div 
          className="faq-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Have any Questions?</h1>
          <p>Find answers to common questions about InfyCode or ask your own.</p>
          
          <div className="faq-search-wrapper">
            <FiSearch className="faq-search-icon" />
            <input
              type="text"
              placeholder="Search for answers..."
              className="faq-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* FAQ List Section */}
        <div className="faq-list">
          {loading ? (
            <div className="text-center py-10">Loading FAQs...</div>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                className={`faq-accordion-item ${activeId === faq.id ? "active" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="faq-accordion-header"
                  onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                >
                  <h3>{faq.question}</h3>
                  <div className="faq-accordion-icon">
                    <FiChevronDown />
                  </div>
                </div>
                <AnimatePresence>
                  {activeId === faq.id && (
                    <motion.div
                      className="faq-accordion-content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              {searchTerm ? `No results found for "${searchTerm}"` : "No FAQs available yet."}
            </div>
          )}
        </div>

        {/* Submission Form Section */}
        <motion.div 
          className="faq-submission-section"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="faq-submission-info">
            <h2>Didn't find your answer?</h2>
            <p>
              Submit your question here. Our team will review it and provide an answer. 
              Once approved, your question and its answer will appear on this page.
            </p>
            <div className="submission-visual">
              {/* Optional: Add an image or cool icon here */}
            </div>
          </div>

          <div className="faq-submission-form-wrapper">
            <form className="faq-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <input
                    type="text"
                    name="userName"
                    placeholder="John Doe"
                    required
                    value={formData.userName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <input
                    type="email"
                    name="userEmail"
                    placeholder="john@example.com"
                    required
                    value={formData.userEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Your Question</label>
                <textarea
                  name="question"
                  rows="4"
                  placeholder="Tell us what's on your mind..."
                  required
                  value={formData.question}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </button>

              {showSuccess && (
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiMessageSquare style={{ marginRight: '8px' }} />
                  Your question has been submitted! It will appear after admin approval.
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
