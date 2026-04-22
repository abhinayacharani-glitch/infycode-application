import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { FiCheck, FiTrash2, FiMessageSquare, FiUser, FiClock } from 'react-icons/fi';
import './FAQManagement.css';

const FAQManagement = () => {
  const { pendingFAQs, approveFAQ, deleteFAQ } = useAdmin();
  const [answeringId, setAnsweringId] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async (id) => {
    if (!answer.trim()) {
      alert("Please provide an answer before publishing.");
      return;
    }
    setIsSubmitting(true);
    try {
      await approveFAQ(id, answer);
      setAnsweringId(null);
      setAnswer('');
    } catch (err) {
      console.error("Failed to approve FAQ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteFAQ(id);
      } catch (err) {
        console.error("Failed to delete FAQ", err);
      }
    }
  };

  return (
    <div className="faq-mgmt-page">
      <div className="faq-mgmt-header">
        <h1>FAQ Management</h1>
        <p>Review and publish user-submitted questions.</p>
      </div>

      <div className="faq-mgmt-content">
        {pendingFAQs.length === 0 ? (
          <div className="no-pending-faqs">
            <FiMessageSquare className="empty-icon" />
            <h3>No pending questions</h3>
            <p>All submitted questions have been reviewed.</p>
          </div>
        ) : (
          <div className="faq-mgmt-grid">
            {pendingFAQs.map((faq) => (
              <div key={faq.id} className="faq-mgmt-card">
                <div className="faq-card-header">
                  <div className="user-info">
                    <div className="avatar">{faq.userName.charAt(0)}</div>
                    <div>
                      <h4>{faq.userName}</h4>
                      <span>{faq.userEmail}</span>
                    </div>
                  </div>
                  <div className="time-info">
                    <FiClock /> {new Date(faq.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="faq-card-body">
                  <p className="question-text">"{faq.question}"</p>
                  
                  {answeringId === faq.id ? (
                    <div className="answer-section">
                      <textarea
                        placeholder="Type your answer here..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows="4"
                      ></textarea>
                      <div className="answer-actions">
                        <button 
                          className="btn-cancel" 
                          onClick={() => { setAnsweringId(null); setAnswer(''); }}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn-publish" 
                          onClick={() => handleApprove(faq.id)}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Publishing..." : "Publish Answer"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mgmt-actions">
                      <button 
                        className="btn-answer" 
                        onClick={() => setAnsweringId(faq.id)}
                      >
                        <FiMessageSquare /> Answer & Publish
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDelete(faq.id)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQManagement;
