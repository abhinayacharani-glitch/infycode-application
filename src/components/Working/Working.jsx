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
            <React.Fragment key={step.id}>
              <div className="step-item-card">
                <div className="step-card-left">
                  <div className="step-diamond">
                    {step.icon}
                  </div>
                </div>
                <div className="step-card-right">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="step-arrow-divider">
                  <svg width="80" height="40" viewBox="0 0 80 40">
                    <path d="M0 20 Q40 0 80 20" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M72 15 L80 20 L72 25" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Working;
