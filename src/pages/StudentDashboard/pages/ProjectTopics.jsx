import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaLaptopCode, FaRocket, FaFileCode, FaPlayCircle } from 'react-icons/fa';
import './Projects.css';

const ProjectTopics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const topics = [
    {
      id: 1,
      title: "UI/UX Analysis & Wireframing",
      desc: "Deep-dive into modern e-commerce user behavior and create high-fidelity prototypes using industry standards.",
      icon: <FaLaptopCode />,
      status: "Completed",
      duration: "4 Hours"
    },
    {
      id: 2,
      title: "React Component Architecture",
      desc: "Building a scalable and reusable component library for the dashboard including advanced state management.",
      icon: <FaFileCode />,
      status: "In Progress",
      duration: "6 Hours"
    },
    {
      id: 3,
      title: "Performance & SEO Optimization",
      desc: "Implementing lazy loading, code splitting, and metadata strategies to ensure a lightning-fast user experience.",
      icon: <FaRocket />,
      status: "Upcoming",
      duration: "3 Hours"
    }
  ];

  return (
    <div className="page-container project-topics-view">
      <button className="back-navigation-minimal" onClick={() => navigate('/student-dashboard/projects')}>
        <FaArrowLeft /> <span>Back</span>
      </button>

      <div className="project-topics-hero">
        <div className="hero-text-wrap">
          <div className="hero-badge-small">Project Curriculum</div>
          <h1>E-commerce UI Redesign</h1>
          <p>Master the complete development lifecycle of a modern web application through these targeted technical modules.</p>
        </div>
        <div className="hero-stats-wrap">
          <div className="stat-item">
            <span className="stat-val">3</span>
            <span className="stat-lbl">Modules</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">13</span>
            <span className="stat-lbl">Hours</span>
          </div>
        </div>
      </div>

      <div className="topics-timeline">
        {topics.map((topic, idx) => (
          <div key={topic.id} className={`topic-row-card ${topic.status.toLowerCase().replace(' ', '-')}`}>
            <div className="topic-icon-box">
              {topic.icon}
            </div>
            <div className="topic-main-info">
              <div className="topic-header-flex">
                <h3>{topic.title}</h3>
                <span className={`status-tag ${topic.status.toLowerCase().replace(' ', '-')}`}>
                  {topic.status === "Completed" && <FaCheckCircle />}
                  {topic.status}
                </span>
              </div>
              <p>{topic.desc}</p>
              <div className="topic-meta-flex">
                <span className="duration">⏱ {topic.duration}</span>
                <button className="topic-action-btn">
                  {topic.status === "Upcoming" ? "Unlock Module" : "Continue Learning"}
                  <FaPlayCircle />
                </button>
              </div>
            </div>
            <div className="connector-line"></div>
          </div>
        ))}
      </div>

      <div className="project-footer-completion">
        <div className="completion-card">
          <div className="completion-info">
            <h4>Next Milestone</h4>
            <p>Complete "React Component Architecture" to earn your intermediate module badge.</p>
          </div>
          <button className="primary-action-btn">Resume Project</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTopics;
