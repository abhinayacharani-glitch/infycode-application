import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEnrolledCourses, getStudentBatchesAPI } from '../../../services/api';
import { useCourseContext } from '../../../context/CourseContext';
import { parseCurriculum, getCourseImage } from '../../../utils/courseUtils';
import { Play, ArrowRight, User, CalendarDays, Clock, Monitor, Mail, Phone, Video, ExternalLink, Users } from 'lucide-react';
import './Courses.css';

const getCurrentTopic = (course) => {
  const allTopics = course.modules.flatMap(m => m.topics);
  if (allTopics.length === 0) return null;
  const idx = Math.min(Math.floor((course.progress / 100) * allTopics.length), allTopics.length - 1);
  return allTopics[idx];
};

const STATUS_CONFIG = {
  Active: { label: 'Active', bg: '#dcfce7', color: '#16a34a' },
  started: { label: 'Started', bg: '#dcfce7', color: '#16a34a' },
  Ready: { label: 'Ready', bg: '#dbeafe', color: '#2563eb' },
  Scheduled: { label: 'Scheduled', bg: '#fef3c7', color: '#d97706' },
  Upcoming: { label: 'Upcoming', bg: '#fef3c7', color: '#d97706' },
  Completed: { label: 'Completed', bg: '#f1f5f9', color: '#64748b' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Scheduled;
  return (
    <span className="ecc-status-badge" style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
};

const EnrolledCourseCard = ({ course, batchInfo, onNavigate, index }) => {
  const dynamicProgress = (() => {
    const saved = localStorage.getItem(`course_progress_${course.id}`);
    if (!saved) return course.progress || 0;
    const completedSet = new Set(JSON.parse(saved));
    const navList = [];
    course.modules.forEach((m) => {
      m.topics.forEach((t) => {
        navList.push({ type: 'topic_content', id: `topic_content::${m.id}::${t.id}` });
        navList.push({ type: 'topic_assignment', id: `topic_assignment::${m.id}::${t.id}` });
      });
    });
    if (navList.length === 0) return course.progress || 0;
    return Math.round((Array.from(completedSet).length / navList.length) * 100);
  })();

  const currentTopic = getCurrentTopic({ ...course, progress: dynamicProgress });
  const courseImage = getCourseImage(course);
  const trainer = batchInfo?.trainer || null;
  const trainerInitial = trainer?.name ? trainer.name.charAt(0).toUpperCase() : '?';

  return (
    <motion.div
      className="enrolled-course-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="ecc-header">
        <img src={courseImage} alt={course.title} className="ecc-image" />
        {batchInfo?.status && (
          <div className="ecc-status-overlay">
            <StatusBadge status={batchInfo.status} />
          </div>
        )}
      </div>

      <div className="ecc-body">
        <h3 className="ecc-title">{course.title}</h3>

        {batchInfo && (
          <div className="ecc-batch-mode-indicator">
            {batchInfo.mode === 'Offline' ? <Users size={14} /> : <Monitor size={14} />}
            <span>
              {(() => {
                const dur = batchInfo.duration || '4 Months';
                const mod = (batchInfo.mode || 'Online').toLowerCase();
                const durationStr = /weeks|months|days/i.test(dur) ? dur : `${dur} weeks`;
                return `${durationStr} - ${mod}`;
              })()}
            </span>
          </div>
        )}

        <div className="ecc-progress-wrap">
          <div className="ecc-progress-header">
            <span>Course Progress</span>
            <span className="ecc-progress-percent">{dynamicProgress}%</span>
          </div>
          <div className="ecc-progress-bar">
            <motion.div
              className="ecc-progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${dynamicProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

      </div>


      <div className="ecc-footer">
        <button
          className="ecc-btn ecc-resume-btn"
          onClick={() => {
            if (currentTopic) {
              onNavigate('/student-dashboard/course-explore', { courseId: course.id, topicId: currentTopic.id });
            } else {
              onNavigate('/student-dashboard/course-overview', course.id);
            }
          }}
        >
          <Play size={14} fill="currentColor" />
          <span>Resume</span>
        </button>

        <button
          className="ecc-btn ecc-join-btn"
          onClick={() => {
            onNavigate('/student-dashboard/course-overview', { courseId: course.id });
          }}
        >
          <Video size={14} />
          <span>Join Class</span>
        </button>
      </div>
    </motion.div>
  );
};

const EnrollCourses = ({ onNavigate }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [studentBatches, setStudentBatches] = useState({});
  const [loading, setLoading] = useState(true);
  const { publishedCourses } = useCourseContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enrollData, batchData] = await Promise.allSettled([
          getEnrolledCourses(),
          getStudentBatchesAPI()
        ]);

        if (batchData.status === 'fulfilled' && batchData.value?.batches) {
          setStudentBatches(batchData.value.batches);
        }

        const data = enrollData.status === 'fulfilled' ? enrollData.value : [];
        const enrolledIds = Array.isArray(data) ? data : (data.enrolledCourses || []);

        const enrolled = enrolledIds.map(id => {
          // Find the full course details from publishedCourses
          const baseCourse = publishedCourses.find(c => c.id === id || c.courseId === id);
          if (baseCourse) {
            // Ensure modules are available by parsing curriculum if needed
            const modules = baseCourse.modules || parseCurriculum(baseCourse.curriculum);
            return {
              ...baseCourse,
              id: baseCourse.id || baseCourse.courseId,
              modules
            };
          }
          return null;
        }).filter(Boolean);

        setEnrolledCourses(enrolled);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };
    if (publishedCourses) fetchData();

    // Polling every 10 seconds to catch Admin batch-start events
    const pollInterval = setInterval(fetchData, 10000);
    return () => clearInterval(pollInterval);
  }, [publishedCourses]);

  if (loading) {
    return (
      <div className="enroll-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div className="loader" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="enroll-page">
      <header className="page-header-centered">
        <h2>Enrolled Courses</h2>
        <p>Keep track of your progress and continue your learning journey where you left off.</p>
      </header>

      <div className="enroll-course-grid">
        <div className="enroll-cards-wrapper">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course, index) => {
              // Match batch by course title (fuzzy)
              const batchInfo = Object.entries(studentBatches).find(
                ([courseName]) =>
                  courseName.toLowerCase().includes(course.title?.toLowerCase()) ||
                  course.title?.toLowerCase().includes(courseName.toLowerCase())
              )?.[1] || null;

              return (
                <EnrolledCourseCard
                  key={course.id}
                  course={course}
                  batchInfo={batchInfo}
                  onNavigate={onNavigate}
                  index={index}
                />
              );
            })
          ) : (
            <div className="no-courses-container">
              <h2 className="no-courses-title">No Enrolled Courses Found</h2>
              <p className="no-courses-text">Explore our directory and start your learning journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollCourses;