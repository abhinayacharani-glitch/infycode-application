import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiVideo, FiInfo, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import "./MentorshipSteps.css";

const steps = [
  { 
    id: "01", 
    title: "Step 1: Book a Session", 
    desc: "You connect with an expert based on your interests and goals.", 
    icon: <FiVideo />,
    active: false,
    path: "/expert-consultation/book"
  },
  { 
    id: "02", 
    title: "Step 2: 1-on-1 Interaction", 
    desc: "Deep dive into your strengths, doubts, and aspirations with a mentor.", 
    icon: <FiInfo />,
    active: true,
    path: "/expert-consultation/session"
  },
  { 
    id: "03", 
    title: "Step 3: Career Direction", 
    desc: "Receive a tailored roadmap designed specifically for your growth.", 
    icon: <FiCheckCircle />,
    active: false,
    path: "/expert-consultation/roadmap"
  }
];

export default function MentorshipSteps() {
  const navigate = useNavigate();

  return (
    <div className="steps-page-v4">
      <div className="steps-container-v4">
        <header className="steps-header-v4">
          <h1>Strategic Mentorship Path</h1>
          <p>Personalized guidance to help you navigate your career journey with confidence.</p>
        </header>

        <div className="vertical-steps-v4">
          {steps.map((step) => (
            <motion.div 
              key={step.id}
              className={`step-card-v4 ${step.active ? "active" : ""}`}
              whileHover={{ x: 10 }}
              onClick={() => navigate(step.path)}
            >
              <div className="step-icon-wrap-v4">
                <div className="step-icon-v4">{step.icon}</div>
                <span className="step-num-badge-v4">{step.id}</span>
              </div>
              <div className="step-text-v4">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              {step.active && (
                <div className="step-action-v4">
                  <FiArrowRight />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      <button className="global-back-btn-v4" onClick={() => navigate(-1)}>
        <FiArrowRight style={{ transform: "rotate(180deg)" }} /> Back
      </button>
    </div>
  );
}
