import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COURSE_MAP } from './data/extraCourses';
import './CourseOverview.css';

const CourseOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state || 'java-fs-01';
  const course = COURSE_MAP[courseId];

  if (!course) {
    return <div className="overview-error">Course not found.</div>;
  }

  const handleStart = () => {
    navigate('/student-dashboard/course-explore', { state: courseId });
  };

  const handleBack = () => {
    navigate('/student-dashboard/courses');
  };

  return (
    <div className="course-overview-page">
      <button className="co-back-btn" onClick={handleBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Courses
      </button>

      {/* Hero */}
      <div className="co-hero">
        <div className="co-hero-left">
          <span className="co-level-badge">{course.level}</span>
          <h1 className="co-hero-title">
            {course.title}
          </h1>
          <p className="co-subtitle">Explore the curriculum, meet your trainer, and get started on your learning journey.</p>
        </div>
        <div className="co-hero-right">
          <button className="co-join-btn" onClick={() => window.open('https://meet.google.com/new', '_blank')}>
            <div className="co-join-dot" />
            Join Live Class
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 10 20 5 20 19 15 14" /><rect x="2" y="5" width="13" height="14" rx="2" ry="2" /></svg>
          </button>
        </div>
      </div>

      {/* Trainer & Batch Row (Dual Cards) */}
      <div className="co-info-layout">
        
        {/* Left Side: Trainer Details */}
        <div className="co-info-card">
          <div className="co-info-header">
             <div className="co-header-icon trainer">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
             </div>
             <h2>Trainer Details</h2>
          </div>

          <div className="co-trainer-main-pill">
            <div className="co-trainer-avatar-blue">{course.trainer?.name?.charAt(0)}</div>
            <div className="co-trainer-text">
              <div className="co-t-name">{course.trainer?.name}</div>
              <div className="co-t-role">{course.trainer?.role}</div>
            </div>
          </div>

          <div className="co-trainer-stats-row">
             <div className="co-stat-pill">
               <div className="co-pill-label">EXPERIENCE</div>
               <div className="co-pill-value">{course.trainer?.experience}</div>
             </div>
             <div className="co-stat-pill">
               <div className="co-pill-label">SPECIALIZATION</div>
               <div className="co-pill-value">{course.trainer?.specialization?.split(',').slice(0, 3).join(', ')}</div>
             </div>
          </div>
        </div>

        {/* Right Side: Batch Details */}
        <div className="co-info-card">
          <div className="co-info-header">
            <div className="co-header-icon batch">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <h2>Batch Details</h2>
          </div>

          <div className="co-batch-grid">
            <div className="co-batch-pill">
               <div className="co-pill-label">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                 BATCH ID
               </div>
               <div className="co-pill-value">{course.batch?.id || 'BID-12'}</div>
            </div>

            <div className="co-batch-pill">
               <div className="co-pill-label">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                 TIMING
               </div>
               <div className="co-pill-value">{course.batch?.timing}</div>
            </div>

            <div className="co-batch-pill">
               <div className="co-pill-label">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                 START DATE
               </div>
               <div className="co-pill-value">{course.batch?.startDate}</div>
            </div>

            <div className="co-batch-pill">
               <div className="co-pill-label">
                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                 DURATION · MODE
               </div>
               <div className="co-pill-value">{course.batch?.duration}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Course Objective */}
      <div className="co-objective-section">
        <div className="co-section-label">Course Objective</div>
        <p className="co-objective-text">
          This comprehensive program is designed to bridge the gap between academic theory and industry reality.
          By combining deep-dive technical modules with hands-on labs and real-world project simulations, we ensure
          that you don't just learn the syntax—you master the architecture, best practices, and problem-solving
          mindset required by top-tier technology companies worldwide.
        </p>
        {course.benefits && (
          <div className="co-benefits-grid">
            {course.benefits.map((b, i) => (
              <div key={i} className="co-benefit-item">
                <span className="co-benefit-icon">
                  {b.icon === 'learning' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5a6 6 0 0 0 12 0v-5" /></svg>}
                  {b.icon === 'trainer' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                  {b.icon === 'access' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
                  {b.icon === 'projects' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
                </span>
                <div>
                  <div className="co-benefit-label">{b.label}</div>
                  <div className="co-benefit-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="co-cta-section">
        <button className="co-start-btn" onClick={handleStart}>
          Start Learning
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
        </button>
      </div>
    </div>
  );
};

export default CourseOverview;
