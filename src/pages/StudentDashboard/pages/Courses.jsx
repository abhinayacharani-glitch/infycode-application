import React, { useState } from 'react';
import { COURSE_MAP } from './data/extraCourses';
import DashboardHero from '../components/DashboardHero';
import './Courses.css';

const categoryColors = {
  Intermediate: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  Beginner: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
  Advanced: { bg: '#fef2f2', text: '#ef4444', border: '#fecaca' },
};

const getCurrentTopic = (course) => {
  const allTopics = course.modules.flatMap(m => m.topics);
  if (allTopics.length === 0) return null;
  const idx = Math.min(Math.floor((course.progress / 100) * allTopics.length), allTopics.length - 1);
  return allTopics[idx];
};

const EnrolledCourseAccordion = ({ course, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const color = categoryColors[course.level] || categoryColors.Intermediate;

  const dynamicProgress = (() => {
    const saved = localStorage.getItem(`course_progress_${course.id}`);
    if (!saved) return course.progress || 0;

    const completedSet = new Set(JSON.parse(saved));
    const navList = [];
    course.modules.forEach((m, mIdx) => {
      m.topics.forEach((t, tIdx) => {
        navList.push({ type: 'topic_content', id: `topic_content::${m.id}::${t.id}` });
        if (mIdx === 0 && tIdx === 0)
          navList.push({ type: 'topic_practice', id: `topic_practice::${m.id}::${t.id}` });
        navList.push({ type: 'topic_assignment', id: `topic_assignment::${m.id}::${t.id}` });
      });
    });
    navList.push({ type: 'final', id: 'final::final::final' });

    const doneCount = Array.from(completedSet).length;
    return Math.round((doneCount / navList.length) * 100);
  })();

  const currentTopic = getCurrentTopic({ ...course, progress: dynamicProgress });

  const handleRowClick = () => {
    onNavigate('/student-dashboard/course-overview', course.id);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`ec-row-container ${isOpen ? 'is-open' : ''}`}>
      {/* Clicking the row (except the arrow) navigates to course overview */}
      <div className="ec-row-main" onClick={handleRowClick} style={{ cursor: 'pointer' }}>
        {/* Icon Col — stop propagation so it doesn't navigate */}
        <div className="ec-row-icon" style={{ background: color.bg }} onClick={e => e.stopPropagation()}>
          {course.id.includes('java') && (
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="10" y1="1" x2="10" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          )}
          {course.id.includes('python') && (
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path fill="#3776AB" d="M11.85 1.05c-1.28 0-2.43.14-3.48.42-3.04.82-3.04 2.45-3.04 2.45v2.8h6.8v1h-9.45s-3.45-.42-3.45 4.9c0 5.3 3.08 5.1 3.08 5.1h1.86v-2.65c0-2.55 2.16-4.7 4.7-4.7h6.2s3.04-.1 3.04-3.53V3.8c0-3.53-3.04-2.75-3.04-2.75h-4.26zm-2.75 1.63c.57 0 .98.41.98.98s-.41.98-.98.98-.98-.41-.98-.98.41-.98.98-.98zm14.4 7.37c0-5.3-3.08-5.1-3.08-5.1h-1.86v2.65c0 2.55-2.16 4.7-4.7 4.7h-6.2s-3.04.1-3.04 3.53v3.23c0 3.53 3.04 2.75 3.04 2.75h4.26c1.28 0 2.43-.14 3.48-.42 3.04-.82 3.04-2.45 3.04-2.45v-2.8h-6.8v-1h9.45s3.45.42 3.45-4.9zm-6.08 10.88c-.57 0-.98-.41-.98-.98s.41-.98.98-.98.98.41.98.98-.41.98-.98.98z" />
            </svg>
          )}
          {course.id.includes('cloud') && (
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19c-3.037 0-5.5-2.463-5.5-5.5s2.463-5.5 5.5-5.5S23 10.463 23 13.5 20.537 19 17.5 19z"></path>
              <path d="M6 18c-2.21 0-4-1.79-4-4s1.79-4 4-4c.32 0 .62.04.92.11C7.81 8.8 9.53 8 11.5 8c2.62 0 4.81 1.41 5.97 3.5"></path>
            </svg>
          )}
        </div>

        {/* Info Col */}
        <div className="ec-row-info">
          <h3 className="ec-row-title">{course.title}</h3>
          <div className="ec-row-meta">
            <span className="ec-row-trainer">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              {course.trainer?.name}
            </span>
            <span className="ec-row-dot">•</span>
            <span className="ec-row-time">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Active Now
            </span>
          </div>
        </div>

        {/* Status Col */}
        <div className="ec-row-status">
          <div className="ec-row-progress-text">{dynamicProgress}%</div>
          <div className={`ec-row-complete-badge ${dynamicProgress === 100 ? 'done' : ''}`}>
            {dynamicProgress === 100 ? 'COMPLETE' : 'IN PROGRESS'}
          </div>
        </div>

        {/* Toggle Col */}
        <div className="ec-row-toggle" onClick={(e) => { e.stopPropagation(); toggleDropdown(e); }}>
          <svg style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
        </div>
      </div>

      {/* Dropdown Content */}
      <div className={`ec-row-dropdown ${isOpen ? 'is-visible' : ''}`}>
        <div className="ec-dropdown-inner">
          <div className="ec-progress-section">
            <div className="ec-progress-header">
              <span>Overall Journey Progress</span>
              <span>{dynamicProgress}%</span>
            </div>
            <div className="ec-progress-bar">
              <div className="ec-progress-fill" style={{ width: `${dynamicProgress}%` }}></div>
            </div>
          </div>

          {currentTopic && (
            <div className="ec-current-topic-box-simple">
              <div className="ec-ct-label">RESUME FROM</div>
              <div className="ec-ct-row">
                <span className="ec-ct-name">{currentTopic.title}</span>
                <button
                  className="ec-ct-resume-btn"
                  onClick={(e) => { e.stopPropagation(); onNavigate('/student-dashboard/course-explore', { courseId: course.id, topicId: currentTopic.id }); }}
                >
                  Resume Learning
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EnrollCourses = ({ onNavigate }) => {
  const courses = Object.values(COURSE_MAP);

  return (
    <div className="enroll-page">
      <DashboardHero />
      
      <div className="enroll-course-grid">
        <header className="grid-header">
          <span className="enroll-badge">Enrolled Courses</span>
          <h2>Track Your Progress</h2>
        </header>
        {courses.map((course) => (
          <EnrolledCourseAccordion key={course.id} course={course} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
};

export default EnrollCourses;