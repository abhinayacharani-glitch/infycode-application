import React from 'react';
import { GraduationCap, ShoppingCart, Lightbulb } from 'lucide-react';
import './Working.css';

function Working() {
  const steps = [
    {
      id: 1,
      title: "Register & Skill Assessment",
      desc: "Create your account and join the patform, Take the test to find your starting point.",
      icon: <GraduationCap size={32} />,
    },
    {
      id: 2,
      title: "Training &  Projects",
      desc: "Dive deep into learning with hands-on projects.",
      icon: <ShoppingCart size={32} />,
    },
    {
      id: 3,
      title: "Job Readiness",
      desc: "Get certified and land your dream role.",
      icon: <Lightbulb size={32} />,
    },
  ];

  return (
    <section className="section how-it-works-section">
      <div className="container">
        <div className="section-head-centered">
          <span className="sub-label-blue" style={{ color: "#3b82f6", fontWeight: "600" }}>Working Process</span>
          <h2 className="section-title-white" style={{ color: "white", fontSize: "2.5rem", marginTop: "0.5rem" }}>How Does It Work</h2>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-item" key={step.id}>
              <div className="step-diamond-wrap">
                <div className="step-diamond">
                  {step.icon}
                </div>
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              {index < steps.length - 1 && (
                <div className="step-arrow-wrap">
                  <svg width="120" height="40" viewBox="0 0 120 40" className="step-arrow-svg">
                    <path d="M10 20 Q60 0 110 20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6,6" />
                    <path d="M105 15 L115 20 L105 25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Working;
