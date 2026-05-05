import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Users, CheckCircle, Clock, Calendar,
  BookOpen, Play, History as HistoryIcon,
  MessageSquare, Plus, X, Search, ChevronRight,
  Monitor, Layout, Database, Zap, AlertCircle,
  Edit2, Trash2, Circle
} from 'lucide-react';
import { getBatchStudentsAPI } from '../../../services/api';
import './BatchDetails.css';

// 0. CENTRALIZED DATA SOURCE with DYNAMIC content
const baseBatchesData = {
  B1: {
    title: "Full Stack Development",
    batchName: "Batch B1",
    startDate: "2026-01-10",
    endDate: "2026-04-10",
    mode: "Online",
    progress: 45,
    totalSessions: 20,
    completedSessions: 9,
    nextSession: {
      topic: "React Context API",
      date: "2026-04-12",
      time: "10:00 AM"
    },
    syllabus: [
      { id: 1, name: "JavaScript Basics", module: "Module 1" },
      { id: 2, name: "ES6 Features", module: "Module 1" },
      { id: 3, name: "React Fundamentals", module: "Module 2" },
      { id: 4, name: "Components & Props", module: "Module 2" },
      { id: 5, name: "React Hooks", module: "Module 2" },
      { id: 6, name: "State Management", module: "Module 3" },
      { id: 7, name: "Node.js & Express", module: "Module 4" },
      { id: 8, name: "Database Design", module: "Module 4" },
      { id: 9, name: "RESTful APIs", module: "Module 4" },
      { id: 10, name: "Authentication & Auth", module: "Module 5" }
    ]
  },
  B2: {
    title: "Python & Data Science",
    batchName: "Batch B2",
    startDate: "2026-02-15",
    endDate: "2026-06-15",
    mode: "Offline",
    progress: 30,
    totalSessions: 25,
    completedSessions: 7,
    nextSession: {
      topic: "Pandas Basics",
      date: "2026-04-13",
      time: "11:30 AM"
    },
    syllabus: [
      { id: 1, name: "Python Basics", module: "Module 1" },
      { id: 2, name: "Data Types & Structures", module: "Module 1" },
      { id: 3, name: "NumPy Fundamentals", module: "Module 2" },
      { id: 4, name: "Pandas Basics", module: "Module 2" },
      { id: 5, name: "Data Cleaning", module: "Module 2" },
      { id: 6, name: "Data Visualization", module: "Module 3" },
      { id: 7, name: "Statistical Analysis", module: "Module 3" },
      { id: 8, name: "Machine Learning Intro", module: "Module 4" },
      { id: 9, name: "Regression Models", module: "Module 4" },
      { id: 10, name: "Classification Models", module: "Module 4" }
    ]
  },
  B3: {
    title: "UI/UX Design Basics",
    batchName: "Batch B3",
    startDate: "2026-03-01",
    endDate: "2026-05-01",
    mode: "Online",
    progress: 60,
    totalSessions: 15,
    completedSessions: 9,
    nextSession: {
      topic: "Wireframing",
      date: "2026-04-11",
      time: "02:00 PM"
    },
    syllabus: [
      { id: 1, name: "Design Principles", module: "Module 1" },
      { id: 2, name: "User Research", module: "Module 1" },
      { id: 3, name: "Wireframing Basics", module: "Module 2" },
      { id: 4, name: "Prototyping", module: "Module 2" },
      { id: 5, name: "Typography & Color", module: "Module 2" },
      { id: 6, name: "Visual Design", module: "Module 3" },
      { id: 7, name: "Usability Testing", module: "Module 3" },
      { id: 8, name: "Design Tools (Figma)", module: "Module 3" }
    ]
  },
  B4: {
    title: "Cloud Architecture",
    batchName: "Batch B4",
    startDate: "2026-03-10",
    endDate: "2026-05-10",
    mode: "Online",
    progress: 20,
    totalSessions: 12,
    completedSessions: 3,
    nextSession: {
      topic: "AWS EC2",
      date: "2026-04-14",
      time: "09:00 AM"
    },
    syllabus: [
      { id: 1, name: "Cloud Computing Basics", module: "Module 1" },
      { id: 2, name: "AWS Overview", module: "Module 1" },
      { id: 3, name: "EC2 Instances", module: "Module 2" },
      { id: 4, name: "Storage Services", module: "Module 2" },
      { id: 5, name: "Networking & VPC", module: "Module 2" },
      { id: 6, name: "Databases", module: "Module 3" },
      { id: 7, name: "Security Best Practices", module: "Module 3" },
      { id: 8, name: "Monitoring & Logging", module: "Module 3" }
    ]
  }
};

// --- HELPERS ---
const calculateDuration = (start, end) => {
  if (!start || !end) return "Unknown";
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e - s);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;

  if (months > 0) {
    return `${months} Month${months > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays}d` : ''}`;
  }
  return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Never updated";
  const now = new Date();
  const diff = now - new Date(timestamp);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

// Generate unique Student ID
const generateStudentId = (existingCount) => {
  const paddedNumber = String(1001 + existingCount).slice(-3);
  return `STD${paddedNumber}`;
};


const BatchDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleJoinSession = () => {
    // Use the session that's actually being displayed in the 'Next Session' card
    const currentNextSession = batchSessions?.find(s => s.status === 'planned' || s.status === 'active');

    const sessionData = {
      topic: currentNextSession?.topic || baseBatch?.nextSession?.topic,
      date: currentNextSession?.date || baseBatch?.nextSession?.date,
      time: currentNextSession?.time || baseBatch?.nextSession?.time,
    };
    navigate("/trainer-dashboard/live-session", { state: sessionData });
  };

  const passedBatch = location.state?.batch;
  
  const baseBatch = baseBatchesData[batchId] || {
    title: passedBatch?.course || "Full Stack Development",
    batchName: `Batch ${batchId}`,
    startDate: passedBatch?.startDate || "2026-01-10",
    endDate: passedBatch?.endDate || "2026-04-10",
    mode: passedBatch?.mode || "Online",
    progress: 0,
    totalSessions: 20,
    completedSessions: 0,
    nextSession: {
      topic: "Introduction Session",
      date: "2026-05-10",
      time: "10:00 AM"
    },
    syllabus: [
      { id: 1, name: "JavaScript Basics", module: "Module 1" },
      { id: 2, name: "ES6 Features", module: "Module 1" },
      { id: 3, name: "React Fundamentals", module: "Module 2" },
      { id: 4, name: "Components & Props", module: "Module 2" },
      { id: 5, name: "React Hooks", module: "Module 2" },
      { id: 6, name: "State Management", module: "Module 3" },
      { id: 7, name: "Node.js & Express", module: "Module 4" },
      { id: 8, name: "Database Design", module: "Module 4" },
      { id: 9, name: "RESTful APIs", module: "Module 4" },
      { id: 10, name: "Authentication & Auth", module: "Module 5" }
    ]
  };

  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showSyllabusPanel, setShowSyllabusPanel] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [updateTimeAgo, setUpdateTimeAgo] = useState('Just now');
  const timeIntervalRef = useRef(null);

  // Syllabus topic status tracking
  const [syllabusTopicStatus, setSyllabusTopicStatus] = useState(() => {
    try {
      const stored = localStorage.getItem(`batch_syllabus_status_${batchId}`);
      if (stored) return JSON.parse(stored);
      // Initialize all topics as not completed
      const initialStatus = {};
      baseBatch.syllabus?.forEach(topic => {
        initialStatus[topic.id] = false;
      });
      return initialStatus;
    } catch { return {}; }
  });

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const res = await getBatchStudentsAPI(batchId);
        if (res.success) {
          setStudents(res.students || []);
        }
      } catch (err) {
        console.error("Failed to fetch students for batch:", err);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, [batchId]);




  // Track last update time
  const [lastUpdated, setLastUpdated] = useState(() => {
    try {
      const stored = localStorage.getItem(`batch_lastUpdated_${batchId}`);
      return stored ? new Date(stored) : new Date();
    } catch { return new Date(); }
  });

  const computeSessionStatus = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr < today) return 'completed';
    if (dateStr === today) return 'active';
    return 'planned';
  };

  // Use global schedule storage filtered by batchId
  const [batchSessions, setBatchSessions] = useState(() => {
    const fallback = [
      { id: 1, topic: "React Context API", date: "2026-04-15", time: "09:00 AM", duration: "2h", status: computeSessionStatus("2026-04-15") },
      { id: 2, topic: "Redux State Management", date: "2026-04-16", time: "10:00 AM", duration: "2h", status: computeSessionStatus("2026-04-16") },
      { id: 3, topic: "Node.js Express Basics", date: "2026-04-17", time: "11:00 AM", duration: "2.5h", status: computeSessionStatus("2026-04-17") }
    ];
    try {
      const stored = localStorage.getItem('trainer_sessions');
      if (stored) {
        const allSessions = JSON.parse(stored);
        const mySessions = allSessions.filter(s => s.batchId === batchId);
        if (mySessions.length > 0) {
          return mySessions.map(s => ({
            id: s.id,
            topic: s.topic,
            date: s.date,
            time: s.startTime,
            duration: `${s.duration}m`,
            status: computeSessionStatus(s.date)
          })).sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
        }
      }
      return fallback;
    } catch { return fallback; }
  });

  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(`batch_history_v3_${batchId}`);
      if (stored) return JSON.parse(stored);
      return [
        { id: 1, type: "SYSTEM", message: "Batch initialization complete", time: "Today 04:42 PM" },
        { id: 2, type: "SESSION", message: "Completed AWS EC2 session", time: "Yesterday" },
        { id: 3, type: "UPDATE", message: "Schedule updated for Phase 2", time: "2 days ago" },
      ];
    } catch { return []; }
  });

  const [notes, setNotes] = useState(() => localStorage.getItem(`batch_notes_${batchId}`) || '');
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef(null);

  const [newStudentForm, setNewStudentForm] = useState({
    studentId: '',
    name: '',
    email: '',
    autoGenerate: true
  });

  // ===== EFFECTS =====
  useEffect(() => {
    // Auto-update batch session statuses locally
    const updated = batchSessions.map(s => {
      const newStatus = computeSessionStatus(s.date);
      return s.status !== newStatus ? { ...s, status: newStatus } : s;
    });
    const changed = updated.some((s, i) => s.status !== batchSessions[i].status);
    if (changed) setBatchSessions(updated);

    localStorage.setItem(`batch_students_v3_${batchId}`, JSON.stringify(students));
    localStorage.setItem(`batch_history_v3_${batchId}`, JSON.stringify(history));
    localStorage.setItem(`batch_syllabus_status_${batchId}`, JSON.stringify(syllabusTopicStatus));
    localStorage.setItem(`batch_lastUpdated_${batchId}`, new Date().toISOString());
    setLastUpdated(new Date());
  }, [students, history, syllabusTopicStatus, batchId]);

  // Update time-ago display every minute
  useEffect(() => {
    setUpdateTimeAgo(formatTimeAgo(lastUpdated));

    timeIntervalRef.current = setInterval(() => {
      setUpdateTimeAgo(formatTimeAgo(lastUpdated));
    }, 60000); // Update every minute

    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, [lastUpdated]);

  // ===== HANDLERS =====
  const handleAddStudent = (e) => {
    e.preventDefault();

    const finalStudentId = newStudentForm.autoGenerate
      ? generateStudentId(students.length)
      : newStudentForm.studentId.trim();

    if (!finalStudentId) {
      alert('Student ID is required');
      return;
    }

    // Check for duplicate Student ID
    if (students.some(s => s.id === finalStudentId)) {
      alert('This Student ID already exists. Please choose a different one.');
      return;
    }

    if (!newStudentForm.name.trim()) {
      alert('Student name is required');
      return;
    }

    if (!newStudentForm.email.trim()) {
      alert('Student email is required');
      return;
    }

    const newStudent = {
      id: finalStudentId,
      name: newStudentForm.name.trim(),
      email: newStudentForm.email.trim(),
      joined: new Date().toISOString().split('T')[0]
    };

    setStudents([...students, newStudent]);

    // Add history entry
    setHistory([{
      id: Date.now(),
      type: "STUDENT",
      message: `${newStudent.name} added to batch`,
      time: "Just now"
    }, ...history]);

    setNewStudentForm({ studentId: '', name: '', email: '', autoGenerate: true });
    setShowAddStudentModal(false);
  };

  const handleSessionSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Convert 24hr time (14:30) to 12hr AM/PM (02:30 PM) display string
    let formattedTime = formData.get('time');
    if (formattedTime) {
      let [hours, minutes] = formattedTime.split(':');
      let h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      formattedTime = `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    }

    // 1. Create local batch session object
    const newSession = {
      id: Date.now(),
      topic: formData.get('topic'),
      date: formData.get('date'),
      time: formattedTime,
      duration: formData.get('duration'),
      status: formData.get('status')
    };

    setBatchSessions(prev => [...prev, newSession]);

    // Add history entry for the new session
    setHistory(prev => [{
      id: Date.now(),
      type: "SESSION",
      message: `Scheduled new session: ${newSession.topic}`,
      time: "Just now"
    }, ...prev]);

    // 2. Sync to global schedule (trainer_sessions)
    try {
      const globalSessionsStr = localStorage.getItem('trainer_sessions');
      let globalSessions = [];
      if (globalSessionsStr) {
        globalSessions = JSON.parse(globalSessionsStr);
      }
      if (!Array.isArray(globalSessions)) globalSessions = [];

      let durationStr = formData.get('duration');
      let durationMins = parseInt(durationStr) || 60;
      if (durationStr.toLowerCase().includes('h')) {
        durationMins = parseFloat(durationStr) * 60;
      }

      const newGlobalSession = {
        id: newSession.id,
        batchId: batchId,
        courseName: baseBatch?.title || 'General Course',
        topic: newSession.topic,
        date: newSession.date,
        startTime: formattedTime || newSession.time,
        duration: durationMins,
        mode: baseBatch?.mode || 'Online',
        status: newSession.status === 'Completed' ? 'Completed' : 'Upcoming',
        endTime: "" // Placeholder per requirement
      };

      globalSessions.push(newGlobalSession);
      localStorage.setItem('trainer_sessions', JSON.stringify(globalSessions));
    } catch (err) {
      console.error("Failed to sync session to global schedule:", err);
    }

    setShowAddSessionModal(false);
  };

  const handleNotesChange = (val) => {
    setNotes(val);
    localStorage.setItem(`batch_notes_${batchId}`, val);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(() => setIsSaving(false), 1500);
  };

  // Syllabus Handlers
  const handleToggleTopicStatus = (topicId, isCompleted) => {
    setSyllabusTopicStatus(prev => ({
      ...prev,
      [topicId]: isCompleted
    }));
  };

  const handleOpenSyllabusPanel = () => {
    setShowSyllabusPanel(!showSyllabusPanel);
  };

  // ===== CALCULATIONS =====
  // Calculate progress from syllabus - with safe null checks
  const syllabusTopics = baseBatch?.syllabus || [];
  const completedCount = Object.values(syllabusTopicStatus).filter(status => status === true).length;
  const totalTopicsCount = syllabusTopics?.length || 0;
  const syllabusProgressPct = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;

  const displayStudentCount = Math.max(students?.length || 0, 4);
  const nextSession = batchSessions?.find(s => s.status === 'Planned');
  const lastCompleted = [...(batchSessions || [])].reverse().find(s => s.status === 'Completed');
  const duration = baseBatch ? calculateDuration(baseBatch.startDate, baseBatch.endDate) : 'Unknown';

  // Get completed and pending topics
  const completedTopics = syllabusTopics?.filter(t => syllabusTopicStatus?.[t.id] === true) || [];
  const pendingTopics = syllabusTopics?.filter(t => syllabusTopicStatus?.[t.id] !== true) || [];

  const CircularProgress = ({ pct }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    return (
      <div className="circular-progress-saas-v4">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} className="bg-circle-v4" />
          <circle cx="50" cy="50" r={radius} className="fill-circle-v4" style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
        </svg>
        <div className="pct-label-v4">{pct}%</div>
      </div>
    );
  };

  return (
    <div className="batch-details-production">
      <div className="main-content">

        {/* DYNAMIC HEADER SECTION */}
        <div className="header-container-grid">
          <div className="header-left">
            <h1 className="title-bold">{baseBatch?.title || 'Batch'}</h1>
            <div className="subtitle-gray">
              {baseBatch?.batchName || 'Unknown'} • Trainer Overview
            </div>
          </div>

          <div className="header-info-structured">
            <div className="info-top-row">
              <div className="info-item-prod">
                <Calendar size={14} />
                <span>{baseBatch?.startDate} — {baseBatch?.endDate}</span>
              </div>
              <div className="info-item-prod">
                <Clock size={14} />
                <span>{duration}</span>
              </div>
              <div className="info-item-prod">
                <Monitor size={14} />
                <span>{baseBatch?.mode}</span>
              </div>
              <div className="info-item-prod students-badge">
                <Users size={14} />
                <span>{displayStudentCount} Students</span>
              </div>
            </div>

            <div className="info-bottom-row">
              <div className="status-badge-prod updated">
                Updated: <b>{updateTimeAgo}</b>
              </div>
              <button className="add-student-btn-prod" onClick={() => setShowAddStudentModal(true)}>
                <Plus size={16} /> Add Student
              </button>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="tabs-navigation-prod">
          {['Overview', 'Students', 'Schedule', 'History'].map(tab => (
            <div
              key={tab}
              className={`tab-item-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        <div className="tab-content-area-prod">

          {/* OVERVIEW TAB */}
          {activeTab === 'Overview' && (
            <div className="overview-container-grid">
              <div className="column-left">
                {syllabusTopics && syllabusTopics.length > 0 ? (
                  <div className="card-production progress-card animate-fade cursor-pointer">
                    <div className="progress-top-row">
                      <div>
                        <h3 className="card-title-prod">Course Progress</h3>
                        <p className="card-lbl-gray">Syllabus Completion</p>
                      </div>
                      <div className="progress-value-accent">{syllabusProgressPct}%</div>
                    </div>
                    <div className="progress-body-flex">
                      <CircularProgress pct={syllabusProgressPct} />
                      <div className="progress-stats-prod">
                        <div className="st-row"><span className="dot blue"></span> <span>{completedCount} Completed</span></div>
                        <div className="st-row"><span className="dot gray"></span> <span>{totalTopicsCount} Total</span></div>
                      </div>
                    </div>
                    <div className="progress-expand-hint" onClick={handleOpenSyllabusPanel}>
                      <span>Click to view syllabus</span>
                    </div>
                  </div>
                ) : (
                  <div className="card-production progress-card animate-fade">
                    <h3 className="card-title-prod">Course Progress</h3>
                    <p className="card-lbl-gray">Syllabus Completion</p>
                    <div className="empty-state-card">
                      <p>No syllabus available</p>
                    </div>
                  </div>
                )}

                <div className="card-production notes-card-v5">
                  <div className="notes-hdr-v5">
                    <h3 className="card-title-prod">Trainer Notes</h3>
                    {isSaving && <span className="save-tick-v5">Saved...</span>}
                  </div>
                  <textarea
                    className="notes-input-v5"
                    placeholder="Type specific batch reminders..."
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="column-right">
                <div className="card-production session-card-cta-v5">
                  <div className="sess-hdr-v5">
                    <div className="hdr-left">
                      <Zap size={20} className="zap-icon" />
                      <h3 className="card-title-prod">Next Session</h3>
                    </div>
                    <span className="live-status-pill-v5">Scheduled</span>
                  </div>
                  {nextSession ? (
                    <div className="sess-details-v5">
                      <p className="sess-topic-bold-v5">{nextSession.topic}</p>
                      <div className="sess-meta-row-v5">
                        <span><Calendar size={14} /> {nextSession.date}</span>
                        <span><Clock size={14} /> {nextSession.time}</span>
                      </div>
                      <div className="join-session-button-container">
                        <button className="join-session-btn-v5" onClick={handleJoinSession}>
                          Join Session Now
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state-v5">
                      <p className="no-sess-msg">No sessions scheduled for today</p>
                      <div className="tentative-topics-v5">
                        <p className="tentative-lbl">UPCOMING TOPICS:</p>
                        <ul className="tentative-list">
                          <li>• JavaScript Basics</li>
                          <li>• ES6 Features</li>
                        </ul>
                      </div>
                      <button className="join-session-btn-v5" onClick={handleJoinSession} style={{ marginTop: '20px' }}>
                        Join Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SYLLABUS PANEL - INLINE EXPANSION */}
          {activeTab === 'Overview' && showSyllabusPanel && (
            <div className="syllabus-panel-expansion animate-fade-down">
              <div className="syllabus-header">
                <div>
                  <h3 className="syllabus-title">📚 Full Syllabus</h3>
                  <p className="syllabus-subtitle">Track each topic's completion status</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="syllabus-progress-section">
                <div className="progress-bar-container">
                  <div className="progress-bar-label">
                    <span>{completedCount} of {totalTopicsCount} topics completed</span>
                    <span className="progress-percentage">{syllabusProgressPct}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${syllabusProgressPct}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* All Topics */}
              <div className="syllabus-topics-section">
                <h4 className="syllabus-section-subtitle">All Topics</h4>
                <div className="syllabus-topics-list">
                  {syllabusTopics && syllabusTopics.length > 0 ? syllabusTopics.map(topic => (
                    <div key={topic.id} className="syllabus-topic-row">
                      <div className="topic-info-section">
                        <div className="topic-name-large">{topic.name}</div>
                        {topic.module && <div className="topic-module-badge">{topic.module}</div>}
                      </div>
                      <div className="topic-action-buttons">
                        <button
                          className={`topic-status-btn completed ${syllabusTopicStatus[topic.id] === true ? 'active' : ''}`}
                          onClick={() => handleToggleTopicStatus(topic.id, true)}
                          title="Mark as completed"
                        >
                          <CheckCircle size={16} />
                          Completed
                        </button>
                        <button
                          className={`topic-status-btn pending ${syllabusTopicStatus[topic.id] !== true ? 'active' : ''}`}
                          onClick={() => handleToggleTopicStatus(topic.id, false)}
                          title="Mark as pending"
                        >
                          <Clock size={16} />
                          Not Completed
                        </button>
                      </div>
                    </div>
                  )) : (
                    <div className="empty-state-syllabus">
                      <p>No topics available for this syllabus.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Topics Section */}
              {completedTopics && completedTopics.length > 0 && (
                <div className="syllabus-topics-section">
                  <h4 className="syllabus-section-subtitle">✅ Completed Topics ({completedCount})</h4>
                  <div className="syllabus-topics-summary">
                    {completedTopics?.map(topic => (
                      <div key={topic.id} className="summary-topic-badge completed-topic">
                        <CheckCircle size={14} />
                        {topic.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Topics Section */}
              {pendingTopics && pendingTopics.length > 0 && (
                <div className="syllabus-topics-section">
                  <h4 className="syllabus-section-subtitle">⏳ Pending Topics ({pendingTopics.length})</h4>
                  <div className="syllabus-topics-summary">
                    {pendingTopics?.map(topic => (
                      <div key={topic.id} className="summary-topic-badge pending-topic">
                        <Clock size={14} />
                        {topic.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button className="syllabus-close-btn" onClick={handleOpenSyllabusPanel}>
                Collapse Syllabus
              </button>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === 'Students' && (
            <div className="students-tab-v5 animate-fade">
              <div className="students-actions-hdr-v5">
                <div className="prod-search-v5">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search students by name or ID..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                  />
                </div>
                <button className="prod-btn-primary-v5" onClick={() => setShowAddStudentModal(true)}>
                  <Plus size={16} /> Add Student
                </button>
              </div>

              {students && students.length > 0 ? (
                <div className="students-grid-v5">
                  {students?.filter(s =>
                    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                    s.id.toLowerCase().includes(studentSearch.toLowerCase())
                  ).map(student => (
                    <div key={student.id} className="student-card-v5">
                      <div className="st-card-hdr">
                        <div className="st-avatar-v5">{student.name.charAt(0)}</div>
                        <div className="st-main-info">
                          <p className="st-name-v5">{student.name}</p>
                          <p className="st-email-v5">{student.email}</p>
                        </div>

                      </div>
                      <div className="st-card-footer">
                        <span className="st-id-v5 badge-student-id">ID: {student.studentId || student.id}</span>
                        <span className="st-date-v5">Joined {student.joined}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-container">
                  <Users size={48} />
                  <p>No students enrolled yet.</p>
                </div>
              )}
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'Schedule' && (
            <div className="schedule-tab-v5 animate-fade">
              <div className="schedule-hdr-v5">
                <h3 className="card-title-prod">Batch Timeline</h3>
                <button className="prod-btn-outline-v5" onClick={() => setShowAddSessionModal(true)}>
                  <Plus size={16} /> Add Session
                </button>
              </div>

              <div className="schedule-sections-v5">
                {/* UPCOMING SECTION */}
                <div className="schedule-section-v5">
                  <div className="section-header-v5 upcoming">
                    <span className="section-title-v5">Upcoming Sessions</span>
                    <span className="section-count-v5">{batchSessions.filter(s => s.status !== 'completed').length}</span>
                  </div>
                  <div className="schedule-list-v5">
                    {batchSessions.filter(s => s.status !== 'completed').length > 0 ?
                      batchSessions.filter(s => s.status !== 'completed').map(session => (
                        <div key={session.id} className={`schedule-card-v5 ${session.status === 'completed' ? 'completed' : ''}`}>
                          <div className="sch-timeline-point"></div>
                          <div className="sch-card-content">
                            <div className="sch-left-v5">
                              <p className="sch-time-v5">{session.time}</p>
                              <div className="sch-info-v5">
                                <p className="sch-topic-v5">{session.topic}</p>
                                <p className="sch-meta-v5">
                                  {session.status === 'completed' && <CheckCircle size={12} style={{ color: '#10B981', marginRight: '4px' }} />}
                                  {session.status === 'active' && <Circle size={10} fill="#3B82F6" stroke="none" style={{ marginRight: '6px' }} />}
                                  {session.status === 'planned' && <Clock size={12} style={{ color: '#F59E0B', marginRight: '4px' }} />}
                                  {session.duration} • {session.date}
                                </p>
                              </div>
                            </div>
                            <span className={`sch-badge-v5 ${session.status.toLowerCase()}`}>
                              {session.status === 'active' ? '🔵 Active' : session.status === 'planned' ? '⏳ Planned' : '✅ Completed'}
                            </span>
                          </div>
                        </div>
                      )) : (
                        <div className="empty-state-mini">No upcoming sessions</div>
                      )
                    }
                  </div>
                </div>

                {/* COMPLETED SECTION */}
                <div className="schedule-section-v5">
                  <div className="section-header-v5 completed">
                    <span className="section-title-v5">Completed History</span>
                    <span className="section-count-v5">{batchSessions.filter(s => s.status === 'completed').length}</span>
                  </div>
                  <div className="schedule-list-v5">
                    {batchSessions.filter(s => s.status === 'completed').length > 0 ?
                      batchSessions.filter(s => s.status === 'completed').map(session => (
                        <div key={session.id} className={`schedule-card-v5 completed`}>
                          <div className="sch-timeline-point"></div>
                          <div className="sch-card-content">
                            <div className="sch-left-v5">
                              <p className="sch-time-v5">{session.time}</p>
                              <div className="sch-info-v5">
                                <p className="sch-topic-v5">{session.topic}</p>
                                <p className="sch-meta-v5"><Clock size={12} /> {session.duration} • {session.date}</p>
                              </div>
                            </div>
                            <span className={`sch-badge-v5 completed`}>
                              Completed
                            </span>
                          </div>
                        </div>
                      )) : (
                        <div className="empty-state-mini">No completed sessions yet</div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'History' && (
            <div className="history-tab-v5 animate-fade">

              <div className="history-timeline-v5">
                {history.length > 0 ? history.map(item => (
                  <div key={item.id} className="history-item-v5">
                    <div className="hist-indicator-v5">
                      <div className={`hist-dot-v5 ${item.type.toLowerCase()}`}></div>
                      <div className="hist-line-v5"></div>
                    </div>
                    <div className="hist-content-v5">
                      <div className="hist-meta-v5">
                        <span className={`hist-tag-v5 ${item.type.toLowerCase()}`}>{item.type}</span>
                        <span className="hist-time-v5">{item.time}</span>
                      </div>
                      <p className="hist-msg-v5">{item.message}</p>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state-container">
                    <HistoryIcon size={48} />
                    <p>No history available.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ADD STUDENT MODAL - ENHANCED with Student ID */}
      {showAddStudentModal && (
        <div className="modal-overlay-prod animate-fade">
          <div className="modal-box-prod modal-add-student-enhanced">
            <div className="modal-hdr">
              <h3>Add New Student</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="close-modal-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStudent} className="prod-form">

              {/* STUDENT ID SECTION */}
              <div className="student-id-section">
                <div className="section-title">Student ID</div>
                <div className="auto-generate-toggle">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={newStudentForm.autoGenerate}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, autoGenerate: e.target.checked })}
                    />
                    <span>Auto-generate Student ID</span>
                  </label>
                  {newStudentForm.autoGenerate && (
                    <p className="auto-gen-hint">
                      Will be: <strong>{generateStudentId(students.length)}</strong>
                    </p>
                  )}
                </div>

                {!newStudentForm.autoGenerate && (
                  <div className="input-group-v5">
                    <label>Student ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. STD001"
                      value={newStudentForm.studentId}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, studentId: e.target.value })}
                      maxLength={10}
                    />
                    <p className="field-hint">Format: STD followed by numbers (e.g., STD001, STD123)</p>
                  </div>
                )}
              </div>

              {/* STUDENT INFO SECTION */}
              <div className="student-info-section">
                <div className="section-title">Student Information</div>
                <div className="input-group-v5">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group-v5">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer-student">
                <button type="button" className="btn-cancel-v5" onClick={() => setShowAddStudentModal(false)}>Cancel</button>
                <button type="submit" className="btn-enroll-student">Enroll Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SESSION MODAL */}
      {showAddSessionModal && (
        <div className="modal-overlay-prod animate-fade">
          <div className="modal-box-session animate-scale">
            <div className="modal-hdr">
              <h3>Add New Session</h3>
              <button onClick={() => setShowAddSessionModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSessionSubmit} className="prod-form">
              <div className="input-group-v5">
                <label>Session Title</label>
                <input
                  name="topic"
                  type="text"
                  placeholder="e.g. Intro to Node.js"
                  required
                />
              </div>
              <div className="form-row-grid">
                <div className="input-group-v5">
                  <label>Date</label>
                  <input name="date" type="date" required />
                </div>
                <div className="input-group-v5">
                  <label>Time</label>
                  <input name="time" type="time" required />
                </div>
              </div>
              <div className="form-row-grid">
                <div className="input-group-v5">
                  <label>Duration</label>
                  <input name="duration" type="text" placeholder="e.g. 2h or 120" required />
                </div>
                <div className="input-group-v5">
                  <label>Status</label>
                  <select name="status">
                    <option value="Planned">Planned</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer-btns">
                <button type="button" className="btn-cancel-v5" onClick={() => setShowAddSessionModal(false)}>Cancel</button>
                <button type="submit" className="btn-save-v5">Save Session</button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default BatchDetails;
