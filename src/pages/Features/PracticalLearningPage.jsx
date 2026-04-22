import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCode, FiLayers, FiGitBranch, FiCheckCircle, FiStar } from "react-icons/fi";
import practicalImg from "../../assets/practical_learning.png";
import "./FeaturePage.css";

const steps = [
  {
    number: "01",
    title: "Learn Core Concepts",
    desc: "Start with structured, industry-relevant modules designed for real-world application.",
    icon: <FiCode size={24} />,
  },
  {
    number: "02",
    title: "Build Real Projects",
    desc: "Apply your skills immediately by building projects that mirror actual job requirements.",
    icon: <FiLayers size={24} />,
  },
  {
    number: "03",
    title: "Get Reviewed & Iterate",
    desc: "Receive expert code reviews and refine your work to professional standards.",
    icon: <FiGitBranch size={24} />,
  },
];

const benefits = [
  "Hands-on projects from Day 1",
  "Industry-standard tools and workflows",
  "Code reviews by senior engineers",
  "Portfolio-ready project submissions",
  "Collaborative team projects",
  "Real client simulation exercises",
];

export default function PracticalLearningPage() {
  const navigate = useNavigate();

  return (
    <div className="fp-page">
      <div className="fp-hero" style={{ background: "linear-gradient(135deg, #064e3b 0%, #059669 50%, #10b981 100%)" }}>
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
            <span className="fp-hero-tag">Feature 02</span>
            <h1 className="fp-hero-title">Practical Learning</h1>
            <p className="fp-hero-sub">
              Build real-world projects from Day 1. Learn by doing, not just watching — with hands-on assignments and live feedback.
            </p>
            <button className="fp-cta-btn" onClick={() => navigate("/courses")}>
              Explore Courses
            </button>
          </motion.div>
          <motion.div
            className="fp-hero-img-wrap"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img src={practicalImg} alt="Practical Learning" className="fp-hero-img" />
          </motion.div>
        </div>
      </div>

      <div className="fp-section">
        <div className="fp-container">
          <h2 className="fp-section-title">How It Works</h2>
          <p className="fp-section-sub">From theory to production-ready projects in 3 structured steps.</p>
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
                <div className="fp-step-icon" style={{ background: "#ecfdf5", color: "#059669" }}>
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
            <h2 className="fp-section-title">What You'll Build</h2>
            <p className="fp-section-sub">Real, portfolio-worthy projects that showcase your skills to employers.</p>
            <ul className="fp-benefits-list">
              {benefits.map((b, i) => (
                <li key={i} className="fp-benefit-item">
                  <FiCheckCircle size={18} style={{ color: "#059669", flexShrink: 0 }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="fp-stat-box" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="fp-stat-item">
              <span className="fp-stat-value">30+</span>
              <span className="fp-stat-label">Real Projects</span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">80%</span>
              <span className="fp-stat-label">Hands-on Time</span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">4.8</span>
              <span className="fp-stat-label">Avg Rating <FiStar size={14} style={{ color: "#f59e0b" }} /></span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">100%</span>
              <span className="fp-stat-label">Portfolio Ready</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="fp-cta-section" style={{ background: "linear-gradient(135deg, #064e3b, #10b981)" }}>
        <h2>Start Building Real Projects Today</h2>
        <p>Join thousands of students turning knowledge into practical skills.</p>
        <button className="fp-cta-btn fp-cta-btn-white" onClick={() => navigate("/courses")}>
          View Courses
        </button>
      </div>
    </div>
  );
}
