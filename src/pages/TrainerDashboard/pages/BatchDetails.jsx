import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Users, CheckCircle, Clock, Calendar,
  BookOpen, Play, History as HistoryIcon,
  MessageSquare, Plus, X, Search, ChevronRight,
  Monitor, Layout, Database, Zap
} from 'lucide-react';
import './BatchDetails.css';

// 0. CENTRALIZED DATA SOURCE
const batchesData = {
  B1: {
    title: "Full Stack Development",
    startDate: "2026-01-10",
    endDate: "2026-04-10",
    duration: "3 Months",
    mode: "Online",
    students: 32,
    progress: 45,
    totalSessions: 20,
    completedSessions: 9,
    nextSession: {
      topic: "React Context API",
      date: "2026-04-12",
      time: "10:00 AM"
    }
  },
  B2: {
    title: "Python & Data Science",
    startDate: "2026-02-15",
    endDate: "2026-06-15",
    duration: "4 Months",
    mode: "Offline",
    students: 28,
    progress: 30,
    totalSessions: 25,
    completedSessions: 7,
    nextSession: {
      topic: "Pandas Basics",
      date: "2026-04-13",
      time: "11:30 AM"
    }
  },
  B3: {
    title: "UI/UX Design Basics",
    startDate: "2026-03-01",
    endDate: "2026-05-01",
    duration: "2 Months",
    mode: "Online",
    students: 24,
    progress: 60,
    totalSessions: 15,
    completedSessions: 9,
    nextSession: {
      topic: "Wireframing",
      date: "2026-04-11",
      time: "02:00 PM"
    }
  },
  B4: {
    title: "Cloud Architecture",
    startDate: "2026-03-10",
    endDate: "2026-05-10",
    duration: "2 Months",
    mode: "Online",
    students: 18,
    progress: 20,
    totalSessions: 12,
    completedSessions: 3,
    nextSession: {
      topic: "AWS EC2",
      date: "2026-04-14",
      time: "09:00 AM"
    }
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

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

const BatchDetails = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const batch = batchesData[batchId];

  const [activeTab, setActiveTab] = useState('Overview');
  const [showAddSessionModal, setShowAddSessionModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');

  const [sessionForm, setSessionForm] = useState({
    title: '',
    date: '',
    time: '',
    duration: '',
    status: 'Planned'
  });


  const handleSessionSubmit = (e) => {
    e.preventDefault();
    console.log("Saving session:", sessionForm);
    setShowAddSessionModal(false);
    // Reset form
    setSessionForm({ title: '', date: '', time: '', duration: '', status: 'Planned' });
  };

  if (!batch) {
    return (
      <div className="batch-details-production">
        <div className="main-content">
          <div className="card-production" style={{ textAlign: 'center', padding: '60px' }}>
            <h2 className="title-bold">Batch Not Found</h2>
            <p className="subtitle-gray">The batch ID "{batchId}" does not exist in our records.</p>
            <button className="add-student-btn-prod" onClick={() => navigate('/trainer-dashboard/batches')} style={{ margin: '20px auto' }}>
              Back to Batches
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1. DATA INITIALIZATION (Students/Sessions/History with Dummy Data Defaults)
  const [students, setStudents] = useState(() => {
    try {
      const stored = localStorage.getItem(`batch_students_v3_${batchId}`);
      if (stored) return JSON.parse(stored);
      return [
        { id: "ST-101", name: "John Doe", email: "john@example.com", joined: "2026-01-10" },
        { id: "ST-102", name: "Alice Smith", email: "alice@example.com", joined: "2026-01-11" },
        { id: "ST-103", name: "Bob Wilson", email: "bob@example.com", joined: "2026-01-12" },
        { id: "ST-104", name: "Charlie Day", email: "charlie@example.com", joined: "2026-01-13" },
      ];
    } catch { return []; }
  });

  const [batchSessions, setBatchSessions] = useState(() => {
    try {
      const stored = localStorage.getItem(`batch_sessions_v3_${batchId}`);
      if (stored) return JSON.parse(stored);
      return [
        { id: 1, topic: "React Context API", date: "2026-04-10", time: "09:00 AM", duration: "2h", status: "Completed" },
        { id: 2, topic: "Redux State Management", date: "2026-04-11", time: "10:00 AM", duration: "2h", status: "Planned" },
        { id: 3, topic: "Node.js Express Basics", date: "2026-04-12", time: "09:00 AM", duration: "2.5h", status: "Planned" }
      ];
    } catch { return []; }
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

  useEffect(() => {
    localStorage.setItem(`batch_students_v3_${batchId}`, JSON.stringify(students));
    localStorage.setItem(`batch_sessions_v3_${batchId}`, JSON.stringify(batchSessions));
    localStorage.setItem(`batch_history_v3_${batchId}`, JSON.stringify(history));
  }, [students, batchSessions, history, batchId]);

  // 2. LOGIC Helper
  const progressPct = batch.progress;
  const nextSession = batchSessions.find(s => s.status === 'Planned');
  const lastCompleted = [...batchSessions].reverse().find(s => s.status === 'Completed');

  const handleNotesChange = (val) => {
    setNotes(val);
    localStorage.setItem(`batch_notes_${batchId}`, val);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setIsSaving(true);
    saveTimeoutRef.current = setTimeout(() => setIsSaving(false), 1500);
  };

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

        {/* HEADER GRID */}
        <div className="header-container-grid">
          <div className="header-left">
            <h1 className="title-bold">{batch.title}</h1>
            <p className="subtitle-gray">Batch {batchId} • Trainer Overview</p>
          </div>

          <div className="header-info-structured">
            <div className="info-top-row">
              <div className="info-item-prod"><Calendar size={14} /> {batch.startDate} — {batch.endDate}</div>
              <div className="info-item-prod"><Clock size={14} /> {batch.duration}</div>
              <div className="info-item-prod"><Monitor size={14} /> {batch.mode}</div>
              <div className="info-item-prod"><Users size={14} /> {students.length} Students</div>
            </div>

            <div className="info-bottom-row">
              <div className="status-badge-prod next">
                Next: <b>{nextSession ? `${nextSession.date}` : 'No upcoming'}</b>
              </div>
              <div className="status-badge-prod updated">
                Updated: <b>36m ago</b>
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
                <div className="card-production progress-card animate-fade">
                  <div className="progress-top-row">
                    <div>
                      <h3 className="card-title-prod">Course Progress</h3>
                      <p className="card-lbl-gray">Syllabus Completion</p>
                    </div>
                    <div className="progress-value-accent">{progressPct}%</div>
                  </div>
                  <div className="progress-body-flex">
                    <CircularProgress pct={progressPct} />
                    <div className="progress-stats-prod">
                      <div className="st-row"><span className="dot blue"></span> <span>{batch.completedSessions} Completed</span></div>
                      <div className="st-row"><span className="dot gray"></span> <span>{batch.totalSessions} Total</span></div>
                    </div>
                  </div>
                </div>

                <div className="card-production tracker-card-v5">
                  <h3 className="card-title-prod">Smart Session Tracker</h3>
                  <div className="tracker-split-v5">
                    <div className="tracker-box-v5 last">
                      <p className="tiny-lbl">LAST COMPLETED</p>
                      <p className="box-val">{lastCompleted ? lastCompleted.topic : 'None'}</p>
                    </div>
                    <div className="v-divider-v5"></div>
                    <div className="tracker-box-v5 next">
                      <p className="tiny-lbl">NEXT UPCOMING</p>
                      <p className="box-val">{nextSession ? nextSession.topic : 'None'}</p>
                    </div>
                  </div>
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
                      <button className="join-session-btn-v5">Join Session Now</button>
                    </div>
                  ) : <div className="empty-state-v5">No sessions scheduled</div>}
                </div>

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
                    placeholder="Search students..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                  />
                </div>
                <button className="prod-btn-primary-v5" onClick={() => setShowAddStudentModal(true)}>
                  <Plus size={16} /> Add Student
                </button>
              </div>

              {students.length > 0 ? (
                <div className="students-grid-v5">
                  {students.filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase())).map(student => (
                    <div key={student.id} className="student-card-v5">
                      <div className="st-card-hdr">
                        <div className="st-avatar-v5">{student.name.charAt(0)}</div>
                        <div className="st-main-info">
                          <p className="st-name-v5">{student.name}</p>
                          <p className="st-email-v5">{student.email}</p>
                        </div>
                        <button className="st-menu-btn"><ChevronRight size={18} /></button>
                      </div>
                      <div className="st-card-footer">
                        <span className="st-id-v5">ID: {student.id}</span>
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
              <div className="schedule-list-v5">
                {batchSessions.length > 0 ? batchSessions.map(session => (
                  <div key={session.id} className="schedule-card-v5">
                    <div className="sch-timeline-point"></div>
                    <div className="sch-card-content">
                      <div className="sch-left-v5">
                        <p className="sch-time-v5">{session.time}</p>
                        <div className="sch-info-v5">
                          <p className="sch-topic-v5">{session.topic}</p>
                          <p className="sch-meta-v5"><Clock size={12} /> {session.duration} • {session.date}</p>
                        </div>
                      </div>
                      <span className={`sch-badge-v5 ${session.status.toLowerCase()}`}>
                        {session.status}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="empty-state-container">
                    <Calendar size={48} />
                    <p>No sessions scheduled available.</p>
                  </div>
                )}
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

      {/* ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="modal-overlay-prod animate-fade">
          <div className="modal-box-prod">
            <div className="modal-hdr">
              <h3>Add New Student</h3>
              <button onClick={() => setShowAddStudentModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowAddStudentModal(false); }} className="prod-form">
              <div className="input-group-v5">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. John Doe" required />
              </div>
              <div className="input-group-v5">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>
              <button type="submit" className="prod-btn-primary-v5 full-width">Enroll Student</button>
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
                  type="text"
                  placeholder="e.g. Intro to Node.js"
                  value={sessionForm.title}
                  onChange={e => setSessionForm({ ...sessionForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-row-grid">
                <div className="input-group-v5">
                  <label>Date</label>
                  <input
                    type="date"
                    value={sessionForm.date}
                    onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group-v5">
                  <label>Time</label>
                  <input
                    type="time"
                    value={sessionForm.time}
                    onChange={e => setSessionForm({ ...sessionForm, time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-row-grid">
                <div className="input-group-v5">
                  <label>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 2h"
                    value={sessionForm.duration}
                    onChange={e => setSessionForm({ ...sessionForm, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group-v5">
                  <label>Status</label>
                  <select
                    value={sessionForm.status}
                    onChange={e => setSessionForm({ ...sessionForm, status: e.target.value })}
                  >
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
