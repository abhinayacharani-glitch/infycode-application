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
import {
  getStudentBatchesAPI,
  getStudentLiveSessionAPI
} from '../../../services/api';
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
  if (!dayData || !dayData.enabled) {
    return { state: 'cancelled', text: dayData?.reason ? `Holiday: ${dayData.reason}` : `Cancelled` };
  }

  const currentDayIndex = (now.getDay() + 6) % 7; // Monday = 0
  const itemDayIndex = daysOrder.indexOf(dayName);
  const startMinutes = parse12HourToMinutes(dayData.start);
  const endMinutes = parse12HourToMinutes(dayData.end);
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
  if (!config || !config.sessionLink || !config.weeklySchedule) return 'no-link';
  
  const todayName = daysOrder[(now.getDay() + 6) % 7];
  const todaySchedule = config.weeklySchedule.find(item => item.day === todayName);
  
  if (todaySchedule && !todaySchedule.enabled) return 'cancelled';
  if (!todaySchedule) return 'ended';
  
  const todayStatus = getDayStatus(todayName, todaySchedule, now);
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
  const [sessionConfig, setSessionConfig] = useState({
    sessionLink: "https://meet.google.com/abc-defg-hij",
    weeklySchedule: [
      { day: "Monday", start: "09:00 AM", end: "10:00 AM", enabled: true },
      { day: "Tuesday", start: "09:00 AM", end: "10:00 AM", enabled: true },
      { day: "Wednesday", start: "09:00 AM", end: "10:00 AM", enabled: true },
      { day: "Thursday", start: "09:00 AM", end: "10:00 AM", enabled: true },
      { day: "Friday", start: "09:00 AM", end: "10:00 AM", enabled: true },
      { day: "Saturday", start: "09:00 AM", end: "10:00 AM", enabled: false, reason: "Weekend" },
      { day: "Sunday", start: "09:00 AM", end: "10:00 AM", enabled: false, reason: "Weekend" }
    ]
  });
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
  const dynamicCourse = React.useMemo(() => {
    if (!course) return null;

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
          firebaseKey: batchMatch.firebaseKey,
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

  const activeBatchId = dynamicCourse?.batch?.firebaseKey || dynamicCourse?.batch?.id;

  // 3. Fetch Live Session config from Backend Firestore instead of localStorage
  useEffect(() => {
    const addOneHourToTime12 = (time12) => {
      if (!time12 || time12 === 'Flexible' || time12.toLowerCase().includes('flexible')) {
        return '10:00 AM';
      }
      try {
        const [time, suffix] = time12.split(' ');
        let [hour, minute] = time.split(':').map(Number);
        let nextHour = hour + 1;
        let nextSuffix = suffix;
        if (nextHour === 12) {
          nextSuffix = suffix === 'AM' ? 'PM' : 'AM';
        } else if (nextHour > 12) {
          nextHour = 1;
        }
        return `${String(nextHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${nextSuffix}`;
      } catch (e) {
        return '10:00 AM';
      }
    };

    const batchMatch = Object.values(myBatches).find(b =>
      b.batchId === activeBatchId || b.firebaseKey === activeBatchId
    );
    const resolvedStartTime = batchMatch?.startTime && batchMatch.startTime !== 'Flexible' ? batchMatch.startTime : '09:00 AM';
    const resolvedEndTime = addOneHourToTime12(resolvedStartTime);
    const resolvedLink = batchMatch?.liveClassLink || "https://meet.google.com/abc-defg-hij";

    const defaultSchedule = {
      sessionLink: resolvedLink,
      weeklySchedule: [
        { day: "Monday", start: resolvedStartTime, end: resolvedEndTime, enabled: true },
        { day: "Tuesday", start: resolvedStartTime, end: resolvedEndTime, enabled: true },
        { day: "Wednesday", start: resolvedStartTime, end: resolvedEndTime, enabled: true },
        { day: "Thursday", start: resolvedStartTime, end: resolvedEndTime, enabled: true },
        { day: "Friday", start: resolvedStartTime, end: resolvedEndTime, enabled: true },
        { day: "Saturday", start: resolvedStartTime, end: resolvedEndTime, enabled: false, reason: "Weekend" },
        { day: "Sunday", start: resolvedStartTime, end: resolvedEndTime, enabled: false, reason: "Weekend" }
      ]
    };

    if (!activeBatchId) {
      setSessionConfig(defaultSchedule);
      return;
    }

    const fetchLiveSession = async () => {
      try {
        const res = await getStudentLiveSessionAPI(activeBatchId);
        if (res.success && res.config && res.config.sessionLink && res.config.weeklySchedule) {
          setSessionConfig(res.config);
        } else {
          setSessionConfig(defaultSchedule);
        }
      } catch (err) {
        console.error("Failed to fetch live session config:", err.message);
        setSessionConfig(defaultSchedule);
      }
    };

    fetchLiveSession();
    const interval = setInterval(fetchLiveSession, 15000); // Poll backend every 15s
    return () => clearInterval(interval);
  }, [activeBatchId, myBatches]);



  // 5. Update session states every second
  useEffect(() => {
    const check = () => {
      if (!sessionConfig || !sessionConfig.weeklySchedule) {
        setSessionStatus('no-link');
        return;
      }
      try {
        const now = new Date();
        const todayIndex = (now.getDay() + 6) % 7;
        const todayName = daysOrder[todayIndex];
        const tomorrowName = daysOrder[(todayIndex + 1) % 7];

        const todaySchedule = sessionConfig.weeklySchedule.find(item => item.day === todayName);
        const tomorrowSchedule = sessionConfig.weeklySchedule.find(item => item.day === tomorrowName);

        const computedStatuses = [
          { day: todayName, ...getDayStatus(todayName, todaySchedule, now) },
          { day: tomorrowName, ...getDayStatus(tomorrowName, tomorrowSchedule, now) },
        ];

        setSessionStatus(getOverallStatus(sessionConfig, now));
        setDayStatuses(computedStatuses);
      } catch (err) {
        console.error("Error computing session status:", err);
        setSessionStatus('no-link');
      }
    };

    check();
    const timer = setInterval(check, 1000);
    return () => clearInterval(timer);
  }, [sessionConfig]);

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
    'upcoming': { text: sessionConfig ? `Starts at ${sessionConfig.weeklySchedule.find(i => i.day === daysOrder[(new Date().getDay() + 6) % 7])?.start || ""}` : 'Upcoming', className: 'status-upcoming' },
    'ended': { text: 'Session Ended', className: 'status-ended' },
    'expired': { text: 'Session Ended', className: 'status-ended' },
    'cancelled': { 
      text: sessionConfig?.weeklySchedule?.find(i => i.day === daysOrder[(new Date().getDay() + 6) % 7])?.reason 
        ? `Holiday: ${sessionConfig.weeklySchedule.find(i => i.day === daysOrder[(new Date().getDay() + 6) % 7]).reason}` 
        : 'Class Cancelled', 
      className: 'status-cancelled' 
    },
    'no-link': { text: 'Not Configured', className: 'status-none' },
  }[sessionStatus] || { text: 'Not Configured', className: 'status-none' };

  const courseImage = getCourseImage(course);

  return (
    <div className="course-overview-page">
      <div className="co-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <span className={`co-status ${item.state === 'completed' ? 'over' : item.state === 'cancelled' ? 'cancelled' : ''}`}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <button
            className={`co-join-live-btn ${sessionStatus !== 'live' ? 'disabled' : ''}`}
            onClick={handleJoin}
            disabled={sessionStatus !== 'live'}
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

      {/* Announcements & Holiday Messages Banner */}
      {sessionConfig?.weeklySchedule?.some(item => !item.enabled && item.reason) && (
        <div className="co-card" style={{ marginTop: '24px', padding: '16px', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: '#d97706' }}>
            <span>📢</span> Announcements & Holiday Schedule
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessionConfig.weeklySchedule
              .filter(item => !item.enabled && item.reason)
              .map(item => (
                <div key={item.day} style={{ fontSize: '14px', color: '#4b5563' }}>
                  <strong>{item.day}:</strong> <span style={{ color: '#ef4444' }}>Holiday</span> - {item.reason}
                </div>
              ))}
          </div>
        </div>
      )}

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