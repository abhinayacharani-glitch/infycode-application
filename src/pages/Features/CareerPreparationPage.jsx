import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiFileText, FiUserCheck, FiBriefcase, FiCheckCircle, FiStar } from "react-icons/fi";
import careerImg from "../../assets/career_preparation.png";
import "./FeaturePage.css";

const steps = [
  {
    number: "01",
    title: "Profile & Resume Build",
    desc: "Craft a compelling professional profile and resume with expert guidance and templates.",
    icon: <FiFileText size={24} />,
  },
  {
    number: "02",
    title: "Mock Interviews",
    desc: "Practice with industry-standard mock interviews and get detailed feedback to improve.",
    icon: <FiUserCheck size={24} />,
  },
  {
    number: "03",
    title: "Job Placement",
    desc: "Get matched with top hiring companies and confidently land your dream role.",
    icon: <FiBriefcase size={24} />,
  },
];

const benefits = [
  "Resume building with expert templates",
  "Mock interviews with real feedback",
  "Access to 200+ hiring companies",
  "Soft skills and communication training",
  "LinkedIn profile optimization",
  "Salary negotiation coaching",
];

export default function CareerPreparationPage() {
  const navigate = useNavigate();

  return (
    <div className="fp-page">
      <div className="fp-hero" style={{ background: "linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f97316 100%)" }}>
        <div className="fp-hero-inner">
          <button className="fp-back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft size={18} /> Back
          </button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="fp-hero-content"
          >
            <span className="fp-hero-tag">Feature 04</span>
            <h1 className="fp-hero-title">Career Preparation</h1>
            <p className="fp-hero-sub">
              From resume to offer letter — we prepare you for every step of the job-hunting journey with precision.
            </p>
            <button className="fp-cta-btn" onClick={() => navigate("/contact")}>
              Get Career Ready
            </button>
          </motion.div>
          <motion.div
            className="fp-hero-img-wrap"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img src={careerImg} alt="Career Preparation" className="fp-hero-img fp-hero-img-light" />
          </motion.div>
        </div>
      </div>

      <div className="fp-section">
        <div className="fp-container">
          <h2 className="fp-section-title">How It Works</h2>
          <p className="fp-section-sub">A structured 3-step career launch process designed for real-world success.</p>
          <div className="fp-steps-grid">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="fp-step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="fp-step-icon" style={{ background: "#fff7ed", color: "#ea580c" }}>
                  {step.icon}
                </div>
                <span className="fp-step-num">{step.number}</span>
                <h3 className="fp-step-title">{step.title}</h3>
                <p className="fp-step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="fp-section fp-section-gray">
        <div className="fp-container fp-two-col">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="fp-section-title">What You'll Unlock</h2>
            <p className="fp-section-sub">Everything you need to land the job you've been working towards.</p>
            <ul className="fp-benefits-list">
              {benefits.map((b, i) => (
                <li key={i} className="fp-benefit-item">
                  <FiCheckCircle size={18} style={{ color: "#ea580c", flexShrink: 0 }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="fp-stat-box" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="fp-stat-item">
              <span className="fp-stat-value">200+</span>
              <span className="fp-stat-label">Hiring Partners</span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">88%</span>
              <span className="fp-stat-label">Placement Rate</span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">4.8</span>
              <span className="fp-stat-label">Avg Rating <FiStar size={14} style={{ color: "#f59e0b" }} /></span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">60 days</span>
              <span className="fp-stat-label">Avg Time to Hire</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="fp-cta-section" style={{ background: "linear-gradient(135deg, #7c2d12, #f97316)" }}>
        <h2>Launch Your Dream Career Today</h2>
        <p>Join hundreds of students who got placed through InfyCode's career program.</p>
        <button className="fp-cta-btn fp-cta-btn-white" onClick={() => navigate("/contact")}>
          Get Started
        </button>
      </div>
    </div>
  );
}
