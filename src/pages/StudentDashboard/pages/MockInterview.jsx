import React from 'react';
import { FaLaptopCode, FaUserGraduate, FaCheckCircle, FaCode, FaUsers, FaClipboardList } from 'react-icons/fa';
import './MockInterview.css';

const MockInterview = () => {
  return (
    <div className="page-container">
      <header className="page-header-centered">
        <h2>Mock Tests & Interviews</h2>
        <p>Comprehensive practice environments designed to simulate actual industry hiring standards.</p>
      </header>

      {/* Row 1: Equal Sized Cards */}
      <div className="mock-grid-equal">
        <div className="equal-card-wrapper">
          <div className="mock-header">
            <FaLaptopCode className="section-icon" />
            <h3>Mock Test Series</h3>
          </div>
          <div className="card-equal-height premium-card">
            <div className="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" alt="Mock Test" />
            </div>
            <div className="card-body">
              <h4>Industry Standard Assessment</h4>
              <p>Evaluate your technical aptitude with our timed assessments. Compete locally and gauge your ranking among peers to identify key improvement areas before the real interviews.</p>
              <div className="card-meta-flex">
                <span>⏱ 90 Minutes</span>
                <span>📝 60 Questions</span>
              </div>
              <button className="primary-action-btn mt-auto">Take Mock Test</button>
            </div>
          </div>
        </div>

        <div className="equal-card-wrapper">
          <div className="mock-header">
            <FaUserGraduate className="section-icon" />
            <h3>Preparation Hub</h3>
          </div>
          <div className="card-equal-height premium-card">
            <div className="card-img-wrapper">
              <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800" alt="Preparation Hub" />
            </div>
            <div className="card-body">
              <h4>Master Your Interview Pitch</h4>
              <ul className="prep-list-minimal">
                <li><FaCheckCircle className="text-success" /> Optimize Big O time and space complexity.</li>
                <li><FaCheckCircle className="text-success" /> Master behavioral "STAR" method responses.</li>
                <li><FaCheckCircle className="text-success" /> Review common Database schema designs.</li>
                <li><FaCheckCircle className="text-success" /> Conduct mock peer-to-peer technical reviews.</li>
              </ul>
              <button className="secondary-action-btn mt-auto">Access All Resources</button>
            </div>
          </div>
        </div>
      </div>

      <hr className="section-spacer" />

      {/* Row 2: Interview Types */}
      <div className="mock-header centered-header">
        <FaClipboardList className="section-icon" />
        <h3>Interview Categories</h3>
      </div>
      <div className="interview-types-grid">
        <div className="type-card premium-hover">
          <FaCode className="type-icon-lg" />
          <h4 className="title-blue">Technical Interview</h4>
          <p className="desc-black">Deep-dive into Data Structures, Algorithms, OS, and System Design paradigms.</p>
        </div>
        <div className="type-card premium-hover">
          <FaUsers className="type-icon-lg" />
          <h4 className="title-blue">HR & Behavioral</h4>
          <p className="desc-black">Assess cultural fit, communication skills, and situational problem-solving.</p>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;