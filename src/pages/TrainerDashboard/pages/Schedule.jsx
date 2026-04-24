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
  Circle
} from 'lucide-react';
import './Schedule.css';

// --- HELPERS ---
const getStartOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const CountdownTimer = ({ targetDate, startTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(`${targetDate}T${startTime}`);
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Live Now');
        clearInterval(timer);
        return;
      }

      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, startTime]);

  return <span className="countdown-txt">{timeLeft}</span>;
};

const formatDateForGrid = (date) => {
  return date.toISOString().split('T')[0];
};

const getDayLabel = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
};

const computeSessionStatus = (dateStr, startTime, duration = 60) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr < today) return 'completed';
    if (dateStr > today) return 'planned';
    
    // It's today, check time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    if (!startTime || !startTime.includes(':')) return 'planned';
    
    const [h, m] = startTime.split(':').map(Number);
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + duration;
    
    if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) return 'active';
    if (currentMinutes > endMinutes) return 'completed';
    return 'planned';
};

const generateDummySessions = () => {
    const sessions = [];
    const now = new Date();
    
    // Past Sessions (Last 7 days)
    const pastTopics = [
        { title: "Introduction to HTML", batch: "B1", time: "09:00", dur: 120 },
        { title: "Introduction to CSS", batch: "B1", time: "11:30", dur: 90 },
        { title: "HTML Forms & Tables", batch: "B2", time: "10:00", dur: 120 },
        { title: "CSS Flexbox & Grid", batch: "B2", time: "14:00", dur: 120 },
        { title: "Introduction to JavaScript", batch: "B1", time: "09:00", dur: 120 },
        { title: "JS DOM Manipulation", batch: "B3", time: "10:00", dur: 120 },
        { title: "Introduction to UI Design", batch: "B3", time: "15:00", dur: 90 }
    ];

    for (let i = 1; i <= 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const topic = pastTopics[i % pastTopics.length];
        
        sessions.push({
            id: `past-${i}`,
            title: topic.title,
            topic: topic.title,
            date: dateStr,
            startTime: topic.time,
            endTime: "", 
            duration: topic.dur,
            batchId: topic.batch,
            courseName: topic.batch === 'B1' ? 'Full Stack Web' : topic.batch === 'B2' ? 'Node.js Backend' : 'UI/UX Design',
            status: computeSessionStatus(dateStr),
            mode: "Online"
        });
    }

    // Upcoming Sessions (Today + Next 7 days)
    const upcomingTopics = [
        { title: "React Components & Props", batch: "B1", time: "09:00", dur: 120 },
        { title: "Node.js Express Middleware", batch: "B2", time: "11:00", dur: 120 },
        { title: "Advanced Figma Prototyping", batch: "B3", time: "14:00", dur: 120 },
        { title: "React State & Hooks", batch: "B1", time: "10:00", dur: 150 },
        { title: "MongoDB Schema Design", batch: "B2", time: "09:30", dur: 120 }
    ];

    for (let i = 0; i <= 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const topic = upcomingTopics[i % upcomingTopics.length];
        
        sessions.push({
            id: `future-${i}`,
            title: topic.title,
            topic: topic.title,
            date: dateStr,
            startTime: topic.time,
            endTime: "",
            duration: topic.dur,
            batchId: topic.batch,
            courseName: topic.batch === 'B1' ? 'Full Stack Web' : topic.batch === 'B2' ? 'Node.js Backend' : 'UI/UX Design',
            status: computeSessionStatus(dateStr),
            mode: "Online"
        });
    }

    return sessions;
};

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9); // 9 AM to 6 PM

const Schedule = () => {
  const navigate = useNavigate();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getStartOfWeek(new Date()));
  const [activeView, setActiveView] = useState('Week');
  
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

  const [batches] = useState(() => {
    try {
      const data = localStorage.getItem('trainer_batches_v2');
      const parsed = data ? JSON.parse(data) : [];
      return (Array.isArray(parsed) && parsed.length > 0) ? parsed : [
        { id: 'B1', course: 'Full Stack Web Development' },
        { id: 'B2', course: 'Python & Data Science' },
        { id: 'B3', course: 'UI/UX Advanced Design' },
        { id: 'B4', course: 'AWS & Cloud Architecture' },
        { id: 'B5', course: 'Java Full Stack' },
        { id: 'B6', course: 'Python Fullstack Bootcamp' },
        { id: 'B7', course: 'Cloud Computing Mastery' }
      ];
    } catch { return []; }
  });

  // UI State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filters, setFilters] = useState({ batchId: '', courseName: '' });

  // Persistence & Auto-Status Update
  useEffect(() => {
    try {
      // Auto-recalculate statuses based on the current date
      const updated = sessions.map(s => {
          const newStatus = computeSessionStatus(s.date, s.startTime, s.duration);
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

  const todayStr = formatDateForGrid(new Date());
  const todaySessions = useMemo(() => 
    filteredSessions.filter(s => s.date === todayStr && s.status !== 'completed'), 
    [filteredSessions, todayStr]
  );

  const nextSession = useMemo(() => {
    try {
      const now = new Date();
      return [...filteredSessions]
        .filter(s => s.date && s.startTime && s.status !== 'completed' && new Date(`${s.date}T${s.startTime}`) > now)
        .sort((a, b) => new Date(`${a.date}T${a.startTime}`) - new Date(`${b.date}T${b.startTime}`))[0];
    } catch { return null; }
  }, [filteredSessions]);

  // Handlers
  const navigateWeek = (dir) => {
    if (dir === 0) {
      setCurrentWeekStart(getStartOfWeek(new Date()));
      return;
    }
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + (dir * 7));
    setCurrentWeekStart(next);
  };

  const handleAddSession = (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const batchId = formData.get('batchId');
      const batch = batches.find(b => b.id === batchId);

      const startTime = formData.get('startTime') || '09:00';
      const endTime = formData.get('endTime') || '10:00';
      
      // Calculate duration dynamically for the visual schedule grid
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const durationMins = ((eh * 60 + em) - (sh * 60 + sm)) > 0 ? ((eh * 60 + em) - (sh * 60 + sm)) : 60;

      const newSess = {
        id: Date.now(),
        batchId: batchId || 'GEN',
        courseName: batch?.course || 'General',
        title: formData.get('topic') || 'New Session', // as requested
        topic: formData.get('topic') || 'New Session', // legacy for intact UI
        date: formData.get('date'),
        startTime: startTime,
        endTime: endTime, // as requested
        duration: durationMins, // legacy visual grid needs this
        mode: formData.get('mode') || 'Online',
        status: computeSessionStatus(formData.get('date'))
      };

      setSessions(prev => [...prev, newSess]);
      setShowAddModal(false);
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
          <button className="icon-btn-v2" onClick={() => navigateWeek(0)} title="Today"><Zap size={18} /></button>
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
            <span className="kpi-val">{filteredSessions.length}</span>
            <p className="kpi-sub">Total sessions this week</p>
          </div>
        </div>
      </div>

      {/* 3. CONTROLS */}
      <div className="v2-controls-row">
        <div className="v2-nav-group">
          <button className="v2-nav-btn" onClick={() => navigateWeek(-1)}><ChevronLeft size={18} /></button>
          <button className={`v2-nav-btn ${activeView === 'Week' ? 'active' : ''}`} onClick={() => navigateWeek(0)}>This Week</button>
          <button className="v2-nav-btn" onClick={() => navigateWeek(1)}><ChevronRight size={18} /></button>
        </div>

        <div className="v2-range-label">
          {weekDays[0] && weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {weekDays[6] && weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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

      {/* 4. CALENDAR GRID */}
      <div className="v2-grid-wrapper">
        <div className="v2-grid-table">
          <div className="v2-grid-head-cell time-col">TIME</div>
          {weekDays.map((date, idx) => (
            <div key={idx} className={`v2-grid-head-cell ${date.toDateString() === new Date().toDateString() ? 'today' : ''}`}>
              <div className="v2-day-name">{getDayLabel(date)}</div>
              <div className="v2-day-num">{date.getDate()}</div>
            </div>
          ))}

          {/* BACKGROUND ROWS (Time column and grid lines) */}
          {HOURS.map(hour => (
            <React.Fragment key={hour}>
              <div className="v2-grid-time-cell">
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
              </div>
              {/* Empty cells to draw the grid lines */}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="v2-grid-data-cell empty-cell"></div>
              ))}
            </React.Fragment>
          ))}

          {/* OVERLAY SESSIONS (Positioned relative to the top of the grid rows) */}
          <div className="v2-grid-overlay-container" style={{ gridColumn: '2 / span 7', gridRow: `2 / span ${HOURS.length}`, position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', height: '100%', width: '100%' }}>
              {weekDays.map((date, dayIdx) => {
                const dayStr = formatDateForGrid(date);
                const daySessions = filteredSessions.filter(s => s.date === dayStr);
                return (
                  <div key={dayIdx} style={{ position: 'relative', borderRight: '1.5px solid #F1F5F9' }}>
                    {daySessions.map(s => (
                      <div
                        key={s.id}
                        className={`v2-session-card batch-${s.batchId.toLowerCase()} ${s.status === 'completed' ? 'completed' : ''}`}
                        style={getSessionStyle(s.startTime, s.duration)}
                        onClick={() => setSelectedSession(s)}
                      >
                         <div className="v2-card-batch">
                          <Zap size={10} /> {s.batchId}
                          <span className="card-status-icon">
                            {s.status === 'completed' && <CheckCircle size={10} style={{ color: '#10B981' }} />}
                            {s.status === 'active' && <Circle size={10} fill="#3B82F6" stroke="none" />}
                            {s.status === 'planned' && <Clock size={10} style={{ color: '#F59E0B' }} />}
                          </span>
                        </div>
                        <p className="v2-card-topic">{s.topic}</p>
                        <div className="v2-card-meta">
                          {s.status === 'completed' && <span className="completed-label-v2">Completed</span>}
                          {s.startTime} • {s.duration}m
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
              <div className="v2-form-group">
                <label>Select Batch</label>
                <select name="batchId" required>
                  <option value="">Choose Batch...</option>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.id} - {b.course}</option>)}
                </select>
              </div>
              <div className="v2-form-group">
                <label>Topic Name</label>
                <input name="topic" type="text" placeholder="e.g. Introduction to React Hooks" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="v2-form-group">
                  <label>Date</label>
                  <input name="date" type="date" required defaultValue={formatDateForGrid(new Date())} />
                </div>
                <div className="v2-form-group">
                  <label>Start Time</label>
                  <input name="startTime" type="time" required defaultValue="10:00" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="v2-form-group">
                  <label>End Time</label>
                  <input name="endTime" type="time" defaultValue="11:00" required />
                </div>
                <div className="v2-form-group">
                  <label>Class Mode</label>
                  <select name="mode">
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="v2-submit-btn">Create Session</button>
            </form>
          </div>
        </div>
      )}

      {/* 6. DETAIL MODAL */}
      {selectedSession && (
        <div className="modal-overlay-v2">
          <div className="modal-box-v2 mini" style={{ maxWidth: '400px' }}>
            <div className="modal-hdr-v2">
              <h2 className="modal-title-v2" style={{ fontSize: '18px' }}>Session Details</h2>
              <button onClick={() => setSelectedSession(null)} className="close-btn-v2"><X size={20} /></button>
            </div>
            <div className={`detail-banner batch-${selectedSession.batchId.toLowerCase()}`} style={{ padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>{selectedSession.topic}</h3>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '13px', fontWeight: 600 }}>{selectedSession.batchId} • {selectedSession.courseName}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontWeight: 600, fontSize: '14px' }}>
                <Clock size={16} /> {selectedSession.date} @ {selectedSession.startTime} ({selectedSession.duration} min)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontWeight: 600, fontSize: '14px' }}>
                <Monitor size={16} /> {selectedSession.mode} Session
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="v2-submit-btn" 
                style={{ flex: 1, marginTop: 0 }} 
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
              <button 
                className="icon-btn-v2" 
                style={{ height: '48px', width: '48px', color: '#EF4444' }}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
