import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLaptopCode, FaArrowLeft } from 'react-icons/fa';
import './MockInterview.css';

const MockTestList = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button className="back-navigation-minimal" onClick={() => navigate('/student-dashboard/mock-interview')}>
        <FaArrowLeft /> <span>Back</span>
      </button>

      <header className="page-header-centered">
        <h2>Available Mock Assessments</h2>
        <p>Choose an industry-standard test to evaluate your professional technical skills.</p>
      </header>

      <div className="assessments-grid">
        <div className="assessment-card premium-card">
          <div className="card-img-wrapper">
            <img src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800" alt="Frontend" />
          </div>
          <div className="card-body">
            <h4>Frontend Proficiency Test</h4>
            <p>Comprehensive evaluation of HTML5, CSS3, Modern JavaScript (ES6+), and React architecture.</p>
            <div className="card-meta-flex">
              <span>⏱ 45 Mins</span>
              <span>📝 30 Qs</span>
            </div>
            <button 
              className="primary-action-btn mt-auto"
              onClick={() => navigate('/student-dashboard/mock-test/frontend')}
            >
              Start Assessment
            </button>
          </div>
        </div>

        <div className="assessment-card premium-card">
          <div className="card-img-wrapper">
            <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" alt="Backend" />
          </div>
          <div className="card-body">
            <h4>Java Full Stack Challenge</h4>
            <p>Deep-dive into Java 17+, Spring Boot, Microservices, and Database management.</p>
            <div className="card-meta-flex">
              <span>⏱ 90 Mins</span>
              <span>📝 50 Qs</span>
            </div>
            <button 
              className="primary-action-btn mt-auto"
              onClick={() => navigate('/student-dashboard/mock-test/backend')}
            >
              Start Assessment
            </button>
          </div>
        </div>

        <div className="assessment-card premium-card">
          <div className="card-img-wrapper">
            <img src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=800" alt="Core Technical" />
          </div>
          <div className="card-body">
            <h4>Core Technical Aptitude</h4>
            <p>Master assessment for DBMS, OS principles, Networking basics, and complex Data Structures.</p>
            <div className="card-meta-flex">
              <span>⏱ 60 Mins</span>
              <span>📝 40 Qs</span>
            </div>
            <button 
              className="primary-action-btn mt-auto"
              onClick={() => navigate('/student-dashboard/mock-test/core')}
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestList;
