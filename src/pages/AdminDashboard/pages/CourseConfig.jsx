import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import AdminPage from '../components/CourseManagement/AdminPage';
import CourseFeed from '../components/CourseManagement/CourseFeed';
import { CheckCircle2 } from 'lucide-react';

const CourseConfig = () => {
  const {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    toggleCourseLike
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'create'
  const [publishedTitle, setPublishedTitle] = useState('');

  const handleCoursePublished = (newCourse) => {
    setPublishedTitle(newCourse?.title || 'Your course');
    setActiveTab('feed');
    // Auto-clear success banner after 4 seconds
    setTimeout(() => setPublishedTitle(''), 4000);
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
          <CheckCircle2 size={20} color="#16a34a" />
          <span>🎉 <strong>"{publishedTitle}"</strong> was published successfully and is now live in the feed!</span>
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
