import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiUsers, FiCalendar, FiMessageSquare, FiTrendingUp, FiCheckCircle, FiStar } from "react-icons/fi";
import "./FeaturePage.css";

const steps = [
  {
    number: "01",
    title: "Book a Session",
    desc: "Connect with industry experts based on your interests and learning goals.",
    icon: <FiCalendar size={24} />,
  },
  {
    number: "02",
    title: "Group Interaction",
    desc: "Engage in collaborative group sessions to learn from peers and mentors together.",
    icon: <FiUsers size={24} />,
  },
  {
    number: "03",
    title: "Career Direction",
    desc: "Get a clear personalized roadmap tailored to what suits your career path.",
    icon: <FiTrendingUp size={24} />,
  },
];

const benefits = [
  "Access to 50+ industry expert mentors",
  "Flexible 1-on-1 and group sessions",
  "Personalized career roadmap creation",
  "Resume and interview preparation",
  "Ongoing progress tracking",
  "Community support network",
];

export default function MentorshipPage() {
  const navigate = useNavigate();

  return (
    <div className="fp-page">
      {/* Hero */}
      <div className="fp-hero" style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)" }}>
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
            <span className="fp-hero-tag">Feature 01</span>
            <h1 className="fp-hero-title">Mentorship & Guidance</h1>
            <p className="fp-hero-sub">
              Expert mentors guide you through every step of your learning journey — from confusion to clarity.
            </p>
            <button className="fp-cta-btn" onClick={() => navigate("/contact")}>
              Book a Session
            </button>
          </motion.div>
          <motion.div
            className="fp-hero-img-wrap"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=700"
              alt="Mentorship"
              className="fp-hero-img"
            />
          </motion.div>
        </div>
      </div>

      {/* Steps */}
      <div className="fp-section">
        <div className="fp-container">
          <h2 className="fp-section-title">How It Works</h2>
          <p className="fp-section-sub">A simple 3-step process to connect with your ideal mentor.</p>
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
                <div className="fp-step-icon" style={{ background: "#eff6ff", color: "#2563eb" }}>
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

      {/* Benefits */}
      <div className="fp-section fp-section-gray">
        <div className="fp-container fp-two-col">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="fp-section-title">What You'll Get</h2>
            <p className="fp-section-sub">Everything you need for a guided, expert-led learning journey.</p>
            <ul className="fp-benefits-list">
              {benefits.map((b, i) => (
                <li key={i} className="fp-benefit-item">
                  <FiCheckCircle size={18} style={{ color: "#2563eb", flexShrink: 0 }} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            className="fp-stat-box"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="fp-stat-item">
              <span className="fp-stat-value">50+</span>
              <span className="fp-stat-label">Expert Mentors</span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">2k+</span>
              <span className="fp-stat-label">Students Guided</span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">4.9</span>
              <span className="fp-stat-label">Avg Rating <FiStar size={14} style={{ color: "#f59e0b" }} /></span>
            </div>
            <div className="fp-stat-item">
              <span className="fp-stat-value">95%</span>
              <span className="fp-stat-label">Satisfaction Rate</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA */}
      <div className="fp-cta-section" style={{ background: "linear-gradient(135deg, #1e3a8a, #2563eb)" }}>
        <h2>Ready to Connect with Your Mentor?</h2>
        <p>Join thousands of students already learning with expert guidance.</p>
        <button className="fp-cta-btn fp-cta-btn-white" onClick={() => navigate("/contact")}>
          Get Started Today
        </button>
      </div>
    </div>
  );
}
