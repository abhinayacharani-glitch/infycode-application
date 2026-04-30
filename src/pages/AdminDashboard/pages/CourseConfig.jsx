import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import AdminPage from '../components/CourseManagement/AdminPage';
import CourseFeed from '../components/CourseManagement/CourseFeed';
import CreateSyllabus from '../components/CourseManagement/CreateSyllabus';
const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

const PartyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.8 11.3 2 22l10.7-3.8" /><path d="M4 14.2c.4-.8.8-1.5 1.3-2.2" /><path d="M11 18c.8.5 1.5.9 2.2 1.3" /><path d="m19 10-1.5 1.5" /><path d="m21 12-1.5 1.5" /><path d="m21.2 8.4-1.2 1.2" /><path d="m18.4 11.2-1.2 1.2" /><circle cx="11" cy="4" r="2" /><circle cx="15" cy="9" r="2" /><circle cx="20" cy="5" r="2" /></svg>
);

const CourseConfig = () => {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    toggleCourseLike
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'create', or 'syllabus'
  const [publishedTitle, setPublishedTitle] = useState('');
  const [syllabusSuccess, setSyllabusSuccess] = useState(false);

  const handleCoursePublished = (newCourse) => {
    setPublishedTitle(newCourse?.title || 'Your course');
    setActiveTab('feed');
    // Auto-clear success banner after 4 seconds
    setTimeout(() => setPublishedTitle(''), 4000);
  };

  const handleSyllabusPublished = () => {
    setSyllabusSuccess(true);
    setActiveTab('create'); // Go back to create course to see new syllabus
    setTimeout(() => setSyllabusSuccess(false), 4000);
  };

  return (
    <div className="adm-course-config-wrapper" style={{ paddingBottom: '40px' }}>
      {/* ── Dashboard Header ── */}
      <div className="adm-page-header" style={{ marginBottom: '24px' }}>
        <h2 className="adm-page-title" style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>
          Course Management Portal
        </h2>
        <p className="adm-page-subtitle" style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          Publish new content, manage existing courses, and track learner engagement.
        </p>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="adm-tabs" style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '1.5px solid #dbeafe',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setActiveTab('feed')}
          className={`adm-tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: activeTab === 'feed' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'feed' ? '3px solid #2563eb' : '3px solid transparent',
            transition: 'all 0.3s ease'
          }}
        >
          Course Feed & Management
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`adm-tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: activeTab === 'create' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'create' ? '3px solid #2563eb' : '3px solid transparent',
            transition: 'all 0.3s ease'
          }}
        >
          Create New Course
        </button>
        <button
          onClick={() => setActiveTab('syllabus')}
          className={`adm-tab-btn ${activeTab === 'syllabus' ? 'active' : ''}`}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: '600',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: activeTab === 'syllabus' ? '#2563eb' : '#64748b',
            borderBottom: activeTab === 'syllabus' ? '3px solid #2563eb' : '3px solid transparent',
            transition: 'all 0.3s ease'
          }}
        >
          Create New Syllabus
        </button>
      </div>

      {/* ── Success Banner (shows in feed tab after publish) ── */}
      {activeTab === 'feed' && publishedTitle && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#f0fdf4', border: '1.5px solid #86efac',
          color: '#15803d', padding: '14px 18px', borderRadius: '12px',
          fontWeight: '600', fontSize: '0.95rem', marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(22,163,74,0.10)',
          animation: 'slideInBanner 0.3s ease-out'
        }}>
          <CheckCircleIcon />
          <span><PartyIcon /> <strong>"{publishedTitle}"</strong> was published successfully and is now live in the feed!</span>
        </div>
      )}

      {activeTab === 'create' && syllabusSuccess && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#eff6ff', border: '1.5px solid #93c5fd',
          color: '#1e40af', padding: '14px 18px', borderRadius: '12px',
          fontWeight: '600', fontSize: '0.95rem', marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(37,99,235,0.10)',
          animation: 'slideInBanner 0.3s ease-out'
        }}>
          <CheckCircleIcon />
          <span>New syllabus published! You can now load it from the dropdown below.</span>
        </div>
      )}

      {/* ── Content Area ── */}
      <div className="adm-course-content-area">
        {activeTab === 'create' ? (
          <div className="animate-fadeIn">
            <AdminPage
              onCoursePublished={handleCoursePublished}
              isEmbedded={true}
            />
          </div>
        ) : activeTab === 'syllabus' ? (
          <div className="animate-fadeIn">
            <CreateSyllabus onSyllabusPublished={handleSyllabusPublished} />
          </div>
        ) : (
          <div className="animate-fadeIn">
            <CourseFeed
              courses={courses}
              onToggleLike={toggleCourseLike}
              onUpdateCourse={updateCourse}
              onDeleteCourse={deleteCourse}
              isEmbedded={true}
            />
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .adm-tab-btn:hover {
          color: #2563eb !important;
          background: rgba(37, 99, 235, 0.04) !important;
          border-radius: 6px 6px 0 0;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInBanner {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default CourseConfig;
