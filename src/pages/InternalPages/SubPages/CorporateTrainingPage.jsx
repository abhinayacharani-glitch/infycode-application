import React, { useEffect } from 'react';
import './CorporateTrainingPage.css';

const CorporateTrainingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="corporate-page">
      <div
        className="corporate-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="corporate-hero-content">
          <h1>Corporate Training Solutions</h1>
          <p>Bespoke technical upskilling programs designed exclusively to accelerate your enterprise workforce.</p>
          <button className="corporate-hero-btn">Request a Syllabus</button>
        </div>
      </div>

      <div className="corporate-section">
        <div className="corporate-content-card">
          <h2 className="corporate-title">Why Choose INFYCODE for Corporate Training?</h2>
          <p className="corporate-desc">
            In the rapidly evolving tech landscape, maintaining a competitive edge requires continuous learning.
            Our Corporate Training division partners with enterprises to deliver high-impact, custom-tailored curriculums
            focusing directly on the technology stacks your teams utilize daily.
          </p>

          <ul className="corporate-feature-list">
            <li>Customized syllabus &amp; project scoping.</li>
            <li>On-premise or Remote Instructor-Led classes.</li>
            <li>Post-training assessments and metrics.</li>
            <li>Hands-on sandbox environments.</li>
            <li>Dedicated Account &amp; Success Manager.</li>
            <li>Flexible scheduling to maintain productivity.</li>
          </ul>

          <div className="corporate-cta-banner">
            <h2 className="corporate-cta-title">Transform your engineering team today.</h2>
            <button className="corporate-cta-btn">Contact Enterprise Sales</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateTrainingPage;
