import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBriefcase, FaFileAlt, FaCheckCircle, FaRocket, FaEdit } from 'react-icons/fa';
import './MockInterview.css';

const PreparationResources = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container preparation-hub-view">
      <button 
        className="back-navigation-minimal" 
        onClick={() => navigate('/student-dashboard/mock-interview')}
      >
        <FaArrowLeft /> <span>Back</span>
      </button>

      <div className="career-hero">
        <div className="hero-content">
          <h1>Career Excellence Hub</h1>
          <p>Master your professional identity. Our expert-curated resources will help you build a portfolio and resume that command attention.</p>
        </div>
        <div className="hero-badge">
          <FaRocket />
          <span>Level Up Your Career</span>
        </div>
      </div>

      <div className="resources-container">
        {/* Portfolio Section */}
        <div className="resource-detail-card portfolio-card">
          <div className="card-image-side">
            <img src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800" alt="Portfolio" />
            <div className="overlay-icon"><FaBriefcase /></div>
          </div>
          <div className="card-info-side">
            <div className="card-tag">Portfolio Resources</div>
            <h2>Showcase Your Technical Mastery</h2>
            <p>Your portfolio is the living proof of your skills. We provide the blueprint for building a technical showcase that speaks louder than words.</p>
            
            <div className="checklist-grid">
              <div className="check-item">
                <FaCheckCircle className="check-icon" />
                <span>Project Narrative Framework</span>
              </div>
              <div className="check-item">
                <FaCheckCircle className="check-icon" />
                <span>GitHub Repository Standards</span>
              </div>
              <div className="check-item">
                <FaCheckCircle className="check-icon" />
                <span>Deployment Strategy Guide</span>
              </div>
              <div className="check-item">
                <FaCheckCircle className="check-icon" />
                <span>Visual Design Principles</span>
              </div>
            </div>

            <div className="card-actions">
              <button className="primary-action-btn">Explore Templates</button>
              <button className="text-link-btn">View Best Examples</button>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="resource-detail-card resume-card">
          <div className="card-info-side">
            <div className="card-tag">Resume Resources</div>
            <h2>Impact-Driven Resume Building</h2>
            <p>Go beyond listing duties. Learn how to quantify your achievements and create a resume that passes both ATS filters and human scrutiny.</p>
            
            <div className="checklist-grid">
              <div className="check-item">
                <FaCheckCircle className="check-icon" />
                <span>ATS Optimization Checklist</span>
              </div>
              <div className="check-item">
                <FaCheckCircle className="check-icon" />
                <span>Action Verb Dictionary</span>
              </div>
              <div className="check-item">
                <FaCheckCircle className="check-icon" />
                <span>Impact Measurement Formula</span>
              </div>
              <div className="check-item">
                <FaCheckCircle className="check-icon" />
                <span>Role-Specific Customization</span>
              </div>
            </div>

            <div className="card-actions">
              <button className="primary-action-btn">Download Resume Guide</button>
              <button className="text-link-btn">Check ATS Score</button>
            </div>
          </div>
          <div className="card-image-side">
            <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800" alt="Resume" />
            <div className="overlay-icon"><FaFileAlt /></div>
          </div>
        </div>
      </div>

      <div className="hub-footer-note">
        <FaEdit />
        <span>Expert Tip: Your career assets should be updated every time you complete a major project or learn a new high-demand skill.</span>
      </div>
    </div>
  );
};

export default PreparationResources;
