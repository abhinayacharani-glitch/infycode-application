import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEnrolledCourses } from '../../../services/api';
import { COURSE_MAP } from './data/extraCourses';
import { ALL_COURSES } from '../../../components/Courses/Courses';
import { useCourseContext } from '../../../context/CourseContext';
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

const EnrolledCourseCard = ({ course, onNavigate }) => {
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

  const courseMeta = ALL_COURSES.find(c => c.title === course.title) || course;
  const courseImage = courseMeta.image || course.image || 'https://via.placeholder.com/400x200?text=Course';

  return (
    <motion.div
      className="enrolled-course-card"
      onClick={handleRowClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="ecc-header" style={{ background: color.bg, overflow: 'hidden' }}>
        {courseImage ? (
          <img src={courseImage} alt={course.title} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
        ) : (
          <>
            {course.id.includes('java') && (
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
            )}
            {course.id.includes('python') && (
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="#3776AB" d="M11.85 1.05c-1.28 0-2.43.14-3.48.42-3.04.82-3.04 2.45-3.04 2.45v2.8h6.8v1h-9.45s-3.45-.42-3.45 4.9c0 5.3 3.08 5.1 3.08 5.1h1.86v-2.65c0-2.55 2.16-4.7 4.7-4.7h6.2s3.04-.1 3.04-3.53V3.8c0-3.53-3.04-2.75-3.04-2.75h-4.26zm-2.75 1.63c.57 0 .98.41.98.98s-.41.98-.98.98-.98-.41-.98-.98.41-.98.98-.98zm14.4 7.37c0-5.3-3.08-5.1-3.08-5.1h-1.86v2.65c0 2.55-2.16 4.7-4.7 4.7h-6.2s-3.04.1-3.04 3.53v3.23c0 3.53 3.04 2.75 3.04 2.75h4.26c1.28 0 2.43-.14 3.48-.42 3.04-.82 3.04-2.45 3.04-2.45v-2.8h-6.8v-1h9.45s3.45.42 3.45-4.9zm-6.08 10.88c-.57 0-.98-.41-.98-.98s.41-.98.98-.98.98.41.98.98-.41.98-.98.98z" />
              </svg>
            )}
            {course.id.includes('cloud') && (
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.5 19c-3.037 0-5.5-2.463-5.5-5.5s2.463-5.5 5.5-5.5S23 10.463 23 13.5 20.537 19 17.5 19z"></path>
                <path d="M6 18c-2.21 0-4-1.79-4-4s1.79-4 4-4c.32 0 .62.04.92.11C7.81 8.8 9.53 8 11.5 8c2.62 0 4.81 1.41 5.97 3.5"></path>
              </svg>
            )}
          </>
        )}
      </div>

      <div className="ecc-body">
        <h3 className="ecc-title">{course.title}</h3>
        <p className="ecc-trainer">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          {course.trainer?.name}
        </p>

        <div className="ecc-progress-wrap">
          <div className="ecc-progress-header">
            <span>Progress</span>
            <span style={{ color: dynamicProgress === 100 ? '#10b981' : '#2563eb' }}>{dynamicProgress}%</span>
          </div>
          <div className="ecc-progress-bar">
            <div className="ecc-progress-fill" style={{ width: `${dynamicProgress}%`, background: dynamicProgress === 100 ? '#10b981' : '#2563eb' }}></div>
          </div>
        </div>
      </div>

      <div className="ecc-footer">
        <button
          className="ecc-resume-btn"
          style={{ background: dynamicProgress === 100 ? '#10b981' : '#2563eb' }}
          onClick={(e) => {
            e.stopPropagation();
            if (currentTopic && dynamicProgress < 100) {
              onNavigate('/student-dashboard/course-explore', { courseId: course.id, topicId: currentTopic.id });
            } else {
              onNavigate('/student-dashboard/course-overview', course.id);
            }
          }}
        >
          {dynamicProgress === 0 ? 'Start Learning' : dynamicProgress === 100 ? 'Review Course' : 'Resume Learning'}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </motion.div>
  );
};

const EnrollCourses = ({ onNavigate }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { publishedCourses } = useCourseContext();

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const data = await getEnrolledCourses();
        // Assuming data is an array of IDs or an object with an enrolledCourses array
        const enrolledIds = Array.isArray(data) ? data : (data.enrolledCourses || []);

        const enrolled = [];
        enrolledIds.forEach(id => {
          if (COURSE_MAP[id]) {
            enrolled.push(COURSE_MAP[id]);
          } else {
            const matchedAllCourse = ALL_COURSES.find(c => c.courseId === id);
            if (matchedAllCourse) {
              const matchedMapCourse = Object.values(COURSE_MAP).find(c => c.title === matchedAllCourse.title);
              if (matchedMapCourse) {
                enrolled.push(matchedMapCourse);
              } else {
                // If not in map, just add the course itself
                enrolled.push({ ...matchedAllCourse, id: matchedAllCourse.courseId, modules: [] });
              }
            } else {
              const matchedPublishedCourse = publishedCourses.find(c => c.courseId === id);
              if (matchedPublishedCourse) {
                 enrolled.push({ ...matchedPublishedCourse, id: matchedPublishedCourse.courseId, modules: [] });
              }
            }
          }
        });

        setEnrolledCourses(enrolled);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };
    if (publishedCourses) fetchEnrolled();
  }, [publishedCourses]);

  if (loading) {
    return (
      <div className="enroll-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div className="loader">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="enroll-page">
      <div className="enroll-course-grid">
        {enrolledCourses.length > 0 ? (
          <div className="enroll-cards-wrapper">
            {enrolledCourses.map((course) => (
              <EnrolledCourseCard key={course.id} course={course} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 40px',
            color: '#ffffff',
            backgroundImage: "linear-gradient(90deg, rgba(47, 91, 211, 0.9) 0%, rgba(30, 60, 114, 0.9) 45%, rgba(42, 167, 214, 0.9) 100%), url('/course-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(30, 60, 114, 0.2)',
            border: 'none'
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#ffffff', fontWeight: 'bold' }}>You have not enrolled in any courses yet.</p>
            <p>Go to the Course Discovery section to find and enroll in new courses!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollCourses;