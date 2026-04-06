import React, { useEffect } from 'react';
import './TrainingsPage.css';

const TrainingsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="trainings-page">
      <div
        className="trainings-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="trainings-hero-content">
          <h1>Professional Training Solutions</h1>
          <p>Empowering organizations and institutions with cutting-edge technical skills, bespoke curriculums, and industry-expert trainers.</p>
        </div>
      </div>

      <div className="trainings-section" id="corporate">
        <div className="trainings-split">
          <div className="trainings-img-wrap">
            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800" alt="Corporate Training" />
          </div>
          <div className="trainings-text">
            <h2>Corporate Training Programs</h2>
            <p>Upskill your workforce with targeted, intensive bootcamps focused on emerging technologies. We design comprehensive curriculums aligned directly with your company's technical stack and business objectives.</p>
            <ul className="trainings-feature-list">
              <li>Customized syllabus tailored to your project needs.</li>
              <li>Hands-on workshops and real-world project simulations.</li>
              <li>Flexible modes: On-site, remote, or hybrid delivery.</li>
              <li>Post-training skill assessments and performance tracking.</li>
            </ul>
          </div>
        </div>

        <div className="trainings-split reverse" id="institutional">
          <div className="trainings-img-wrap">
            <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" alt="Institutional Training" />
          </div>
          <div className="trainings-text">
            <h2>Institutional Partnerships</h2>
            <p>Bridge the gap between academic theory and industry expectations. INFYCODE partners with colleges and universities to offer students robust, job-oriented training paradigms right on campus.</p>
            <ul className="trainings-feature-list">
              <li>End-to-end semester-long technical workshops.</li>
              <li>Dedicated campus onboarding and portal integrations.</li>
              <li>Mock interviews, resume clinics, and placement assistance.</li>
              <li>Taught by senior software engineers and verified experts.</li>
            </ul>
          </div>
        </div>

        <div className="trainings-cta-banner">
          <h2>Ready to transform your team's capabilities?</h2>
          <p>Contact our enterprise solutions team to schedule a consultation and curriculum design session.</p>
          <button className="trainings-cta-btn">Connect With Sales</button>
        </div>
      </div>
    </div>
  );
};

export default TrainingsPage;
