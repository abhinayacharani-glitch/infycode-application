import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COURSE_MAP } from './data/extraCourses';
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
  const courseId = location.state || 'java-fs-01';
  const course = COURSE_MAP[courseId];

  const [sessionStatus, setSessionStatus] = useState('no-link');
  const [sessionConfig, setSessionConfig] = useState(null);
  const [dayStatuses, setDayStatuses] = useState([]);

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
          <img src={courseImage} alt={course.title} className="co-hero-img" />
          <div className="co-hero-overlay"></div>
        </div>
        <div className="co-hero-left">
          <span className="co-level-badge">{course.level}</span>
          <h1 className="co-hero-title">{course.title}</h1>
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

      {/* Info Layout (Trainer & Batch) */}
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
            <div className="co-trainer-avatar-blue">{course.trainer?.name?.charAt(0)}</div>
            <div className="co-trainer-text">
              <div className="co-t-name">{course.trainer?.name}</div>
              <div className="co-t-role">{course.trainer?.role}</div>
            </div>
          </div>
          <div className="co-trainer-stats-row">
            <div className="co-stat-pill">
              <span className="co-pill-label">Experience</span>
              <span className="co-pill-value">{course.trainer?.experience || '10+ Years'}</span>
            </div>
            <div className="co-stat-pill">
              <span className="co-pill-label">Specialization</span>
              <span className="co-pill-value">{course.trainer?.specialization?.split(',')[0] || 'Technical Expert'}</span>
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
              <span className="co-pill-value">{course.batch?.id || 'BID-1240'}</span>
            </div>
            <div className="co-batch-pill">
              <span className="co-pill-label"><Clock size={12} /> Timing</span>
              <span className="co-pill-value">{course.batch?.timing}</span>
            </div>
            <div className="co-batch-pill">
              <span className="co-pill-label"><Calendar size={12} /> Start Date</span>
              <span className="co-pill-value">{course.batch?.startDate}</span>
            </div>
            <div className="co-batch-pill">
              <span className="co-pill-label"><Monitor size={12} /> Mode</span>
              <span className="co-pill-value">{course.batch?.duration || 'Online Live'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Objective Section */}
      <div className="co-objective-section">
        <div className="co-section-label">Course Objective</div>
        <p className="co-objective-text">
          {course.description || "Our curriculum is designed to bridge the gap between academic theory and industry reality. By combining deep-dive technical modules with hands-on labs and real-world project simulations, we ensure that you master the architecture and problem-solving mindset required by top-tier tech companies."}
        </p>
        <div className="co-benefits-grid">
          <div className="co-benefit-item">
            <div className="co-benefit-icon"><GraduationCap size={20} /></div>
            <div>
              <div className="co-benefit-label">Multi-Cloud</div>
              <div className="co-benefit-desc">AWS, Azure & GCP covered</div>
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