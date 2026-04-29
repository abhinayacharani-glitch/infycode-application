import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Monitor,
  Calendar,
  ExternalLink,
  Trash2,
  Play,
  Zap,
  Filter,
  Users,
  CheckCircle,
  Circle,
  Edit2
} from 'lucide-react';
import './Schedule.css';

// --- HELPERS ---
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const BATCHES = [
  { id: 'B1', course: 'Full Stack Web Development', color: 'b1' },
  { id: 'B2', course: 'Python & Data Science', color: 'b2' },
  { id: 'B3', course: 'UI/UX Advanced Design', color: 'b3' },
  { id: 'B4', course: 'AWS & Cloud Architecture', color: 'b4' },
  { id: 'B5', course: 'Java Full Stack Mastery', color: 'b5' },
  { id: 'B6', course: 'Mobile App Development', color: 'b6' },
  { id: 'B7', course: 'Cyber Security Essentials', color: 'b7' }
];

const SkeletonRow = () => (
  <tr className="skeleton-row-v2">
    <td colSpan="10">
      <div className="skeleton-bar" />
    </td>
  </tr>
);

const EmptyState = () => (
  <div className="empty-state-v2">
    <Calendar size={48} opacity={0.2} />
    <p>No scheduled sessions found.</p>
  </div>
);
const CountdownTimer = ({ targetDate, startTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(`${targetDate}T${startTime}`);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Started');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        setTimeLeft(`${hours}h ${mins}m left`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, startTime]);

  return <span className="countdown-text">{timeLeft}</span>;
};

const formatDateForGrid = (date) => {
  return date.toISOString().split('T')[0];
};

const getDayLabel = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

const formatTimeToAMPM = (time24) => {
  if (!time24 || !time24.includes(':')) return time24;
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${minutes} ${ampm}`;
};

const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 60;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    return diff > 0 ? diff : 60;
};

const computeSessionStatus = (dateStr, startTime, duration = 60, type = 'Class') => {
    if (type === 'Holiday') return 'upcoming';

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (dateStr < today) return 'completed';
    if (dateStr > today) return 'upcoming';
    
    const [h, m] = startTime.split(':').map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + parseInt(duration);
    
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) return 'ongoing';
    if (currentMinutes > endMinutes) return 'completed';
    return 'upcoming';
};

const getSmartIndicator = (dateStr, status, type) => {
    if (type === 'Holiday' || status === 'holiday') return 'Holiday - No Classes';
    if (status === 'completed') return 'Class is over';
    if (status === 'ongoing') return 'Ongoing now';
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const target = new Date(dateStr);
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    if (dateStr === today) {
        if (status === 'upcoming') {
            const [sh, sm] = startTime.split(':').map(Number);
            const startMins = sh * 60 + sm;
            const currentMins = now.getHours() * 60 + now.getMinutes();
            const diff = startMins - currentMins;
            if (diff > 0 && diff <= 60) return `Next class in ${diff} mins`;
            return 'Upcoming today';
        }
        return status === 'ongoing' ? 'Ongoing now' : 'Class is over';
    }
    if (dateStr === tomorrowStr) return 'Starts tomorrow';
    return '';
};

const generateDummySessions = () => {
    const sessions = [];
    const now = new Date();
    
    // Pattern: 09:00 -> B1, 10:00 -> B2, 11:00 -> B3, 12:00 -> B4
    const scheduleTemplate = [
        { time: "09:00", batch: "B1", topic: "Introduction to React Hooks" },
        { time: "10:00", batch: "B2", topic: "Node.js Express Middleware" },
        { time: "11:00", batch: "B3", topic: "Advanced Figma Prototyping" },
        { time: "12:00", batch: "B4", topic: "MongoDB Schema Design" }
    ];

    // Generate for last 3 days and next 7 days
    for (let i = -3; i <= 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Add all 4 batches for each day
        scheduleTemplate.forEach((slot, idx) => {
            const status = computeSessionStatus(dateStr, slot.time, 60, "Class");
            sessions.push({
                id: `${dateStr}-${slot.batch}`,
                title: slot.topic,
                topic: slot.topic,
                date: dateStr,
                startTime: slot.time,
                endTime: `${(parseInt(slot.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
                duration: 60,
                batchId: slot.batch,
                courseName: slot.batch === 'B1' ? 'Full Stack Web' : slot.batch === 'B2' ? 'Node.js Backend' : slot.batch === 'B3' ? 'UI/UX Design' : 'Cloud Architecture',
                status: status,
                mode: "Online",
                type: "Class"
            });
        });

        // Add a Holiday example
        if (i === 2) {
            sessions.push({
                id: `${dateStr}-holiday`,
                title: "Holiday",
                topic: "Holiday",
                date: dateStr,
                startTime: "--:--",
                endTime: "--:--",
                duration: 0,
                batchId: "GEN",
                courseName: "N/A",
                status: "upcoming",
                mode: "Online",
                type: "Holiday",
                holidayReason: "Public Holiday"
            });
        }
    }

    return sessions;
};

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9); // 9 AM to 6 PM

const Schedule = () => {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [activeView, setActiveView] = useState('Week'); // 'Day', 'Week', 'Month'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [sessions, setSessions] = useState(() => {
    const fallback = generateDummySessions();
    try {
      const data = localStorage.getItem('trainer_sessions');
      if (!data) {
          localStorage.setItem('trainer_sessions', JSON.stringify(fallback));
          return fallback;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return fallback;
      
      return parsed.map(s => {
        // Sanitize legacy AM/PM format
        if (s.startTime && (s.startTime.includes('AM') || s.startTime.includes('PM'))) {
          const parts = s.startTime.split(' ');
          const time = parts[0];
          const modifier = parts[1];
          let [hours, minutes] = time.split(':');
          if (hours === '12') hours = '00';
          if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
          return { ...s, startTime: `${hours.toString().padStart(2, '0')}:${minutes}` };
        }
        return s;
      });
    } catch (err) { 
      console.error("Schedule Data Error:", err);
      return fallback; 
    }
  });

  const [batches] = useState(BATCHES);
  const [loading, setLoading] = useState(false);

  const isDateHoliday = (dateStr) => {
    return sessions.some(s => s.type === 'Holiday' && s.date === dateStr);
  };

  const getHolidayReason = (dateStr) => {
    return sessions.find(s => s.type === 'Holiday' && s.date === dateStr)?.holidayReason || 'Holiday';
  };

  // Helper to generate a full timetable for a day (9 AM - 9 PM)
  const generateDayTimetable = (dateStr) => {
    const timetable = [];
    if (isDateHoliday(dateStr)) return [];

    // 9 AM to 9 PM = 12 slots
    for (let i = 0; i < 12; i++) {
        const hour = 9 + i;
        const timeStr = `${hour.toString().padStart(2, '0')}:00`;
        const batchIndex = i % batches.length; // B1 to B7 rotation
        const batch = batches[batchIndex];
        
        // Check if there's a custom session for this batch at this time
        const customSess = sessions.find(s => s.date === dateStr && s.startTime === timeStr && s.batchId === batch.id && s.type !== 'Holiday');
        
        timetable.push(customSess || {
            id: `auto-${dateStr}-${timeStr}-${batch.id}`,
            batchId: batch.id,
            courseName: batch.course,
            topic: "Standard Session",
            date: dateStr,
            startTime: timeStr,
            duration: 60,
            type: 'Class',
            status: computeSessionStatus(dateStr, timeStr, 60, 'Class')
        });
    }
    return timetable;
  };

  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filters, setFilters] = useState({ batchId: '', courseName: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Form State
  const [newSessionData, setNewSessionData] = useState({
    type: 'Class',
    batchId: '',
    topic: '',
    date: formatDateForGrid(new Date()),
    startTime: '10:00',
    endTime: '11:00',
    mode: 'Online',
    holidayReason: ''
  });

  const [editSessionData, setEditSessionData] = useState(null);

  useEffect(() => {
    if (selectedSession) {
      setEditSessionData({ ...selectedSession });
    } else {
      setEditSessionData(null);
      setIsEditing(false);
    }
  }, [selectedSession]);

  useEffect(() => {
    try {
      const updated = sessions.map(s => {
          const newStatus = computeSessionStatus(s.date, s.startTime, s.duration, s.type || 'Class');
          return s.status !== newStatus ? { ...s, status: newStatus } : s;
      });
      
      const hasChanged = updated.some((s, idx) => s.status !== sessions[idx].status);
      if (hasChanged) {
          setSessions(updated);
      }

      localStorage.setItem('trainer_sessions', JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save sessions:", e);
    }
  }, [sessions]);

  // Derived Data
  const weekDays = useMemo(() => {
    try {
      const days = [];
      const start = new Date(currentWeekStart);
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push(d);
      }
      return days;
    } catch { return []; }
  }, [currentWeekStart]);

  const filteredSessions = useMemo(() => {
    if (!Array.isArray(sessions)) return [];
    return sessions.filter(s => {
      if (!s) return false;
      const matchesBatch = !filters.batchId || s.batchId === filters.batchId;
      const matchesCourse = !filters.courseName || s.courseName === filters.courseName;
      return matchesBatch && matchesCourse;
    });
  }, [sessions, filters]);

  const displaySessions = useMemo(() => {
    const todayStr = formatDateForGrid(selectedDate);
    
    if (activeView === 'Day') {
        if (isDateHoliday(todayStr)) {
            return [{
                id: `holiday-${todayStr}`,
                date: todayStr,
                startTime: '--:--',
                type: 'Holiday',
                topic: 'Holiday',
                holidayReason: getHolidayReason(todayStr),
                status: 'holiday',
                batchId: 'GEN',
                courseName: 'All Batches'
            }];
        }
        return generateDayTimetable(todayStr);
    }

    if (activeView === 'Month') {
        const month = selectedDate.getMonth();
        const year = selectedDate.getFullYear();
        const sessionsInMonth = filteredSessions.filter(s => {
            const d = new Date(s.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });

        // Group by date and handle holidays
        const grouped = [];
        const uniqueDates = [...new Set(sessionsInMonth.map(s => s.date))].sort();
        
        uniqueDates.forEach(date => {
            if (isDateHoliday(date)) {
                grouped.push({
                    id: `holiday-${date}`,
                    date: date,
                    startTime: '--:--',
                    type: 'Holiday',
                    topic: 'Holiday',
                    holidayReason: getHolidayReason(date),
                    status: 'holiday',
                    batchId: 'GEN',
                    courseName: 'All Batches'
                });
            } else {
                const daySessions = sessionsInMonth.filter(s => s.date === date);
                grouped.push(...daySessions);
            }
        });
        return grouped;
    }
    
    // Week View
    const start = getStartOfWeek(selectedDate);
    const weekSessions = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = formatDateForGrid(d);
        
        if (isDateHoliday(dateStr)) {
            weekSessions.push({
                id: `holiday-${dateStr}`,
                date: dateStr,
                startTime: '--:--',
                type: 'Holiday',
                topic: 'Holiday',
                holidayReason: getHolidayReason(dateStr),
                status: 'holiday',
                batchId: 'GEN',
                courseName: 'All Batches'
            });
        } else {
            const daySessions = filteredSessions.filter(s => s.date === dateStr);
            weekSessions.push(...daySessions);
        }
    }
    return weekSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredSessions, activeView, selectedDate, sessions]);

  const todayStr = formatDateForGrid(new Date());
  const selectedDateStr = formatDateForGrid(selectedDate);
  const todaySessions = useMemo(() => {
    const today = formatDateForGrid(new Date());
    if (isDateHoliday(today)) return [];
    return generateDayTimetable(today).filter(s => s.status !== 'completed');
  }, [sessions, batches]);

  const nextSession = useMemo(() => {
    try {
      const now = new Date();
      const todayStr = formatDateForGrid(now);
      
      // Check today first
      if (!isDateHoliday(todayStr)) {
        const todayTimetable = generateDayTimetable(todayStr);
        const upcomingToday = todayTimetable
            .filter(s => s.status === 'upcoming' || s.status === 'ongoing')
            .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`));
        if (upcomingToday.length > 0) return upcomingToday[0];
      }

      // Check next 7 days
      for (let i = 1; i <= 7; i++) {
        const nextDate = new Date();
        nextDate.setDate(now.getDate() + i);
        const dateStr = formatDateForGrid(nextDate);
        if (isDateHoliday(dateStr)) continue;
        const timetable = generateDayTimetable(dateStr);
        if (timetable.length > 0) return timetable[0];
      }
      return null;
    } catch { return null; }
  }, [sessions, batches]);

  const weeklyClassesCount = useMemo(() => {
    const start = getStartOfWeek(new Date());
    let count = 0;
    for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = formatDateForGrid(d);
        if (isDateHoliday(dateStr)) continue;
        count += generateDayTimetable(dateStr).length;
    }
    return count;
  }, [sessions, batches]);

  // Handlers
  const navigateTime = (dir) => {
    setLoading(true);
    const next = new Date(selectedDate);
    if (dir === 0) {
      setSelectedDate(new Date());
      setTimeout(() => setLoading(false), 300);
      return;
    }
    
    if (activeView === 'Day') {
        next.setDate(next.getDate() + dir);
    } else if (activeView === 'Week') {
        next.setDate(next.getDate() + (dir * 7));
    } else {
        next.setMonth(next.getMonth() + dir);
    }
    setSelectedDate(next);
    setTimeout(() => setLoading(false), 300);
  };

  const handleUpdateSession = (e) => {
    e.preventDefault();
    if (!editSessionData) return;
    
    const durationMins = calculateDuration(editSessionData.startTime, editSessionData.endTime);
    const updated = {
        ...editSessionData,
        duration: editSessionData.type === 'Holiday' ? 0 : durationMins,
        status: computeSessionStatus(editSessionData.date, editSessionData.startTime, durationMins, editSessionData.type)
    };

    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    setSelectedSession(null);
    setIsEditing(false);
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    try {
      const { type, batchId, topic, date, startTime, endTime, mode, holidayReason } = newSessionData;
      
      // Validation
      if (type === 'Holiday' && !holidayReason) {
        alert("Please provide a reason for the holiday.");
        return;
      }
      if (type === 'Class' && (!batchId || !topic || !startTime || !endTime)) {
        alert("Please fill in all required fields.");
        return;
      }

      const batch = batches.find(b => b.id === batchId);
      const durationMins = calculateDuration(startTime, endTime);

      const newSess = {
        id: Date.now(),
        batchId: type === 'Holiday' ? 'GEN' : (batchId || 'GEN'),
        courseName: type === 'Holiday' ? 'N/A' : (batch?.course || 'General'),
        title: type === 'Holiday' ? 'Holiday' : topic,
        topic: type === 'Holiday' ? 'Holiday' : topic,
        date: date,
        startTime: type === 'Holiday' ? '--:--' : startTime,
        endTime: type === 'Holiday' ? '--:--' : endTime,
        duration: type === 'Holiday' ? 0 : durationMins,
        mode: mode,
        type: type,
        holidayReason: type === 'Holiday' ? holidayReason : '',
        status: computeSessionStatus(date, startTime, durationMins, type)
      };

      setSessions(prev => [...prev, newSess]);
      setShowAddModal(false);
      // Reset form
      setNewSessionData({
        type: 'Class',
        batchId: '',
        topic: '',
        date: formatDateForGrid(new Date()),
        startTime: '10:00',
        endTime: '11:00',
        mode: 'Online',
        holidayReason: ''
      });
    } catch (err) {
      console.error("Add Session Error:", err);
    }
  };

  const resetData = () => {
    if (window.confirm("This will clear your schedule and restore defaults. Proceed?")) {
      localStorage.removeItem('trainer_sessions');
      localStorage.removeItem('trainer_batches_v2');
      window.location.reload();
    }
  };

  // Helper: Position relative to 9 AM for the WHOLE column
  const getSessionStyle = (startTime, duration) => {
    if (!startTime || !startTime.includes(':')) return { display: 'none' };
    try {
      const parts = startTime.split(':');
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) || 0;
      
      const minutesFromStart = (h - 9) * 60 + m;
      const top = (minutesFromStart / 60) * 80; // 80px per hour row
      const height = (duration / 60) * 80;
      
      return { 
        top: `${top}px`, 
        height: `${height}px`,
        visibility: minutesFromStart < 0 ? 'hidden' : 'visible'
      };
    } catch { return { display: 'none' }; }
  };

  return (
    <div className="v2-dashboard-layout-lock">
      <div className="schedule-v2-container">
        {/* 1. HEADER */}
      <div className="v2-page-header">
        <div>
          <h1 className="v2-title">Schedule</h1>
          <p className="v2-subtitle">Manage and track your sessions and classes</p>
        </div>
        <div className="header-actions">
          <div className="date-pill-v2">
            <Calendar size={16} />
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <button className="icon-btn-v2" onClick={() => navigateTime(0)} title="Today"><Zap size={18} /></button>
          <button className="icon-btn-v2" onClick={resetData} title="Reset Data" style={{opacity: 0.5}}><Trash2 size={16} /></button>
        </div>
      </div>

      {/* 2. KPI SUMMARY */}
      <div className="v2-summary-row">
        <div className="kpi-card-v2">
          <div className="kpi-icon-wrap blue"><Clock size={20} /></div>
          <div className="kpi-data">
            <p className="kpi-lbl">Today's Sessions</p>
            <div className="kpi-val-group">
              <span className="kpi-val">{todaySessions.length}</span>
              <span className="kpi-badge active"><Zap size={10} /> Active</span>
            </div>
          </div>
        </div>
        <div className="kpi-card-v2">
          <div className="kpi-icon-wrap orange"><ExternalLink size={20} /></div>
          <div className="kpi-data">
            <p className="kpi-lbl">Next Session</p>
            <span className="kpi-val-text">{nextSession ? nextSession.topic : 'No Upcoming'}</span>
            <p className="kpi-sub">
              {nextSession ? (
                <>
                  {nextSession.startTime} • <CountdownTimer targetDate={nextSession.date} startTime={nextSession.startTime} />
                </>
              ) : '--:--'}
            </p>
          </div>
        </div>
        <div className="kpi-card-v2">
          <div className="kpi-icon-wrap purple"><Users size={20} /></div>
          <div className="kpi-data">
            <p className="kpi-lbl">Weekly Classes</p>
            <span className="kpi-val">{weeklyClassesCount}</span>
            <p className="kpi-sub">Total sessions this week</p>
          </div>
        </div>
      </div>

      {/* 3. CONTROLS */}
      <div className="v2-controls-row">
        <div className="controls-left-group">
          <div className="v2-nav-group">
            <button className="v2-nav-btn" onClick={() => navigateTime(-1)}><ChevronLeft size={18} /></button>
            <button className={`v2-nav-btn ${activeView === 'Week' ? 'active' : ''}`} onClick={() => navigateTime(0)}>
              {activeView === 'Month' ? 'This Month' : 'This Week'}
            </button>
            <button className="v2-nav-btn" onClick={() => navigateTime(1)}><ChevronRight size={18} /></button>
          </div>

          <div className="v2-range-label">
            {activeView === 'Month' ? (
              selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            ) : activeView === 'Week' ? (
              <>
                {getStartOfWeek(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(new Date(getStartOfWeek(selectedDate)).setDate(getStartOfWeek(selectedDate).getDate() + 6)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </>
            ) : (
              selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
            )}
          </div>
        </div>

        <div className="controls-right-group">
          <div className="v2-toggle-pill">
            <button className={`toggle-unit ${activeView === 'Day' ? 'active' : ''}`} onClick={() => setActiveView('Day')}>Day</button>
            <button className={`toggle-unit ${activeView === 'Week' ? 'active' : ''}`} onClick={() => setActiveView('Week')}>Week</button>
            <button className={`toggle-unit ${activeView === 'Month' ? 'active' : ''}`} onClick={() => setActiveView('Month')}>Month</button>
          </div>
          <button className="v2-add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> <span>Add Session</span>
          </button>
        </div>
      </div>

      {/* 4. PROFESSIONAL TABLE VIEW */}
      <div className="v2-table-wrapper">
        <table className="v2-professional-table">
          <thead>
            <tr>
              <th className="sticky-col">Date</th>
              <th>Time</th>
              <th>Batch</th>
              <th>Course Name</th>
              <th>Topic / Session Title</th>
              <th>Duration</th>
              <th>Type</th>
              <th>Status</th>
              <th>Indicator</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : (
              (() => {
                try {
                  if (displaySessions.length === 0) {
                    return <tr><td colSpan="10"><EmptyState /></td></tr>;
                  }
                  return displaySessions.map((s, idx) => {
                    const isToday = s?.date === todayStr;
                    return (
                      <tr key={s?.id || idx} className={`${isToday ? 'today-row' : ''} fade-in-row`}>
                        <td className="date-cell">
                          <div className="day-name">{s?.date ? new Date(s.date).toLocaleDateString('en-US', { weekday: 'short' }) : '---'}</div>
                          <div className="full-date">{s?.date ? new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</div>
                        </td>
                        <td className="time-cell">
                          <div className="time-wrap">
                            <Clock size={14} />
                            <span>{s?.type === 'Holiday' ? '--:--' : (s?.startTime ? formatTimeToAMPM(s.startTime) : '--:--')}</span>
                          </div>
                        </td>
                        <td className="batch-col">
                          {s?.batchId !== 'GEN' ? (
                            <span className={`batch-badge batch-${s?.batchId?.toLowerCase() || 'gen'}`}>
                              {s?.batchId}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="course-cell">
                            <div className="course-text" title={s?.courseName}>{s?.courseName || '---'}</div>
                        </td>
                        <td className="topic-cell">
                          <div className="topic-text" title={s?.topic}>{s?.topic || '---'}</div>
                          {s?.type === 'Holiday' && s?.holidayReason && (
                             <div className="holiday-reason-hint">{s.holidayReason}</div>
                          )}
                        </td>
                        <td>{s?.type === 'Holiday' ? '-' : `${s?.duration || 0}m`}</td>
                        <td>
                          <span className={`type-badge ${s?.type === 'Holiday' ? 'holiday' : 'class'}`}>
                            {s?.type || 'Class'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${s?.status || 'upcoming'}`}>
                            {(s?.status || 'upcoming').charAt(0).toUpperCase() + (s?.status || 'upcoming').slice(1)}
                          </span>
                        </td>
                        <td>
                          <div className="indicator-wrap">
                            {isToday && <span className="today-tag">Today</span>}
                            <span className="smart-indicator">{getSmartIndicator(s?.date, s?.status, s?.type)}</span>
                          </div>
                        </td>
                        <td className="actions-cell">
                          <div className="action-btns">
                            <button className="action-icon-btn" onClick={() => setSelectedSession(s)} title="View Details"><ExternalLink size={16} /></button>
                            <button className="action-icon-btn delete" onClick={() => {
                               if(s?.id && window.confirm("Delete session?")) setSessions(sessions.filter(item => item.id !== s.id));
                            }} title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  });
                } catch (err) {
                  console.error("Table rendering error:", err);
                  return <tr><td colSpan="10">Error loading table. Please refresh.</td></tr>;
                }
              })()
            )}
          </tbody>
        </table>
      </div>

      {/* 5. ADD MODAL */}
      {showAddModal && (
        <div className="modal-overlay-v2">
          <div className="modal-box-v2">
            <div className="modal-hdr-v2">
              <h2 className="modal-title-v2">Schedule New Session</h2>
              <button onClick={() => setShowAddModal(false)} className="close-btn-v2"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSession} className="modal-form-v2">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="v2-form-group">
                  <label>Session Type</label>
                  <select 
                    value={newSessionData.type} 
                    onChange={(e) => setNewSessionData({...newSessionData, type: e.target.value})}
                  >
                    <option value="Class">Class Session</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </div>
                {newSessionData.type === 'Class' && (
                  <div className="v2-form-group">
                    <label>Select Batch</label>
                    <select 
                      value={newSessionData.batchId} 
                      onChange={(e) => setNewSessionData({...newSessionData, batchId: e.target.value})}
                      required
                    >
                      <option value="">Choose Batch...</option>
                      {batches.map(b => <option key={b.id} value={b.id}>{b.id} - {b.course}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {newSessionData.type === 'Class' && (
                <div className="v2-form-group">
                  <label>Topic / Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Introduction to React Hooks" 
                    value={newSessionData.topic}
                    onChange={(e) => setNewSessionData({...newSessionData, topic: e.target.value})}
                    required 
                  />
                </div>
              )}

              {newSessionData.type === 'Holiday' && (
                <div className="v2-form-group">
                  <label>Holiday Reason</label>
                  <input 
                    type="text" 
                    placeholder="e.g. National Holiday" 
                    value={newSessionData.holidayReason}
                    onChange={(e) => setNewSessionData({...newSessionData, holidayReason: e.target.value})}
                    required
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="v2-form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={newSessionData.date}
                    onChange={(e) => setNewSessionData({...newSessionData, date: e.target.value})}
                    required 
                  />
                </div>
                {newSessionData.type === 'Class' && (
                  <div className="v2-form-group">
                    <label>Start Time</label>
                    <input 
                      type="time" 
                      value={newSessionData.startTime}
                      onChange={(e) => setNewSessionData({...newSessionData, startTime: e.target.value})}
                      required 
                    />
                  </div>
                )}
              </div>
              
              {newSessionData.type === 'Class' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="v2-form-group">
                    <label>End Time</label>
                    <input 
                      type="time" 
                      value={newSessionData.endTime}
                      onChange={(e) => setNewSessionData({...newSessionData, endTime: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="v2-form-group">
                    <label>Class Mode</label>
                    <select 
                      value={newSessionData.mode}
                      onChange={(e) => setNewSessionData({...newSessionData, mode: e.target.value})}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>
              )}
                <button type="submit" className="v2-submit-btn">
                  {newSessionData.type === 'Holiday' ? 'Submit Holiday' : 'Create Session'}
                </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. PROFESSIONAL DETAIL CARD MODAL */}
      {selectedSession && (
        <div className="modal-overlay-v2">
          <div className={`detail-card-glass ${isEditing ? 'editing' : ''}`}>
            <div className={`card-header batch-${editSessionData?.batchId?.toLowerCase() || 'gen'}`}>
              <div className="header-top">
                <span className="type-pill">{editSessionData?.type}</span>
                <button onClick={() => setSelectedSession(null)} className="card-close-btn"><X size={20} /></button>
              </div>
              <div className="header-main">
                {isEditing ? (
                  <input 
                    className="edit-title-input"
                    value={editSessionData?.topic} 
                    onChange={(e) => setEditSessionData({...editSessionData, topic: e.target.value})}
                    placeholder="Enter topic..."
                  />
                ) : (
                  <h2 className="card-topic">{selectedSession.topic}</h2>
                )}
                <p className="card-sub-info">
                  {editSessionData?.batchId !== 'GEN' && `${editSessionData?.batchId} • `}{editSessionData?.courseName}
                </p>
              </div>
            </div>

            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <Calendar className="info-icon" size={18} />
                  <div className="info-content">
                    <label>Date</label>
                    {isEditing ? (
                      <input 
                        type="date" 
                        value={editSessionData?.date} 
                        onChange={(e) => setEditSessionData({...editSessionData, date: e.target.value})}
                      />
                    ) : (
                      <span>{new Date(selectedSession.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    )}
                  </div>
                </div>

                {editSessionData?.type !== 'Holiday' && (
                  <>
                    <div className="info-item">
                      <Clock className="info-icon" size={18} />
                      <div className="info-content">
                        <label>Time & Duration</label>
                        {isEditing ? (
                          <div className="time-edit-group">
                            <input 
                              type="time" 
                              value={editSessionData?.startTime} 
                              onChange={(e) => setEditSessionData({...editSessionData, startTime: e.target.value})}
                            />
                            <span>to</span>
                            <input 
                              type="time" 
                              value={editSessionData?.endTime} 
                              onChange={(e) => setEditSessionData({...editSessionData, endTime: e.target.value})}
                            />
                          </div>
                        ) : (
                          <span>{formatTimeToAMPM(selectedSession.startTime)} ({selectedSession.duration} mins)</span>
                        )}
                      </div>
                    </div>

                    <div className="info-item">
                      <Monitor className="info-icon" size={18} />
                      <div className="info-content">
                        <label>Session Mode</label>
                        {isEditing ? (
                          <select 
                            value={editSessionData?.mode} 
                            onChange={(e) => setEditSessionData({...editSessionData, mode: e.target.value})}
                          >
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                          </select>
                        ) : (
                          <span>{selectedSession.mode} Session</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {editSessionData?.type === 'Holiday' && (
                  <div className="info-item holiday-info">
                    <Zap className="info-icon" size={18} />
                    <div className="info-content">
                      <label>Holiday Reason</label>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={editSessionData?.holidayReason} 
                          onChange={(e) => setEditSessionData({...editSessionData, holidayReason: e.target.value})}
                        />
                      ) : (
                        <span className="holiday-text">{selectedSession.holidayReason}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="card-status-section">
                <div className={`status-pill ${selectedSession.status}`}>
                  {selectedSession.status.toUpperCase()}
                </div>
                <span className="card-indicator">{getSmartIndicator(selectedSession.date, selectedSession.status, selectedSession.type)}</span>
              </div>
            </div>

            <div className="card-footer">
              {isEditing ? (
                <div className="edit-actions">
                  <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                  <button className="save-btn" onClick={handleUpdateSession}>Save Changes</button>
                </div>
              ) : (
                <div className="view-actions">
                  <button className="edit-action-btn" onClick={() => setIsEditing(true)}>
                    <Edit2 size={16} /> Edit Details
                  </button>
                  {selectedSession.type !== 'Holiday' && (
                    <button 
                      className="primary-action-btn"
                      onClick={() => navigate("/trainer-dashboard/live-session", { 
                        state: { 
                          topic: selectedSession.topic, 
                          date: selectedSession.date, 
                          time: selectedSession.startTime 
                        } 
                      })}
                    >
                      <Play size={16} fill="currentColor" /> Start Session
                    </button>
                  )}
                  <button 
                    className="delete-action-btn"
                    onClick={() => {
                      if (window.confirm("Delete this session?")) {
                        setSessions(sessions.filter(s => s.id !== selectedSession.id));
                        setSelectedSession(null);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Schedule;
