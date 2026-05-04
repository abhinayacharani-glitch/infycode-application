import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './InstitutionalTrainingPage.css';

const InstitutionalTrainingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="institutional-page">
      <button className="modern-back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
      <div
        className="institutional-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="institutional-hero-content">
          <h1>Institutional Partnerships</h1>
          <p>Bridge the gap between academic theory and industry expectations. We partner with universities to enhance technical curriculums.</p>
          <button className="institutional-hero-btn">Partner with Us</button>
        </div>
      </div>

      <div className="institutional-section">
        <div className="institutional-content-card">
          <h2 className="institutional-title">Empower Your Students with Industry Skills</h2>
          <p className="institutional-desc">
            Academic degrees provide necessary foundations, but the modern job market demands specialized, hands-on experience.
            INFYCODE partners with academic institutions to deliver on-campus bootcamps, capstone mentorships, and specialized skill tracks (like Full Stack, AI, or Pre-Placement Training) directly to your student body.
          </p>

          <ul className="institutional-feature-list">
            <li>End-to-end semester skill programs.</li>
            <li>Train-the-Trainer (Faculty Development).</li>
            <li>Mock interviews &amp; soft-skill clinics.</li>
            <li>Industry-standard capstone projects.</li>
            <li>Direct tech-industry networking.</li>
            <li>Dedicated LMS dashboard integrations.</li>
          </ul>

          <div className="institutional-cta-banner">
            <h2 className="institutional-cta-title">Set your institution apart.</h2>
            <button className="institutional-cta-btn">Contact Academic Relations</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionalTrainingPage;
