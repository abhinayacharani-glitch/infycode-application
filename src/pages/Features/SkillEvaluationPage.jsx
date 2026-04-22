import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiActivity, FiBarChart2, FiAward, FiCheckCircle, FiStar } from "react-icons/fi";
import skillImg from "../../assets/skill_evaluation.png";
import "./FeaturePage.css";

const steps = [
  {
    number: "01",
    title: "Take Assessment",
    desc: "Answer carefully designed questions that test your real understanding of the subject.",
    icon: <FiActivity size={24} />,
  },
  {
    number: "02",
    title: "AI Evaluation",
    desc: "Our AI engine analyses your responses and identifies strengths and knowledge gaps.",
    icon: <FiBarChart2 size={24} />,
  },
  {
    number: "03",
    title: "Your Skill Level",
    desc: "Get placed into Beginner, Intermediate, or Advanced — with a tailored learning path.",
    icon: <FiAward size={24} />,
  },
];

const benefits = [
  "AI-powered skill gap analysis",
  "Personalized learning path suggestions",
  "Weekly progress tracking reports",
  "Certification upon skill mastery",
  "Benchmarked against industry standards",
  "Skill badges for your profile",
];

export default function SkillEvaluationPage() {
  const navigate = useNavigate();

  return (
    <div className="fp-page">
      <div className="fp-hero" style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #8b5cf6 100%)" }}>
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
            <span className="fp-hero-tag">Feature 03</span>
            <h1 className="fp-hero-title">Skill Evaluation</h1>
            <p className="fp-hero-sub">
              Know exactly where you stand. Our AI-driven assessments measure your skills and show you the precise path forward.
            </p>
            <button className="fp-cta-btn" onClick={() => navigate("/courses")}>
              Take Assessment
            </button>
          </motion.div>
          <motion.div
            className="fp-hero-img-wrap"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img src={skillImg} alt="Skill Evaluation" className="fp-hero-img fp-hero-img-light" />
          </motion.div>
        </div>
      </div>

      <div className="fp-section">
        <div className="fp-container">
          <h2 className="fp-section-title">How It Works</h2>
          <p className="fp-section-sub">A smart, 3-step process that accurately maps your current skill level.</p>
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
                <div className="fp-step-icon" style={{ background: "#f5f3ff", color: "#7c3aed" }}>
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
            <h2 className="fp-section-title">What You'll Gain</h2>
            <p className="fp-section-sub">Data-driven insights that accelerate your growth in the right direction.</p>
            <ul className="fp-benefits-list">
              {benefits.map((b, i) => (
                <li key={i} className="fp-benefit-item">
                  <FiCheckCircle size={18} style={{ color: "#7c3aed", flexShrink: 0 }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div className="fp-stat-box" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="fp-stat-item">
              <span className="fp-stat-value">5k+</span>
              <span className="fp-stat-label">Tests Taken</span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">98%</span>
              <span className="fp-stat-label">Accuracy Rate</span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">4.9</span>
              <span className="fp-stat-label">Avg Rating <FiStar size={14} style={{ color: "#f59e0b" }} /></span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">3</span>
              <span className="fp-stat-label">Skill Levels</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="fp-cta-section" style={{ background: "linear-gradient(135deg, #4c1d95, #7c3aed)" }}>
        <h2>Ready to Evaluate Your Skills?</h2>
        <p>Get a clear picture of where you stand and what to learn next.</p>
        <button className="fp-cta-btn fp-cta-btn-white" onClick={() => navigate("/courses")}>
          Start Assessment
        </button>
      </div>
    </div>
  );
}
