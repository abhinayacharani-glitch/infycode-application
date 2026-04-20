import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiFileText, FiCpu, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import "./MentorshipSteps.css"; // Reuse same styles

const steps = [
  { 
    id: "01", 
    title: "Step 1: Skill Assessment", 
    desc: "Answer questions designed to test real-world problem solving.", 
    icon: <FiFileText />,
    active: true,
    path: "/skill-test/foundational"
  },
  { 
    id: "02", 
    title: "Step 2: Performance Evaluation", 
    desc: "AI-driven analysis of your technical depth and consistency.", 
    icon: <FiCpu />,
    active: false,
    path: "/skill-test/evaluation"
  },
  { 
    id: "03", 
    title: "Step 3: Level Certification", 
    desc: "Get placed into Beginner, Intermediate, or Advanced track.", 
    icon: <FiTrendingUp />,
    active: false,
    path: "/skill-test/result"
  }
];

export default function SkillTestSteps() {
  const navigate = useNavigate();

  return (
    <div className="steps-page-v4">
      <div className="steps-container-v4">
        <header className="steps-header-v4">
          <h1>Data-Driven Skill Path</h1>
          <p>Discover where you stand in the current tech landscape using our proprietary assessment engine.</p>
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
