import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

  // Find the course in published courses
  const course = React.useMemo(() => {
    if (!publishedCourses || !courseId) return null;
    const published = publishedCourses.find(c => c.courseId === courseId || c.id === courseId);
    if (!published) return null;

    return {
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
      modules: published.modules || []
    };
  }, [publishedCourses, courseId]);

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

    if (batchMatch) {
      return {
        ...course,
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

    return course;
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
      <div className="co-top-bar">
        <button className="co-back-btn" onClick={handleBack}>
          <ArrowLeft size={18} />
          <span>Back to Courses</span>
        </button>
      </div>

      {/* Header Card (Hero) */}
      <div className="co-hero">
        <div className="co-hero-left">
          <div className="co-level-badge">{dynamicCourse.level}</div>
          <h1 className="co-hero-title">{dynamicCourse.title}</h1>
          <p className="co-subtitle">
            {dynamicCourse.title?.toLowerCase().includes('aptitude')
              ? 'Learn and Practice Aptitude with Shortcuts to boost your analytical and logical skills.'
              : 'Master technical skills with our comprehensive industry-grade curriculum and expert-led training.'}
          </p>
        </div>

        <div className="co-hero-right">
          <div className={`co-status-badge ${statusLabel.className}`}>
            {statusLabel.text}
          </div>
          <div className="co-schedule-card">
            {dayStatuses.map((item) => (
              <div key={item.day} className="co-schedule-row">
                <span className="co-day">{item.day}</span>
                <span className={`co-status ${item.state === 'completed' ? 'over' : ''}`}>{item.text}</span>
              </div>
            ))}
          </div>
          <button
            className={`co-join-live-btn ${sessionStatus !== 'live' ? 'disabled' : ''}`}
            onClick={handleJoin}
          >
            <Video size={18} />
            <span>Join Live Class</span>
          </button>
        </div>
      </div>

      {/* Info Cards Row (Trainer & Batch) */}
      <div className="co-info-row">
        {/* Trainer Details */}
        <div className="co-card co-trainer-card">
          <div className="co-card-header">
            <div className="co-icon-box blue">
              <User size={18} />
            </div>
            <h2>Trainer Details</h2>
          </div>
          <div className="co-trainer-profile">
            <div className="co-avatar">
              {dynamicCourse.trainer?.name?.charAt(0)}
            </div>
            <div className="co-trainer-info">
              <h3>{dynamicCourse.trainer?.name}</h3>
              <p>{dynamicCourse.trainer?.role}</p>
            </div>
          </div>
          <div className="co-stats-grid">
            <div className="co-stat-box">
              <span className="co-label">EXPERIENCE</span>
              <span className="co-value">{dynamicCourse.trainer?.experience || '10+ Years'}</span>
            </div>
            <div className="co-stat-box">
              <span className="co-label">EXPERTISE</span>
              <span className="co-value">{dynamicCourse.trainer?.expertise || dynamicCourse.trainer?.specialization || 'Technical Expert'}</span>
            </div>
          </div>
        </div>

        {/* Batch Details */}
        <div className="co-card co-batch-card">
          <div className="co-card-header">
            <div className="co-icon-box green">
              <Calendar size={18} />
            </div>
            <h2>Batch Details</h2>
          </div>
          <div className="co-batch-grid">
            <div className="co-stat-box">
              <span className="co-label"># BATCH ID</span>
              <span className="co-value">{dynamicCourse.batch?.id || 'BID-1240'}</span>
            </div>
            <div className="co-stat-box">
              <span className="co-label">TIMING</span>
              <span className="co-value">{dynamicCourse.batch?.timing}</span>
            </div>
            <div className="co-stat-box">
              <span className="co-label">START DATE</span>
              <span className="co-value">{dynamicCourse.batch?.startDate}</span>
            </div>
            <div className="co-stat-box">
              <span className="co-label">MODE</span>
              <span className="co-value">
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

      {/* Course Objective Section */}
      <div className="co-objective-card">
        <div className="co-section-label">COURSE OBJECTIVE</div>
        <p className="co-objective-desc">
          {dynamicCourse.description ||
            (dynamicCourse.title?.toLowerCase().includes('aptitude')
              ? "Our Aptitude program is designed to build a strong foundation in quantitative, logical, and verbal reasoning. By focusing on time-saving shortcuts, mental calculation techniques, and diverse problem patterns, we prepare you for the rigorous selection processes of leading global organizations."
              : "Master the complete Java ecosystem from core fundamentals to enterprise Spring Boot and React integration.")}
        </p>

        <div className="co-features-grid">
          <div className="co-feature-item">
            <div className="co-feature-icon">
              <GraduationCap size={20} />
            </div>
            <div className="co-feature-text">
              <h4>
                {dynamicCourse.title?.toLowerCase().includes('java') ? 'Core Java' :
                 dynamicCourse.title?.toLowerCase().includes('ai') || dynamicCourse.title?.toLowerCase().includes('artificial') ? 'AI Foundations' :
                 dynamicCourse.title?.toLowerCase().includes('aptitude') ? 'Quant & Logic' :
                 dynamicCourse.title?.toLowerCase().includes('react') ? 'React Mastery' : 'Industry Focused'}
              </h4>
              <p>
                {dynamicCourse.title?.toLowerCase().includes('java') ? 'Fundamentals to Advanced' :
                 dynamicCourse.title?.toLowerCase().includes('ai') || dynamicCourse.title?.toLowerCase().includes('artificial') ? 'Neural Networks & ML' :
                 dynamicCourse.title?.toLowerCase().includes('aptitude') ? 'Shortcuts & Patterns' :
                 dynamicCourse.title?.toLowerCase().includes('react') ? 'Hooks & Architecture' : 'Real-world curriculum'}
              </p>
            </div>
          </div>
          <div className="co-feature-item">
            <div className="co-feature-icon">
              <Users size={20} />
            </div>
            <div className="co-feature-text">
              <h4>Certified Trainers</h4>
              <p>Industry experts only</p>
            </div>
          </div>
          <div className="co-feature-item">
            <div className="co-feature-icon">
              <Lock size={20} />
            </div>
            <div className="co-feature-text">
              <h4>Lifetime Access</h4>
              <p>Recordings stay active</p>
            </div>
          </div>
          <div className="co-feature-item">
            <div className="co-feature-icon">
              <Monitor size={20} />
            </div>
            <div className="co-feature-text">
              <h4>Hands-on Labs</h4>
              <p>100+ Cloud exercises</p>
            </div>
          </div>
        </div>

        <div className="co-cta">
          <button className="co-start-learning-btn" onClick={handleStart}>
            <span>Start Learning</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

    </div>
  );
};


export default CourseOverview;