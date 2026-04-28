import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUsers, FiPlayCircle, FiCheckCircle, FiBriefcase, FiArrowRight } from "react-icons/fi";
import "./Features.css";
import skillImg from "../../assets/skill_evaluation.png";
import practicalImg from "../../assets/practical_learning.png";
import careerImg from "../../assets/career_preparation.png";

const featuresData = [
  {
    id: "01",
    title: "Mentorship & Guidance",
    hook: "Expert Support",
    icon: <FiUsers />,
    path: "/features/mentorship",
    color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800",
    bgMode: "cover"
  },
  {
    id: "02",
    title: "Practical Learning",
    hook: "Real-World Projects",
    icon: <FiPlayCircle />,
    path: "/features/practical-learning",
    color: "#10b981",
    image: practicalImg,
    bgMode: "cover"
  },
  {
    id: "03",
    title: "Skill Evaluation",
    hook: "Track Progress",
    icon: <FiCheckCircle />,
    path: "/features/skill-evaluation",
    color: "#8b5cf6",
    image: skillImg,
    bgMode: "cover",
    bgColor: "#faf5ff"
  },
  {
    id: "04",
    title: "Career Preparation",
    hook: "Job Readiness",
    icon: <FiBriefcase />,
    path: "/features/career-preparation",
    color: "#f97316",
    image: careerImg,
    bgMode: "cover",
    bgColor: "#eff6ff"
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
            InfyCode Features
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
              {/* Background Image & Overlays */}
              <div 
                className="card-bg-v4" 
                style={{ 
                  backgroundImage: `url(${feature.image})`,
                  backgroundSize: feature.bgMode || "cover",
                  backgroundColor: feature.bgColor || "transparent"
                }}
              />
              <div className="card-overlay-v4" />
              <div 
                className="card-hover-overlay-v4" 
                style={{ background: `linear-gradient(to bottom, transparent, ${feature.color}40)` }} 
              />

              <div className="card-content-wrapper-v4">
                <div className="card-top-v4">
                  <span className="step-num-v4">{feature.id}</span>
                </div>

                <div className="card-footer-v4">
                  <div className="card-content-v4">
                    <h3 className="card-title-v4">{feature.title}</h3>
                  </div>
                  <button className="learn-more-v4">
                    Explore Details <FiArrowRight className="arrow-v4" />
                  </button>
                </div>
              </div>
              
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}