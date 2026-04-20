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
    active: true,
    path: "/expert-consultation/book",
    color: "#2563eb"
  },
  { 
    id: "02", 
    title: "Step 2: Group Interaction", 
    desc: "Deep dive into your strengths, doubts, and aspirations with mentors and peers.", 
    icon: <FiInfo />,
    active: true,
    path: "/expert-consultation/session",
    color: "#059669"
  },
  { 
    id: "03", 
    title: "Step 3: Career Direction", 
    desc: "Receive a tailored roadmap designed specifically for your growth.", 
    icon: <FiCheckCircle />,
    active: true,
    path: "/expert-consultation/roadmap",
    color: "#7c3aed"
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
              style={step.active ? { borderColor: step.color, boxShadow: `0 20px 50px ${step.color}20` } : {}}
              whileHover={{ x: 10 }}
              onClick={() => navigate(step.path)}
            >
              <div className="step-num-large-v4" style={{ color: step.color }}>
                {step.id}
              </div>
              <div className="step-icon-wrap-v4">
                <div className="step-icon-v4" style={{ backgroundColor: step.color, color: 'white', borderColor: step.color }}>{step.icon}</div>
              </div>
              <div className="step-text-v4">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
              {step.active && (
                <div className="step-action-v4" style={{ backgroundColor: step.color }}>
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
