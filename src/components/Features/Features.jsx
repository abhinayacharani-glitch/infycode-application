import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiPlayCircle, FiCheckCircle, FiBriefcase, FiArrowRight } from "react-icons/fi";
import "./Features.css";

const featuresData = [
  {
    id: "01",
    title: "Mentorship & Guidance",
    hook: "Expert Support",
    icon: <FiUsers />,
    path: "/features/mentorship",
    color: "#2563eb"
  },
  {
    id: "02",
    title: "Practical Learning",
    hook: "Real-World Projects",
    icon: <FiPlayCircle />,
    path: "/features/practical-learning",
    color: "#059669"
  },
  {
    id: "03",
    title: "Skill Evaluation",
    hook: "Track Progress",
    icon: <FiCheckCircle />,
    path: "/features/skill-evaluation",
    color: "#7c3aed"
  },
  {
    id: "04",
    title: "Career Preparation",
    hook: "Job Readiness",
    icon: <FiBriefcase />,
    path: "/features/career-preparation",
    color: "#ea580c"
  }
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <section className="features-container">
      <div className="container-custom">
        <div className="features-intro">
          <motion.span 
            className="features-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Journey to Excellence
          </motion.span>
          <motion.h2 
            className="features-main-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Academic to Professional Journey
          </motion.h2>
          <motion.div 
            className="title-bar"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </div>

        <div className="features-v4-grid">
          {featuresData.map((feature, index) => (
            <motion.div 
              key={feature.id}
              className="feature-v4-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={{ 
                y: -15,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              onClick={() => navigate(feature.path)}
            >
                <div className="card-top-v4">
                  <span className="step-num-v4" style={{ color: feature.color, background: "none" }}>{feature.id}</span>
                  <div className="icon-box-v4" style={{ background: "rgba(0,0,0,0.03)", color: feature.color }}>
                    {feature.icon}
                  </div>
                </div>

              <div className="card-content-v4">
                <h3 className="card-title-v4">{feature.title}</h3>
                <p className="card-hook-v4" style={{ color: feature.color }}>{feature.hook}</p>
              </div>

              <div className="card-footer-v4">
                <button className="learn-more-v4" style={{ color: feature.color }}>
                  Explore Details <FiArrowRight className="arrow-v4" />
                </button>
              </div>
              
              <div className="card-accent-v4" style={{ backgroundColor: feature.color }}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}