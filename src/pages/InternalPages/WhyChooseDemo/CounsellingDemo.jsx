import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiVideo, FiMic, FiMessageSquare, FiExternalLink, FiArrowRight } from "react-icons/fi";
import "./CounsellingDemo.css";

export default function CounsellingDemo() {
  const [isJoined, setIsJoined] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="counsel-container">
      <div className="counsel-v4-wrap">
        <header className="counsel-header-v4">
          <div className="live-indicator-v4">
            <span className="dot-v4"></span> Live Demo
          </div>
          <h1>Understanding Your Vision</h1>
          <p>This demo simulates a real-time interaction with an industry expert.</p>
        </header>

        {!isJoined ? (
          <motion.div 
            className="join-panel-v4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="expert-mini-v4">
              <img src="https://i.pravatar.cc/150?u=aris" alt="Dr. Aris" />
              <div className="m-info">
                <h4>Dr. Aris is waiting</h4>
                <span>Lead Architect @ InfyCode</span>
              </div>
            </div>
            <div className="cam-preview-v4">
              <FiVideo size={48} className="preview-icon" />
              <p>Camera is off for demo</p>
            </div>
            <button className="btn-join-v4" onClick={() => setIsJoined(true)}>
              Join Private Session
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className="session-active-v4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="video-grid-v4">
              <div className="v-card expert-v">
                <img src="https://i.pravatar.cc/400?u=aris" alt="Expert" />
                <span className="v-label">Dr. Aris (Expert)</span>
              </div>
              <div className="v-card user-v">
                <div className="v-placeholder">You (Demo)</div>
                <span className="v-label">User</span>
              </div>
            </div>

            <div className="chat-simulation-v4">
              <div className="chat-bubble-v4">
                <strong>Dr. Aris:</strong> "Hello! Based on your interest in Cloud, let's look at your roadmap."
              </div>
            </div>

            <div className="session-controls-v4">
              <div className="c-btn"><FiMic /></div>
              <div className="c-btn"><FiVideo /></div>
              <div className="c-btn"><FiMessageSquare /></div>
              <button className="btn-end-v4" onClick={() => navigate("/expert-consultation/roadmap")}>
                View My Roadmap <FiArrowRight />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Back Button */}
      <button className="global-back-btn-v4" onClick={() => navigate(-1)}>
        <FiArrowRight style={{ transform: "rotate(180deg)" }} /> Back
      </button>
    </div>
  );
}
