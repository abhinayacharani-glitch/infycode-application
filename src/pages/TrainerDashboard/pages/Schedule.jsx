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
import {
  getTrainerBatchesAPI,
  getTrainerScheduleAPI,
  createTrainerScheduleAPI,
  updateTrainerScheduleAPI,
  deleteTrainerScheduleAPI
} from '../../../services/api';
import './Schedule.css';

// --- HELPERS ---
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

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

const parse24hTo12h = (time24) => {
  if (!time24 || !time24.includes(':')) return { hour: '10', minute: '00', ampm: 'AM' };
  const [hours, minutes] = time24.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  return {
    hour: h.toString(),
    minute: minutes,
    ampm
  };
};

const format12hTo24h = (hour, minute, ampm) => {
  let h = parseInt(hour, 10);
  if (ampm === 'PM' && h < 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

const CustomTimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = React.useRef(null);

  const { hour, minute, ampm } = useMemo(() => parse24hTo12h(value), [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hoursList = Array.from({ length: 24 }, (_, i) => (i + 1).toString());
  const minutesList = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

  const getMinutesList = () => {
    const list = [...minutesList];
    if (!list.includes(minute)) {
      list.push(minute);
      list.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
    }
    return list;
  };

  const handleSelectHour = (h) => {
    onChange(format12hTo24h(h, minute, ampm));
  };

  const handleSelectMinute = (m) => {
    onChange(format12hTo24h(hour, m, ampm));
  };

  const handleSelectAMPM = (p) => {
    onChange(format12hTo24h(hour, minute, p));
  };

  return (
    <div className="custom-timepicker" ref={containerRef}>
      <div 
        className={`timepicker-display ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{hour}:{minute} {ampm}</span>
        <Clock size={16} className="timepicker-icon" />
      </div>
      {isOpen && (
        <div className="timepicker-dropdown">
          <div className="timepicker-column">
            {hoursList.map(h => (
              <div 
                key={h} 
                className={`timepicker-option ${hour === h ? 'selected' : ''}`}
                onClick={() => handleSelectHour(h)}
              >
                {h}
              </div>
            ))}
          </div>
          <div className="timepicker-column">
            {getMinutesList().map(m => (
              <div 
                key={m} 
                className={`timepicker-option ${minute === m ? 'selected' : ''}`}
                onClick={() => handleSelectMinute(m)}
              >
                {m}
              </div>
            ))}
          </div>
          <div className="timepicker-column">
            {['AM', 'PM'].map(p => (
              <div 
                key={p} 
                className={`timepicker-option ${ampm === p ? 'selected' : ''}`}
                onClick={() => handleSelectAMPM(p)}
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
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

const getSmartIndicator = (dateStr, status, type, startTime) => {
  if (type === 'Holiday' || status === 'holiday') return 'Holiday - No Classes';
  if (status === 'completed') return 'Class is over';
  if (status === 'ongoing') return 'Ongoing now';

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (dateStr === today) {
    if (status === 'upcoming' && startTime) {
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

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9); // 9 AM to 6 PM

const Schedule = () => {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [activeView, setActiveView] = useState('Week'); // 'Day', 'Week', 'Month'
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [sessions, setSessions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch batches and sessions on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [batchesRes, scheduleRes] = await Promise.all([
          getTrainerBatchesAPI(),
          getTrainerScheduleAPI()
        ]);

        if (batchesRes.success) {
          setBatches(batchesRes.batches || []);
        }
        if (scheduleRes.success) {
          const loadedSessions = (scheduleRes.schedule || []).map(s => {
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
          setSessions(loadedSessions);
        }
      } catch (err) {
        console.error("Error loading schedule data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isDateHoliday = (dateStr) => {
    return sessions.some(s => s.type === 'Holiday' && s.date === dateStr);
  };

  const getHolidayReason = (dateStr) => {
    return sessions.find(s => s.type === 'Holiday' && s.date === dateStr)?.holidayReason || 'Holiday';
  };

  // Returns only real sessions for a given date from Firestore data
  const getSessionsForDate = (dateStr) => {
    if (isDateHoliday(dateStr)) return [];
    return sessions.filter(s => s.date === dateStr && s.type !== 'Holiday');
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
    let list = [];

    if (activeView === 'Day') {
      if (isDateHoliday(todayStr)) {
        list = [{
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
      } else {
        list = filteredSessions
          .filter(s => s.date === todayStr)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
      }
    } else if (activeView === 'Month') {
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
      list = grouped;
    } else {
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
      list = weekSessions.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return list.map(s => {
      const computedStatus = computeSessionStatus(s.date, s.startTime, s.duration, s.type || 'Class');
      return { ...s, status: computedStatus };
    });
  }, [filteredSessions, activeView, selectedDate, sessions]);

  const todayStr = formatDateForGrid(new Date());
  const selectedDateStr = formatDateForGrid(selectedDate);

  const todaySessions = useMemo(() => {
    const today = formatDateForGrid(new Date());
    if (isDateHoliday(today)) return [];
    return sessions
      .filter(s => s.date === today && s.type !== 'Holiday')
      .filter(s => {
        const status = computeSessionStatus(s.date, s.startTime, s.duration, s.type || 'Class');
        return status !== 'completed';
      });
  }, [sessions]);

  const nextSession = useMemo(() => {
    try {
      return sessions
        .filter(s => s.type !== 'Holiday')
        .map(s => ({ ...s, status: computeSessionStatus(s.date, s.startTime, s.duration, s.type || 'Class') }))
        .filter(s => s.status === 'upcoming' || s.status === 'ongoing')
        .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))[0] || null;
    } catch { return null; }
  }, [sessions]);

  const weeklyClassesCount = useMemo(() => {
    const start = getStartOfWeek(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const startStr = formatDateForGrid(start);
    const endStr = formatDateForGrid(end);
    return sessions.filter(s => s.type !== 'Holiday' && s.date >= startStr && s.date <= endStr).length;
  }, [sessions]);

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

  const handleUpdateSession = async (e) => {
    e.preventDefault();
    if (!editSessionData) return;

    const durationMins = calculateDuration(editSessionData.startTime, editSessionData.endTime);
    const updatedPayload = {
      batchId: editSessionData.batchId,
      courseName: editSessionData.courseName,
      topic: editSessionData.topic,
      date: editSessionData.date,
      startTime: editSessionData.startTime,
      endTime: editSessionData.endTime,
      duration: durationMins,
      mode: editSessionData.mode,
      type: editSessionData.type,
      holidayReason: editSessionData.holidayReason
    };

    try {
      setLoading(true);
      const res = await updateTrainerScheduleAPI(editSessionData.id, updatedPayload);
      if (res.success) {
        setSessions(prev => prev.map(s => s.id === editSessionData.id ? res.session : s));
        setSelectedSession(null);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to update session:", err);
      alert(err.message || "Failed to update session");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e) => {
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

      const sessionPayload = {
        batchId: type === 'Holiday' ? 'GEN' : (batchId || 'GEN'),
        courseName: type === 'Holiday' ? 'N/A' : (batch?.course || 'General'),
        topic: type === 'Holiday' ? 'Holiday' : topic,
        date: date,
        startTime: type === 'Holiday' ? '--:--' : startTime,
        endTime: type === 'Holiday' ? '--:--' : endTime,
        duration: type === 'Holiday' ? 0 : durationMins,
        mode: mode,
        type: type,
        holidayReason: type === 'Holiday' ? holidayReason : '',
      };

      setLoading(true);
      const res = await createTrainerScheduleAPI(sessionPayload);
      if (res.success) {
        setSessions(prev => [...prev, res.session]);
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
      }
    } catch (err) {
      console.error("Add Session Error:", err);
      alert(err.message || "Failed to add session");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Delete session?")) return;
    try {
      setLoading(true);
      const res = await deleteTrainerScheduleAPI(id);
      if (res.success) {
        setSessions(prev => prev.filter(item => item.id !== id));
        if (selectedSession && selectedSession.id === id) {
          setSelectedSession(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
      alert(err.message || "Failed to delete session");
    } finally {
      setLoading(false);
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
                              <span className="smart-indicator">{getSmartIndicator(s?.date, s?.status, s?.type, s?.startTime)}</span>
                            </div>
                          </td>
                          <td className="actions-cell">
                            <div className="action-btns">
                              <button className="action-icon-btn" onClick={() => setSelectedSession(s)} title="View Details"><ExternalLink size={16} /></button>
                              <button className="action-icon-btn delete" onClick={() => handleDeleteSession(s?.id)} title="Delete"><Trash2 size={16} /></button>
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
                      onChange={(e) => setNewSessionData({ ...newSessionData, type: e.target.value })}
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
                        onChange={(e) => setNewSessionData({ ...newSessionData, batchId: e.target.value })}
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
                      onChange={(e) => setNewSessionData({ ...newSessionData, topic: e.target.value })}
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
                      onChange={(e) => setNewSessionData({ ...newSessionData, holidayReason: e.target.value })}
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
                      onChange={(e) => setNewSessionData({ ...newSessionData, date: e.target.value })}
                      required
                    />
                  </div>
                  {newSessionData.type === 'Class' && (
                    <div className="v2-form-group">
                      <label>Start Time</label>
                      <CustomTimePicker
                        value={newSessionData.startTime}
                        onChange={(val) => setNewSessionData({ ...newSessionData, startTime: val })}
                      />
                    </div>
                  )}
                </div>

                {newSessionData.type === 'Class' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="v2-form-group">
                      <label>End Time</label>
                      <CustomTimePicker
                        value={newSessionData.endTime}
                        onChange={(val) => setNewSessionData({ ...newSessionData, endTime: val })}
                      />
                    </div>
                    <div className="v2-form-group">
                      <label>Class Mode</label>
                      <select
                        value={newSessionData.mode}
                        onChange={(e) => setNewSessionData({ ...newSessionData, mode: e.target.value })}
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
              <div className={`detail-card-header batch-${editSessionData?.batchId?.toLowerCase() || 'gen'}`}>
                <div className="header-top">
                  <span className="type-pill">{editSessionData?.type}</span>
                  <button onClick={() => setSelectedSession(null)} className="card-close-btn"><X size={20} /></button>
                </div>
                <div className="header-main">
                  {isEditing ? (
                    <input
                      className="edit-title-input"
                      value={editSessionData?.topic}
                      onChange={(e) => setEditSessionData({ ...editSessionData, topic: e.target.value })}
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
                          onChange={(e) => setEditSessionData({ ...editSessionData, date: e.target.value })}
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
                              <CustomTimePicker
                                value={editSessionData?.startTime || '10:00'}
                                onChange={(val) => setEditSessionData({ ...editSessionData, startTime: val })}
                              />
                              <span>to</span>
                              <CustomTimePicker
                                value={editSessionData?.endTime || '11:00'}
                                onChange={(val) => setEditSessionData({ ...editSessionData, endTime: val })}
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
                              onChange={(e) => setEditSessionData({ ...editSessionData, mode: e.target.value })}
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
                            onChange={(e) => setEditSessionData({ ...editSessionData, holidayReason: e.target.value })}
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
                  <span className="card-indicator">{getSmartIndicator(selectedSession.date, selectedSession.status, selectedSession.type, selectedSession.startTime)}</span>
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
                      onClick={() => handleDeleteSession(selectedSession.id)}
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
