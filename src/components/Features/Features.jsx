import React from "react";
import { FiUsers, FiPlayCircle,FiCheckCircle, FiBriefcase } from "react-icons/fi";
import "./Features.css";

// ✅ Rename array
const featuresData = [
  {
    id: "01",
    title: "Mentorship & Guidance",
    desc: "Learn from industry experts and receive continuous support throughout your journey.",
    icon: <FiUsers />
  },
  {
    id: "02",
    title: "Practical Learning",
    desc: "Access interactive video lessons and work on real-world projects to build skills.",
    icon: <FiPlayCircle />
  },
  {
    id: "03",
    title: "Skill Evaluation",
    desc: "Take assessments to understand your level and access affordable programs tailored to you.",
    icon: <FiCheckCircle />
  },
  {
    id: "04",
    title: "Career Preparation",
    desc: "Prepare for interviews with expert trainers and structured guidance to achieve your goals.",
    icon: <FiBriefcase />
  }
];

export default function Features() {
  return (
    <section className="features">
      <p className="subtitle">InfyCode Features</p>
      <h2 className="title">Academic to Professional Journey</h2>

      <div className="features-grid">
        {featuresData.map((item) => (
          <div className="feature-card" key={item.id}>
            <div className="badge">{item.id}</div>

            <div className="icon-circle">
              {item.icon}
            </div>

            <h3 className="card-title">{item.title}</h3>
            <p className="card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}