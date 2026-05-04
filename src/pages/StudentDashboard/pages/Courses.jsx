import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEnrolledCourses, getStudentBatchesAPI } from '../../../services/api';
import { COURSE_MAP } from './data/extraCourses';
import { ALL_COURSES } from '../../../components/Courses/Courses';
import { useCourseContext } from '../../../context/CourseContext';
import { Play, BookOpen, User, CalendarDays, Clock, Monitor, Mail, Phone, Video, ExternalLink } from 'lucide-react';
import { getCourseImage } from '../../../utils/courseUtils';
import './Courses.css';

const getCurrentTopic = (course) => {
  const allTopics = course.modules.flatMap(m => m.topics);
  if (allTopics.length === 0) return null;
  const idx = Math.min(Math.floor((course.progress / 100) * allTopics.length), allTopics.length - 1);
  return allTopics[idx];
};

const STATUS_CONFIG = {
  Active:     { label: 'Active',     bg: '#dcfce7', color: '#16a34a' },
  Ready:      { label: 'Ready',      bg: '#dbeafe', color: '#2563eb' },
  Scheduled:  { label: 'Scheduled',  bg: '#fef3c7', color: '#d97706' },
  Upcoming:   { label: 'Upcoming',   bg: '#fef3c7', color: '#d97706' },
  Completed:  { label: 'Completed',  bg: '#f1f5f9', color: '#64748b' },
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

        {/* Trainer & Batch Details */}
        {batchInfo && (
          <div className="ecc-details-grid">
            {/* ── Trainer Card ── */}
            <div className="ecc-detail-card">
              <div className="ecc-detail-card-header">
                <User size={14} />
                <span>Trainer Details</span>
              </div>

              <div className="ecc-trainer-info">
                {trainer?.profileImage ? (
                  <img src={trainer.profileImage} alt={trainer.name} className="ecc-trainer-photo" />
                ) : (
                  <div className="ecc-trainer-avatar">{trainerInitial}</div>
                )}
                <div>
                  <div className="ecc-trainer-name">{trainer?.name || 'TBD'}</div>
                  <div className="ecc-trainer-role">{trainer?.specialization || 'Trainer'}</div>
                </div>
              </div>

              <div className="ecc-trainer-contact">
                {trainer?.email && (
                  <a href={`mailto:${trainer.email}`} className="ecc-contact-row" title={trainer.email}>
                    <Mail size={11} />
                    <span>{trainer.email}</span>
                  </a>
                )}
                {trainer?.phone && (
                  <a href={`tel:${trainer.phone}`} className="ecc-contact-row" title={trainer.phone}>
                    <Phone size={11} />
                    <span>{trainer.phone}</span>
                  </a>
                )}
              </div>

              <div className="ecc-trainer-meta">
                {trainer?.experience && (
                  <div className="ecc-meta-item">
                    <span className="ecc-meta-label">EXPERIENCE</span>
                    <span className="ecc-meta-value">{trainer.experience}</span>
                  </div>
                )}
                {trainer?.specialization && (
                  <div className="ecc-meta-item">
                    <span className="ecc-meta-label">SPECIALIZATION</span>
                    <span className="ecc-meta-value">{trainer.specialization}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Batch Card ── */}
            <div className="ecc-detail-card">
              <div className="ecc-detail-card-header">
                <CalendarDays size={14} />
                <span>Batch Details</span>
              </div>

              <div className="ecc-batch-grid">
                <div className="ecc-batch-item">
                  <span className="ecc-meta-label"># BATCH ID</span>
                  <span className="ecc-meta-value">{batchInfo.batchId || 'N/A'}</span>
                </div>
                <div className="ecc-batch-item">
                  <span className="ecc-meta-label"><Monitor size={10} /> STATUS</span>
                  <StatusBadge status={batchInfo.status} />
                </div>
                <div className="ecc-batch-item">
                  <span className="ecc-meta-label"><CalendarDays size={10} /> START DATE</span>
                  <span className="ecc-meta-value">{batchInfo.startDate || 'TBD'}</span>
                </div>
                <div className="ecc-batch-item">
                  <span className="ecc-meta-label"><Clock size={10} /> START TIME</span>
                  <span className="ecc-meta-value">{batchInfo.startTime || 'TBD'}</span>
                </div>
                {batchInfo.duration && (
                  <div className="ecc-batch-item" style={{ gridColumn: '1 / -1' }}>
                    <span className="ecc-meta-label">DURATION</span>
                    <span className="ecc-meta-value">{batchInfo.duration} · Online Live</span>
                  </div>
                )}
              </div>

              {/* Live Class Link */}
              {batchInfo.liveClassLink && (
                <a
                  href={batchInfo.liveClassLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ecc-live-btn"
                >
                  <Video size={13} />
                  <span>Join Live Class</span>
                  <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        )}
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
          onClick={() => onNavigate('/student-dashboard/course-overview', course.id)}
        >
          <BookOpen size={14} />
          <span>Overview</span>
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
    if (publishedCourses) fetchData();
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