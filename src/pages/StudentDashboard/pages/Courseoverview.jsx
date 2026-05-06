import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COURSE_MAP } from './data/extraCourses';
import { useCourseContext } from '../../../context/CourseContext';
import {
  ArrowLeft,
  User,
  Calendar,
  Hash,
  Clock,
  Monitor,
  GraduationCap,
  Users,
  Lock,
  Layout,
  Video,
  ChevronRight
} from 'lucide-react';
import { getCourseImage } from '../../../utils/courseUtils';
import { getStudentBatchesAPI } from '../../../services/api';
import './Courseoverview.css';

const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const parse12HourToMinutes = (time12) => {
  if (!time12) return 0;
  const [time, suffix] = time12.split(' ');
  let [hour, minute] = time.split(':').map(Number);
  if (suffix === 'PM' && hour !== 12) hour += 12;
  if (suffix === 'AM' && hour === 12) hour = 0;
  return (hour * 60) + minute;
};

const formatCountdown = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
};

const getDayStatus = (dayName, dayData, now) => {
  if (dayData?.status === 'cancelled') {
    return { state: 'cancelled', text: `Cancelled` };
  }
  if (dayData?.status !== 'scheduled') return { state: 'completed', text: 'Over' };

  const currentDayIndex = (now.getDay() + 6) % 7;
  const itemDayIndex = daysOrder.indexOf(dayName);
  const startMinutes = parse12HourToMinutes(dayData.startTime);
  const endMinutes = parse12HourToMinutes(dayData.endTime);
  const nowMinutes = (now.getHours() * 60) + now.getMinutes();

  if (itemDayIndex === currentDayIndex) {
    if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
      return { state: 'live', text: 'Live Now' };
    }
    if (nowMinutes < startMinutes) {
      const target = new Date(now);
      target.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
      return { state: 'upcoming', text: `${formatCountdown(target.getTime() - now.getTime())}` };
    }
    return { state: 'completed', text: 'Over' };
  }

  if (itemDayIndex > currentDayIndex) {
    const target = new Date(now);
    target.setDate(now.getDate() + (itemDayIndex - currentDayIndex));
    target.setHours(Math.floor(startMinutes / 60), startMinutes % 60, 0, 0);
    return { state: 'upcoming', text: `Starts In: ${formatCountdown(target.getTime() - now.getTime())}` };
  }

  return { state: 'completed', text: 'Over' };
};

const getOverallStatus = (config, now) => {
  if (!config || !config.sessionLink) return 'no-link';
  const liveSessionRaw = localStorage.getItem('liveSessionData');
  const dayWiseData = liveSessionRaw ? JSON.parse(liveSessionRaw) : {};
  const todayName = daysOrder[(now.getDay() + 6) % 7];
  const todayStatus = getDayStatus(todayName, dayWiseData[todayName], now);
  if (todayStatus.state === 'live') return 'live';
  if (todayStatus.state === 'upcoming') return 'upcoming';
  return 'ended';
};

const CourseOverview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { publishedCourses } = useCourseContext();

  const courseIdFromState = location.state;
  const courseId = (typeof courseIdFromState === 'object' && courseIdFromState !== null)
    ? courseIdFromState.courseId || courseIdFromState.id
    : courseIdFromState || 'java-fs-01';

  let course = COURSE_MAP[courseId];

  // If not in hardcoded map, try to find it in published courses
  if (!course) {
    const published = publishedCourses.find(c => c.courseId === courseId || c.id === courseId);
    if (published) {
      course = {
        ...published,
        id: published.courseId || published.id,
        trainer: published.trainer || { name: 'Expert Instructor', role: 'Senior Mentor', experience: '10+ Years', specialization: published.category || 'Tech' },
        batch: published.batch || {
          name: 'Regular Batch',
          id: `BID-${(published.title || 'CRSE').substring(0, 4).toUpperCase()}-${new Date().getFullYear()}`,
          startDate: published.startDate || 'Next Week',
          timing: 'Flexible',
          duration: published.duration || '3 Months'
        },
        level: published.level || 'Beginner',
        modules: published.modules || [
          {
            id: 'mod1',
            label: 'Module 1',
            subtitle: 'Introduction',
            duration: '1 Week',
            color: '#10b981',
            topics: [{ id: 't1', title: `Getting Started with ${published.title}`, content: `<p>Welcome to the ${published.title} course!</p>` }]
          }
        ]
      };
    }
  }

  const [sessionStatus, setSessionStatus] = useState('no-link');
  const [sessionConfig, setSessionConfig] = useState(null);
  const [dayStatuses, setDayStatuses] = useState([]);
  const [myBatches, setMyBatches] = useState({});
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);

  // 1. Fetch student batches on mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await getStudentBatchesAPI();
        if (response.success) {
          setMyBatches(response.batches || {});
        }
      } catch (err) {
        console.error("Failed to fetch student batches:", err);
      } finally {
        setIsLoadingBatches(false);
      }
    };
    fetchBatches();

    // Polling every 1 second for near-instant updates
    const pollInterval = setInterval(fetchBatches, 1000);
    return () => clearInterval(pollInterval);
  }, []);

  // 2. Resolve Dynamic Course Data (Trainer & Batch)
  // If the student is assigned to a batch for this course, override details
  const dynamicCourse = React.useMemo(() => {
    if (!course) return null;

    // Try to find a match in myBatches by course title
    const batchMatch = Object.values(myBatches).find(b =>
      b.courseName === course.title ||
      b.batchName?.startsWith(course.title) ||
      b.courseId === course.id
    );

    const isStarted = batchMatch && (
      batchMatch.status === 'started' || 
      batchMatch.status === 'Active' || 
      batchMatch.batchStatus === 'started' || 
      batchMatch.batchStatus === 'Active'
    );

    if (batchMatch) {
      return {
        ...course,
        isStarted,
        trainer: batchMatch.trainer ? {
          name: batchMatch.trainer.name,
          role: batchMatch.trainer.specialization || 'Lead Instructor',
          experience: batchMatch.trainer.experience || '10+ Years',
          specialization: batchMatch.trainer.specialization || course.category || 'Expert',
          expertise: batchMatch.trainer.expertise || ''
        } : course.trainer,
        batch: {
          id: batchMatch.batchId,
          name: batchMatch.batchName,
          startDate: batchMatch.startDate || course.batch?.startDate,
          timing: batchMatch.startTime || batchMatch.timing || course.batch?.timing || 'Flexible',
          duration: batchMatch.duration || course.batch?.duration || '6 Months',
          mode: batchMatch.mode || 'Online'
        },
        meetLink: batchMatch.liveClassLink || ''
      };
    }

    return { ...course, isStarted: false };
  }, [course, myBatches]);

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem('live_session_config');
        const config = raw ? JSON.parse(raw) : null;
        const liveSessionRaw = localStorage.getItem('liveSessionData');
        const liveSessionData = liveSessionRaw ? JSON.parse(liveSessionRaw) : {};
        const now = new Date();
        const todayIndex = (now.getDay() + 6) % 7;
        const todayName = daysOrder[todayIndex];
        const tomorrowName = daysOrder[(todayIndex + 1) % 7];

        const computedStatuses = [
          { day: todayName, ...getDayStatus(todayName, liveSessionData[todayName], now) },
          { day: tomorrowName, ...getDayStatus(tomorrowName, liveSessionData[tomorrowName], now) },
        ];

        setSessionConfig(config);
        setSessionStatus(getOverallStatus(config, now));
        setDayStatuses(computedStatuses);
      } catch {
        setSessionStatus('no-link');
      }
    };

    check();
    const timer = setInterval(check, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!course) {
    return <div className="overview-error">Course not found.</div>;
  }

  const handleStart = () => navigate('/student-dashboard/course-explore', { state: courseId });
  const handleBack = () => navigate('/student-dashboard/courses');
  const handleJoin = () => {
    if (sessionStatus === 'live' && sessionConfig?.sessionLink) {
      window.open(sessionConfig.sessionLink, '_blank');
    }
  };

  const statusLabel = {
    'live': { text: 'Class is Live', className: 'status-live' },
    'upcoming': { text: sessionConfig ? `Starts at ${sessionConfig.startTime}` : 'Upcoming', className: 'status-upcoming' },
    'ended': { text: 'Session Ended', className: 'status-ended' },
    'expired': { text: 'Session Ended', className: 'status-ended' },
    'no-link': { text: 'Not Configured', className: 'status-none' },
  }[sessionStatus];

  const courseImage = getCourseImage(course);

  return (
    <div className="course-overview-page">
      <button className="co-back-btn" onClick={handleBack}>
        <ArrowLeft size={18} />
        <span>Back to Courses</span>
      </button>

      {/* Header Card */}
      <div className="co-hero">
        <div className="co-hero-bg">
          <img src={getCourseImage(dynamicCourse)} alt={dynamicCourse.title} className="co-hero-img" />
          <div className="co-hero-overlay"></div>
        </div>
        <div className="co-hero-left">
          <span className="co-level-badge">{dynamicCourse.level}</span>
          <h1 className="co-hero-title">{dynamicCourse.title}</h1>
          <p className="co-subtitle">Master technical skills with our comprehensive industry-grade curriculum and expert-led training.</p>
        </div>
        <div className="co-hero-right">
          <div className={`session-status-badge ${statusLabel.className}`}>
            <span className="status-dot"></span>
            {statusLabel.text}
          </div>
          <div className="co-day-status-list">
            {dayStatuses.map((item) => (
              <div key={item.day} className={`co-day-status-row ${item.state}`}>
                <span className="co-day-name">{item.day}</span>
                <span className="co-day-value">{item.text}</span>
              </div>
            ))}
          </div>
          <button
            className={`co-join-btn ${sessionStatus !== 'live' ? 'disabled' : ''}`}
            onClick={handleJoin}
            disabled={sessionStatus !== 'live'}
          >
            <Video size={18} />
            Join Live Class
          </button>
        </div>
      </div>

      {/* Info Layout (Trainer & Batch) - Only show if batch is started */}
      {dynamicCourse.isStarted && (
        <div className="co-info-layout">
          {/* Trainer Card */}
          <div className="co-info-card">
            <div className="co-info-header">
              <div className="co-header-icon">
                <User size={18} />
              </div>
              <h2>Trainer Details</h2>
            </div>
            <div className="co-trainer-main-pill">
              <div className="co-trainer-avatar-blue">{dynamicCourse.trainer?.name?.charAt(0)}</div>
              <div className="co-trainer-text">
                <div className="co-t-name">{dynamicCourse.trainer?.name}</div>
                <div className="co-t-role">{dynamicCourse.trainer?.role}</div>
              </div>
            </div>
            <div className="co-trainer-stats-row">
              <div className="co-stat-pill">
                <span className="co-pill-label">Experience</span>
                <span className="co-pill-value">{dynamicCourse.trainer?.experience || '10+ Years'}</span>
              </div>
              <div className="co-stat-pill">
                <span className="co-pill-label">Expertise</span>
                <span className="co-pill-value">{dynamicCourse.trainer?.expertise || dynamicCourse.trainer?.specialization || 'Technical Expert'}</span>
              </div>
            </div>
          </div>

          {/* Batch Card */}
          <div className="co-info-card">
            <div className="co-info-header">
              <div className="co-header-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <Calendar size={18} />
              </div>
              <h2>Batch Details</h2>
            </div>
            <div className="co-batch-grid">
              <div className="co-batch-pill">
                <span className="co-pill-label"><Hash size={12} /> Batch ID</span>
                <span className="co-pill-value">{dynamicCourse.batch?.id || 'BID-1240'}</span>
              </div>
              <div className="co-batch-pill">
                <span className="co-pill-label"><Clock size={12} /> Timing</span>
                <span className="co-pill-value">{dynamicCourse.batch?.timing}</span>
              </div>
              <div className="co-batch-pill">
                <span className="co-pill-label"><Calendar size={12} /> Start Date</span>
                <span className="co-pill-value">{dynamicCourse.batch?.startDate}</span>
              </div>
              <div className="co-batch-pill">
                <span className="co-pill-label"><Monitor size={12} /> Mode</span>
                <span className="co-pill-value">
                  {(() => {
                    const dur = dynamicCourse.batch?.duration || '4 Months';
                    const mod = (dynamicCourse.batch?.mode || 'Online').toLowerCase();
                    const durationStr = /weeks|months|days/i.test(dur) ? dur : `${dur} weeks`;
                    return `${durationStr} - ${mod}`;
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Objective Section */}
      <div className="co-objective-section">
        <div className="co-section-label">Course Objective</div>
        <p className="co-objective-text">
          {dynamicCourse.description || "Our curriculum is designed to bridge the gap between academic theory and industry reality. By combining deep-dive technical modules with hands-on labs and real-world project simulations, we ensure that you master the architecture and problem-solving mindset required by top-tier tech companies."}
        </p>
        <div className="co-benefits-grid">
          <div className="co-benefit-item">
            <div className="co-benefit-icon"><GraduationCap size={20} /></div>
            <div>
              <div className="co-benefit-label">
                {dynamicCourse.title?.toLowerCase().includes('ai') || dynamicCourse.title?.toLowerCase().includes('artificial') 
                  ? 'AI Fundamentals' 
                  : 'Multi-Cloud'}
              </div>
              <div className="co-benefit-desc">
                {dynamicCourse.title?.toLowerCase().includes('ai') || dynamicCourse.title?.toLowerCase().includes('artificial')
                  ? 'Learn the core concepts of Artificial Intelligence, including its history, types, machine learning basics, and real-world applications.'
                  : 'AWS, Azure & GCP covered'}
              </div>
            </div>
          </div>
          <div className="co-benefit-item">
            <div className="co-benefit-icon"><Users size={20} /></div>
            <div>
              <div className="co-benefit-label">Certified Trainers</div>
              <div className="co-benefit-desc">Industry experts only</div>
            </div>
          </div>
          <div className="co-benefit-item">
            <div className="co-benefit-icon"><Lock size={20} /></div>
            <div>
              <div className="co-benefit-label">Lifetime Access</div>
              <div className="co-benefit-desc">Recordings stay active</div>
            </div>
          </div>
          <div className="co-benefit-item">
            <div className="co-benefit-icon"><Layout size={20} /></div>
            <div>
              <div className="co-benefit-label">Hands-on Labs</div>
              <div className="co-benefit-desc">100+ Cloud exercises</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="co-cta-section">
        <button className="co-start-btn" onClick={handleStart}>
          Start Learning
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default CourseOverview;