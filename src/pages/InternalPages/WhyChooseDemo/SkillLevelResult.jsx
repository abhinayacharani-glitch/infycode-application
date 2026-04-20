import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAward, FiTrendingUp, FiZap, FiTarget, FiArrowRight, FiShield, FiStar } from "react-icons/fi";
import "./SkillLevelResult.css";

export default function SkillLevelResult() {
  const navigate = useNavigate();

  return (
    <div className="result-container">
      <motion.div 
        className="result-card-v4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="result-header-v4">
          <motion.div 
            className="award-wrap-v4"
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ repeat: Infinity, duration: 2, repeatType: "mirror" }}
          >
            <FiShield className="award-icon-v4" />
          </motion.div>
          <span className="result-tag-v4">AI Talent Analysis</span>
          <h1>Your Performance Profile</h1>
        </div>

        <div className="level-badge-v4 dark-theme-badge">
          <div className="badge-content-v4">
            <span className="level-label-v4">Industry Standing</span>
            <h2 className="level-title-v4">Advanced Specialist</h2>
            <div className="stars-row">
              {[1,2,3,4,5].map(i => <FiStar key={i} className="star-iconfill" />)}
            </div>
          </div>
          <div className="percentile-box-v4">
            <span className="percentile-num-v4">Top 5%</span>
            <span className="percentile-text-v4">Market Comparison</span>
          </div>
        </div>

        <div className="strengths-radar-placeholder">
          <div className="radar-header">
            <h3>Technical Radar</h3>
            <p>Your breakdown across core engineering pillars.</p>
          </div>
          <div className="radar-grid">
            {[
              { label: "Core Logic", val: 98, color: "#7c3aed" },
              { label: "Architecture", val: 85, color: "#3b82f6" },
              { label: "Optimization", val: 92, color: "#10b981" },
              { label: "Communication", val: 88, color: "#f59e0b" }
            ].map((s, i) => (
              <div key={i} className="radar-item">
                <div className="radar-label-wrap">
                  <span>{s.label}</span>
                  <strong>{s.val}%</strong>
                </div>
                <div className="radar-bar-bg">
                  <motion.div 
                    className="radar-bar-fill" 
                    initial={{ width: 0 }}
                    animate={{ width: `${s.val}%` }}
                    transition={{ delay: 0.5 + i*0.1, duration: 1 }}
                    style={{ background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recommended-track-v4 primary-blue-bg">
          <div className="track-info">
            <h3>Elite Engineering Track</h3>
            <p>Based on your <strong>92nd percentile</strong> score, you qualify for our exclusive **Fast-Track Senior Engineering Program**.</p>
          </div>
          <FiZap className="zap-icon-v4" />
        </div>

        <div className="result-actions-v4">
          <button className="btn-explore-v4 glow-effect" onClick={() => navigate("/courses")}>
            View Reserved Programs <FiArrowRight />
          </button>
          <button className="btn-back-action-v4" onClick={() => window.print()}>
            Download Report
          </button>
        </div>
      </motion.div>

      {/* Back Button */}
      <button className="global-back-btn-v4" onClick={() => navigate(-1)}>
        <FiArrowRight style={{ transform: "rotate(180deg)" }} /> Back
      </button>
    </div>
  );
}
