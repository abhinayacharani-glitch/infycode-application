import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="internal-page">
      <button className="modern-back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
      <div className="internal-hero about-hero">
        <div className="internal-hero-content">
          <h1>Pioneering Tech Education</h1>
          <p>Empowering the next generation of software engineers through industry-aligned training and hands-on experience.</p>
        </div>
      </div>

      <div className="internal-section">
        <div className="training-split about-split">
          <div className="training-text about-info-card">
            <span className="ct-category-tag">Our Story</span>
            <h2>Who We Are</h2>
            <p>
                Infycode Tech was founded with a single mission: to bridge the gap between academic learning and industry requirements. 
                We provide intensive, project-based training that prepares students for the challenges of modern software development.
            </p>
            <div className="about-stats">
                <div className="stat-item">
                    <h3>5K+</h3>
                    <p>Alumni</p>
                </div>
                <div className="stat-item">
                    <h3>120+</h3>
                    <p>Partner Companies</p>
                </div>
            </div>
          </div>
          <div className="training-image about-mission-card">
            <div className="mission-box">
                <h3>Our Mission</h3>
                <p>To democratize high-end technical education and create a world-class talent pool for the global tech ecosystem.</p>
            </div>
            <div className="mission-box secondary">
                <h3>Our Vision</h3>
                <p>To be the most trusted platform for career transformation and technical skill mastery by 2030.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
