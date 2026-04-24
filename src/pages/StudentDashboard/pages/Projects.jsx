import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import './Projects.css';

import CertificateModule from '../components/CertificateModule';

const Projects = () => {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const userName = loggedUser.username || "Student";
// ... (omitting middle part as I'll target the card map)

  const projectCards = [
    {
      title: 'E-commerce UI Redesign',
      desc: 'A modern e-commerce dashboard focus on user experience and clean aesthetics.',
      progress: 100,
      img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
    },
    {
      title: 'AI Chatbot Integration',
      desc: 'Integrating OpenAI API for customer support with real-time response handling.',
      progress: 75,
      img: 'https://assets.bacancytechnology.com/main-boot-5/images/ai-intigration/banner.jpg?v-1' // Added AI Chatbot image
    },
    {
      title: 'SaaS Analytics Dashboard',
      desc: 'Visualizing complex data sets with interactive charts and real-time metrics.',
      progress: 60,
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
    }
  ];

  return (
    <div className="page-container">
      <header className="page-header-centered">
        <h2>Projects & Certificates</h2>
        <p>Showcase your technical milestones and earned credentials from InfyCode.</p>
      </header>

      <section className="projects-grid-modern">
        <h3 className="section-title-blue">Projects Status</h3> {/* Renamed Heading */}
        <div className="p-grid-equal">
          {projectCards.map((p, idx) => (
            <div key={idx} className={`p-card-premium-equal ${idx > 0 ? 'p-card-locked' : ''}`}>
              <div className="p-img-box">
                <img src={p.img} alt={p.title} />
              </div>
              <div className="p-content-flex">
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
                <div className="p-progress-box mt-auto">
                  <div className="p-p-info">
                    <span>Completion</span>
                    <span>{p.progress}%</span>
                  </div>
                  <div className="p-p-bar">
                    <div className="p-p-fill" style={{ width: `${p.progress}%` }}></div>
                  </div>
                </div>
                {idx === 0 && (
                  <button 
                    className="view-project-btn" 
                    onClick={() => navigate(`/student-dashboard/project-topics/${idx}`)}
                  >
                    View Details
                  </button>
                )}
              </div>
              
              {/* Lock Overlay for blurred projects */}
              {idx > 0 && (
                <div className="p-lock-overlay">
                  <div className="p-lock-content">
                    <FaLock className="p-lock-icon" />
                    <span>Locked</span>
                    <p>Complete current project to unlock</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <hr className="section-divider" />

      {/* Integrated Professional Certificate Module */}
      <section className="certificate-section-formal">
        <h3 className="section-title-blue">Official Certification</h3>
        
        <CertificateModule 
          studentName={userName}
          courseName="E-commerce UI Redesign"
          issueDate="March 19, 2026"
          certificateId="INFY-2026-8821"
        />
      </section>
    </div>
  );
};

export default Projects;