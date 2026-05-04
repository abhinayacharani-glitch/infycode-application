import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Star, Zap, Lightbulb, GraduationCap, User, Clock, Calendar, Hash, Monitor, Target, CheckCircle } from 'lucide-react';
import { useCourseContext } from '../context/CourseContext';
import { getMetadataForCourse, getTopicsForCourse } from '../data/courseTopicsData';
import './CourseTopics.css';

const levelConfig = {
  beginner: { label: 'Beginner Topics', icon: BookOpen, color: '#2563eb', bg: '#eff6ff' },
  intermediate: { label: 'Intermediate Topics', icon: Zap, color: '#f59e0b', bg: '#fffbeb' },
  advanced: { label: 'Advanced Topics', icon: Star, color: '#8b5cf6', bg: '#f5f3ff' },
};

const CourseTopics = () => {
  const { selectedSubtopic, setSelectedSubtopic, courseInfo } = useCourseContext();
  const metadata = useMemo(() => getMetadataForCourse(courseInfo.courseTitle), [courseInfo.courseTitle]);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const handleEnroll = () => {
    // Collect student data
    const loggedUserStr = localStorage.getItem("loggedUser");
    const loggedUser = loggedUserStr ? JSON.parse(loggedUserStr) : { username: "Guest Student" };
    
    const enrollmentData = {
      studentName: loggedUser.username,
      batchId: metadata.batch.id,
      batchTime: metadata.batch.timing,
      courseName: courseInfo.courseTitle || 'Course Curriculum',
      enrollmentDate: new Date().toISOString()
    };

    // Store in our mock "database" (localStorage)
    const existingEnrollments = JSON.parse(localStorage.getItem("enrolled_courses_db") || "[]");
    existingEnrollments.push(enrollmentData);
    localStorage.setItem("enrolled_courses_db", JSON.stringify(existingEnrollments));
    
    setIsEnrolled(true);
    alert(`Successfully enrolled in ${enrollmentData.courseName}! Data stored in database.`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const mainContent = document.querySelector('.dashboard-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [selectedSubtopic, courseInfo]);

  const flattenedTopics = useMemo(() => {
    const data = getTopicsForCourse(courseInfo.courseTitle) || {};
    const flat = [];
    ['beginner', 'intermediate', 'advanced'].forEach(level => {
      if (data[level]) {
        data[level].forEach(group => {
          if (group.subtopics) {
            group.subtopics.forEach(sub => {
              flat.push({ ...sub, level, groupName: group.name });
            });
          }
        });
      }
    });
    return flat;
  }, [courseInfo.courseTitle]);

  const currentIndex = selectedSubtopic 
    ? flattenedTopics.findIndex(t => t.title === selectedSubtopic.title && t.level === selectedSubtopic.level) 
    : -1;

  const prevTopic = currentIndex > 0 ? flattenedTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex !== -1 && currentIndex < flattenedTopics.length - 1 ? flattenedTopics[currentIndex + 1] : null;

  const subtopicToRender = useMemo(() => {
    if (!selectedSubtopic) return null;
    const s = { ...selectedSubtopic };
    if (!s.keyPoints || s.keyPoints.length === 0) {
      s.keyPoints = [
        `Understand the foundational elements of ${s.title}`,
        "Explore practical implementation guidelines",
        "Review real-world scenarios and examples",
        "Master industry best practices to avoid common pitfalls"
      ];
    }
    return s;
  }, [selectedSubtopic]);

  // ── LANDING PAGE (no subtopic selected) ──
  if (!selectedSubtopic) {
    return (
      <div className="ctp-landing">
        {/* Back to Courses - Top Right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <motion.button 
            className="ctp-back-btn-top"
            onClick={() => window.history.back()}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ marginBottom: 0 }}
          >
            Back to Courses
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {/* Course Heading */}
        <motion.div 
          className="ctp-landing-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Category Tag Removed As Requested */}
          <h1 className="ctp-landing-title">{courseInfo.courseTitle || 'Course Curriculum'}</h1>
          <p className="ctp-landing-subtitle">Explore the curriculum, meet your trainer, and get started on your learning journey.</p>
        </motion.div>


        {/* Course Objectives */}
        <motion.div 
          className="ctp-objectives-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="ctp-obj-header">
            <div className="ctp-card-icon-circle ctp-icon-purple">
              <Target size={20} />
            </div>
            <h3>Course Objectives</h3>
          </div>
          <p className="ctp-obj-desc" style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
            {metadata.description || "This comprehensive course is designed to equip you with the practical skills and theoretical knowledge required to excel in your field. Through a blend of hands-on projects, expert instruction, and structured modules, you will master the essential industry tools and techniques. By the end of this program, you will have achieved the following key learning outcomes:"}
          </p>
          <div className="ctp-obj-list">
            {metadata.objectives.map((obj, i) => (
              <motion.div 
                key={i} 
                className="ctp-obj-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
              >
                <CheckCircle size={18} className="ctp-obj-check" />
                <span>{obj}</span>
              </motion.div>
            ))}
          </div>
          
          {/* Enroll Button Action */}
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center' }}>
            <motion.button 
              onClick={handleEnroll}
              disabled={isEnrolled}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: isEnrolled ? '#10b981' : '#2563eb',
                border: 'none',
                borderRadius: '8px',
                cursor: isEnrolled ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)',
                transition: 'all 0.2s ease',
              }}
              whileHover={isEnrolled ? {} : { scale: 1.05, backgroundColor: '#1d4ed8' }}
              whileTap={isEnrolled ? {} : { scale: 0.95 }}
            >
              {isEnrolled ? (
                <>
                  <CheckCircle size={20} />
                  Enrolled Successfully
                </>
              ) : (
                <>
                  <GraduationCap size={20} />
                  Enroll Course
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Instruction hint */}
        <div className="ctp-landing-hint">
          <BookOpen size={16} />
          <span>Select a topic from the sidebar to start learning</span>
        </div>
      </div>
    );
  }

  // ── SUBTOPIC DETAIL VIEW ──
  return (
    <div className="ctp-content-only">
      {/* Back to Topics - Top Right */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <motion.button 
          className="ctp-back-btn-top"
          onClick={() => setSelectedSubtopic(null)}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ marginBottom: 0 }}
        >
          Back to {levelConfig[selectedSubtopic.level]?.label || 'Topics'}
          <ChevronRight size={16} />
        </motion.button>
      </div>

      <motion.div 
        key={subtopicToRender.title}
        className="ctp-detail-panel"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Breadcrumbs Removed as requested */}

        {/* Level Badge */}
        <div 
          className="ctp-detail-level-badge"
          style={{ 
            background: levelConfig[subtopicToRender.level]?.bg, 
            color: levelConfig[subtopicToRender.level]?.color 
          }}
        >
          {React.createElement(levelConfig[subtopicToRender.level]?.icon || BookOpen, { size: 14 })}
          {subtopicToRender.level.charAt(0).toUpperCase() + subtopicToRender.level.slice(1)}
        </div>

        {/* Title */}
        <h1 className="ctp-detail-title" style={{ fontWeight: 800 }}>{subtopicToRender.title}</h1>

        {/* Definition (was Overview) */}
        <div className="ctp-detail-desc-card">
          <div className="ctp-desc-icon">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3 className="ctp-desc-heading" style={{ fontWeight: 800 }}>Definition</h3>
            <p className="ctp-desc-text" style={{ fontWeight: 500, color: '#333333' }}>{subtopicToRender.description}</p>
          </div>
        </div>

        {/* RELATED EXAMPLES (NEW) */}
        {subtopicToRender.examples && (
          <div className="ctp-examples-section">
            <div className="ctp-ex-header">
              <Zap size={20} />
              <h3 style={{ fontWeight: 800 }}>Related Examples</h3>
            </div>
            <div className="ctp-ex-content">
              <pre><code>{subtopicToRender.examples}</code></pre>
            </div>
          </div>
        )}

        {/* Content (was Detailed Notes) */}
        <div className="ctp-notes-section">
          <div className="ctp-notes-header">
            <BookOpen size={20} />
            <h3 style={{ fontWeight: 800 }}>Content</h3>
          </div>
          <div className="ctp-notes-content">
            {subtopicToRender.notes ? (
              subtopicToRender.notes.split('\n\n').map((paragraph, i) => (
                <p key={i} className="ctp-notes-para" style={{ fontWeight: 500, color: '#333333' }}>
                  {paragraph.split(/(\*\*.*?\*\*)/).map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j} style={{ color: '#000000' }}>{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </p>
              ))
            ) : (
              <p className="ctp-notes-para">Detailed notes are being prepared for this topic. Please check back soon!</p>
            )}
          </div>
        </div>

        {/* KEY POINTS (NEW) */}
        {subtopicToRender.keyPoints && (
          <div className="ctp-examples-section" style={{ marginTop: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            <div className="ctp-ex-header" style={{ color: '#000000' }}>
              <CheckCircle size={20} />
              <h3 style={{ fontWeight: 800, color: '#000000' }}>Key Points</h3>
            </div>
            <div className="ctp-notes-content">
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontWeight: 500, lineHeight: 1.6, margin: 0, color: '#333333' }}>
                {subtopicToRender.keyPoints.map((point, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', color: '#333333' }}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="ctp-topic-navigation" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e2e8f0', paddingBottom: '20px' }}>
          {prevTopic ? (
            <button 
              onClick={() => setSelectedSubtopic(prevTopic)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600, color: '#334155', transition: 'all 0.2s', outline: 'none' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
              onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
            >
              <ChevronRight size={16} style={{ transform: 'rotate(180deg)', flexShrink: 0 }} />
              Previous
            </button>
          ) : <div />}
          
          {nextTopic ? (
            <button 
              onClick={() => setSelectedSubtopic(nextTopic)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', background: '#2563eb', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#ffffff', transition: 'all 0.2s', outline: 'none', marginLeft: 'auto' }}
              onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
            >
              Next
              <ChevronRight size={16} style={{ flexShrink: 0 }} />
            </button>
          ) : <div />}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseTopics;
