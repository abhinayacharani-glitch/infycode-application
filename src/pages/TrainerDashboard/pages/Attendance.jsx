import React, { useState, useMemo, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  AlertCircle,
  Bell,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  XCircle,
  Clock3
} from 'lucide-react';
import './Attendance.css';

// --- DATA SOURCE (Simulated from other modules) ---
const batches = [
  { id: 'B1', title: 'JavaScript Fundamentals', totalStudents: 32, rate: 91 },
  { id: 'B2', title: 'Node.js Basics', totalStudents: 28, rate: 95 },
  { id: 'B3', title: 'Interview Prep', totalStudents: 24, rate: 93 },
  { id: 'B4', title: 'React Advanced', totalStudents: 18, rate: 88 }
];

const studentData = {
  B1: [
    { id: 1, name: 'Rahul Kumar', initial: 'RK' },
    { id: 2, name: 'Priya Anand', initial: 'PA' },
    { id: 3, name: 'Suresh Menon', initial: 'SM' },
    { id: 4, name: 'Ananya Mishra', initial: 'AM' },
    { id: 5, name: 'Vikram K.', initial: 'VK' }
  ],
  B2: [
    { id: 6, name: 'Amit Shah', initial: 'AS' },
    { id: 7, name: 'Neha Gupta', initial: 'NG' },
    { id: 8, name: 'Sandeep V.', initial: 'SV' },
    { id: 9, name: 'Megha R.', initial: 'MR' }
  ],
  B3: [
    { id: 10, name: 'Pooja T.', initial: 'PT' },
    { id: 11, name: 'Rohan M.', initial: 'RM' }
  ],
  B4: [
    { id: 12, name: 'Ishita S.', initial: 'IS' },
    { id: 13, name: 'Kartik A.', initial: 'KA' }
  ]
};

const Attendance = () => {
  const [selectedBatchId, setSelectedBatchId] = useState('B1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewDate, setViewDate] = useState(new Date()); // For Calendar Month Navigation
  const [markedRecords, setMarkedRecords] = useState({}); // { [date_batchId]: { studentId: 'present'|'absent'|'late' } }
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Initial dummy records
    const initialRecords = {
      [`2026-04-10_B1`]: { 1: 'present', 2: 'present', 3: 'present', 4: 'absent', 5: 'present' },
      [`2026-04-09_B1`]: { 1: 'present', 2: 'present', 3: 'present', 4: 'present', 5: 'present' }
    };
    setMarkedRecords(initialRecords);
  }, []);

  const currentStudents = useMemo(() => studentData[selectedBatchId] || [], [selectedBatchId]);
  const currentAttendance = useMemo(() => markedRecords[`${selectedDate}_${selectedBatchId}`] || {}, [selectedDate, selectedBatchId, markedRecords]);

  // History Summary Calculation
  const attStats = useMemo(() => {
    const stats = { present: 0, absent: 0, late: 0 };
    Object.values(currentAttendance).forEach(val => {
      if (val === 'present') stats.present++;
      else if (val === 'absent') stats.absent++;
      else if (val === 'late') stats.late++;
    });
    return stats;
  }, [currentAttendance]);

  const handleStatusChange = (studentId, status) => {
    const key = `${selectedDate}_${selectedBatchId}`;
    setMarkedRecords(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [studentId]: status
      }
    }));
  };

  const handleSubmit = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const calculateOverallRate = () => {
    const total = batches.reduce((acc, b) => acc + b.rate, 0);
    return Math.round(total / batches.length);
  };

  const isTodayMarked = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const key = `${todayStr}_${selectedBatchId}`;
    return markedRecords[key] && Object.keys(markedRecords[key]).length > 0;
  }, [markedRecords, selectedBatchId]);

  // Calendar Helper Logic
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust for Monday start: [M, T, W, T, F, S, S]
    // Standard getDay prefix: Sun=0, Mon=1...
    // Mon prefix = (firstDay + 6) % 7
    const prefixCount = (firstDay + 6) % 7;

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const isMarked = markedRecords[`${dateStr}_${selectedBatchId}`];
      const isToday = date.toDateString() === today.toDateString();
      const isUpcoming = date > today && date.getDay() !== 0; // Not Sunday

      let status = 'empty';
      if (isMarked) status = 'marked';
      else if (isToday) status = 'today';
      else if (isUpcoming) status = 'upcoming';

      days.push({ day: i, dateStr, status });
    }
    return { prefix: prefixCount, days };
  }, [viewDate, markedRecords, selectedBatchId]);

  const changeMonth = (offset) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
    setViewDate(newDate);
  };

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
  };

  const formatViewMonth = () => {
    return viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="attendance-page-saas">
      {showToast && (
        <div className="attendance-toast">
          <CheckCircle size={18} />
          <span>Attendance submitted successfully!</span>
        </div>
      )}

      {/* HEADER */}
      <div className="att-header-row">
        <div className="hdr-left">
          <h1 className="att-title">Attendance</h1>

          <p className="att-subtitle">Manage and track student attendance records</p>

        </div>
        <div className="hdr-right">
          <div className="date-display-pill">
            <CalendarIcon size={16} />
            <span>Today, {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="attendance-main-grid">
        {/* LEFT COLUMN - MARKING & HISTORY */}
        <div className="att-marking-section">
          <div className="att-card mark-card animate-fade-up">
            <div className="card-hdr flex-between">
              <div>
                <h2 className="card-title">Mark Attendance</h2>
                <p className="card-desc">Session records for {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long' })}</p>
              </div>
              <div className="quick-jump">
                <label>Jump to Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateClick(e.target.value)}
                  className="quick-jump-input"
                />
              </div>
            </div>

            <div className="marking-controls">
              <div className="input-group">
                <label>Select Batch</label>
                <select
                  className="att-select"
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.id} – {b.title}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Selected Session</label>
                <div className="date-display-box">
                  <CalendarIcon size={14} />
                  <span>{new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="student-list-container">
              {currentStudents.length > 0 ? (
                <>
                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>STUDENT</th>
                        <th className="text-center">PRESENT</th>
                        <th className="text-center">ABSENT</th>
                        <th className="text-center">LATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentStudents.map(student => (
                        <tr key={student.id}>
                          <td>
                            <div className="st-info">
                              <div className={`st-avatar av-${student.id % 5}`}>{student.initial}</div>
                              <span className="st-name">{student.name}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <label className="radio-btn">
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                checked={currentAttendance[student.id] === 'present'}
                                onChange={() => handleStatusChange(student.id, 'present')}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </td>
                          <td className="text-center">
                            <label className="radio-btn">
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                checked={currentAttendance[student.id] === 'absent'}
                                onChange={() => handleStatusChange(student.id, 'absent')}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </td>
                          <td className="text-center">
                            <label className="radio-btn">
                              <input
                                type="radio"
                                name={`status-${student.id}`}
                                checked={currentAttendance[student.id] === 'late'}
                                onChange={() => handleStatusChange(student.id, 'late')}
                              />
                              <span className="checkmark"></span>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mark-card-footer">
                    <button className="att-btn-primary" onClick={handleSubmit}>Submit Attendance</button>
                  </div>
                </>
              ) : (
                <div className="att-empty-state">
                  <AlertCircle size={32} />
                  <p>No students assigned to this batch</p>
                </div>
              )}
            </div>
          </div>

          {/* HISTORY SUMMARY SECTION */}
          <div className={`att-card history-summary-card animate-fade-up ${Object.keys(currentAttendance).length === 0 ? 'no-data' : ''}`}>
            <div className="card-hdr">
              <h2 className="card-title">Attendance Details – {new Date(selectedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h2>
              <p className="card-desc">Historical data breakdown for this session</p>
            </div>

            {Object.keys(currentAttendance).length > 0 ? (
              <div className="history-stats-grid">
                <div className="h-stat-item present">
                  <div className="h-icon"><TrendingUp size={16} /></div>
                  <div className="h-info">
                    <span className="h-label">Present</span>
                    <span className="h-val">{attStats.present}</span>
                  </div>
                </div>
                <div className="h-stat-item absent">
                  <div className="h-icon"><XCircle size={16} /></div>
                  <div className="h-info">
                    <span className="h-label">Absent</span>
                    <span className="h-val">{attStats.absent}</span>
                  </div>
                </div>
                <div className="h-stat-item late">
                  <div className="h-icon"><Clock3 size={16} /></div>
                  <div className="h-info">
                    <span className="h-label">Late</span>
                    <span className="h-val">{attStats.late}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="history-empty">
                <p>No attendance recorded for this date</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - STATS & CALENDAR */}
        <div className="att-stats-section">
          <div className="stats-cards-row">
            <div className="att-card stats-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div className="stats-icon-wrapper green">
                <CheckCircle size={20} />
              </div>
              <div className="stats-content">
                <h3 className="stats-val">{calculateOverallRate()}%</h3>
                <p className="stats-lbl">Overall Attendance</p>
              </div>
            </div>

            <div className={`att-card stats-card animate-fade-up ${isTodayMarked ? 'marked' : 'pending'}`} style={{ animationDelay: '0.2s' }}>
              <div className={`stats-icon-wrapper ${isTodayMarked ? 'green' : 'orange'}`}>
                {isTodayMarked ? <Check size={20} /> : <Clock size={20} />}
              </div>
              <div className="stats-content">
                <h3 className={`stats-val ${isTodayMarked ? 'text-green' : 'text-orange'}`}>
                  {isTodayMarked ? 'Marked' : 'Pending'}
                </h3>
                <p className="stats-lbl">Today's Status</p>
              </div>
            </div>
          </div>

          <div className="att-card calendar-card animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <div className="card-hdr calendar-nav-hdr">
              <div className="nav-title-box">
                <h2 className="card-title">{formatViewMonth()}</h2>
                <p className="card-desc">Attendance Overview</p>
              </div>
              <div className="calendar-nav-controls">
                <button onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></button>
                <button onClick={() => changeMonth(1)}><ChevronRight size={20} /></button>
              </div>
            </div>

            <div className="calendar-grid-wrapper">
              <div className="calendar-days-header">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d}>{d}</span>)}
              </div>
              <div className="calendar-days-grid">
                {[...Array(calendarDays.prefix)].map((_, i) => <div key={`empty-${i}`} className="cal-day other-month"></div>)}
                {calendarDays.days.map((d, i) => (
                  <div
                    key={i}
                    className={`cal-day ${d.status} ${selectedDate === d.dateStr ? 'selected' : ''}`}
                    onClick={() => handleDateClick(d.dateStr)}
                    title={d.status === 'marked' ? 'Attendance Marked' : 'Not Marked'}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
              <div className="calendar-legend-new">
                <div className="leg-item"><span className="leg-dot marked"></span> Marked</div>
                <div className="leg-item"><span className="leg-dot today"></span> Today</div>
                <div className="leg-item"><span className="leg-dot upcoming"></span> Upcoming</div>
                <div className="leg-item"><span className="leg-dot empty"></span> Not Marked</div>
              </div>
            </div>
          </div>

          <div className="att-card performance-card animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="card-hdr">
              <h2 className="card-title">Attendance by Batch</h2>
            </div>
            <div className="batch-performance-list">
              {batches.map((batch, idx) => (
                <div key={batch.id} className="batch-perf-card">
                  <div className="perf-info">
                    <div className="perf-name-box">
                      <span className={`perf-dot dot-${idx}`}></span>
                      <span className="perf-name">{batch.id} – {batch.title}</span>
                    </div>
                    <span className="perf-val">{batch.rate}%</span>
                  </div>
                  <div className="perf-bar-track">
                    <div className="perf-bar-fill" style={{ width: `${batch.rate}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
