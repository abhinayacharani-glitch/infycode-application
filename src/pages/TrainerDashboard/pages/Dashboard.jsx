import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';

const Counter = ({ target, isDecimal = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let s = 0;
    const dur = 1400;
    const step = 16;
    const inc = target / (dur / step);
    
    const t = setInterval(() => {
      s += inc;
      if (s >= target) {
        s = target;
        clearInterval(t);
      }
      setCount(s);
    }, step);
    
    return () => clearInterval(t);
  }, [target]);

  return <span>{isDecimal ? count.toFixed(1) : Math.floor(count)}</span>;
};

const Dashboard = () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
    const userName = loggedUser.username || "Trainer";
    const navigate = useNavigate();
  const [widths, setWidths] = useState({
    students: '0%',
    batches: '0%',
    hours: '0%',
    rating: '0%',
    b12: '0%',
    c09: '0%',
    a05: '0%',
    d02: '0%',
    donut: '174 115'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidths({
        students: '82%',
        batches: '60%',
        hours: '72%',
        rating: '95%',
        b12: '75%',
        c09: '60%',
        a05: '90%',
        d02: '30%',
        donut: '115 174'
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const days = [
    { d: 'Mon', h: 4 },
    { d: 'Tue', h: 6 },
    { d: 'Wed', h: 3, today: true },
    { d: 'Thu', h: 5 },
    { d: 'Fri', h: 7 },
    { d: 'Sat', h: 2 },
    { d: 'Sun', h: 0 }
  ];

  return (
    <div className="page active" id="page-dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Good Morning, {userName}! ✨</h2>
          <p>You have 3 sessions today · 2 assignments pending review · 1 new message</p>
        </div>
        <div className="welcome-stats">
          <div className="w-stat">
            <div className="w-stat-num"><Counter target={128} /></div>
            <div className="w-stat-label">Students</div>
          </div>
          <div className="w-divider"></div>
          <div className="w-stat">
            <div className="w-stat-num"><Counter target={4} /></div>
            <div className="w-stat-label">Batches</div>
          </div>
          <div className="w-divider"></div>
          <div className="w-stat">
            <div className="w-stat-num"><Counter target={96} /></div>
            <div className="w-stat-label">Hours</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-top">
            <div className="kpi-icon blue">👥</div>
            <span className="kpi-trend up">↑ 12%</span>
          </div>
          <div className="kpi-val"><Counter target={128} /></div>
          <div className="kpi-label">Total Students</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill blue" style={{ width: widths.students }}></div>
          </div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top">
            <div className="kpi-icon green">📁</div>
            <span className="kpi-trend up">↑ 5%</span>
          </div>
          <div className="kpi-val"><Counter target={4} /></div>
          <div className="kpi-label">Active Batches</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill green" style={{ width: widths.batches }}></div>
          </div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-top">
            <div className="kpi-icon amber">🕒</div>
            <span className="kpi-trend up">↑ 8%</span>
          </div>
          <div className="kpi-val"><Counter target={96} /></div>
          <div className="kpi-label">Training Hours</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill amber" style={{ width: widths.hours }}></div>
          </div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top">
            <div className="kpi-icon purple">🏅</div>
            <span className="kpi-trend up">↑ 3%</span>
          </div>
          <div className="kpi-val"><Counter target={4.8} isDecimal={true} /></div>
          <div className="kpi-label">Avg. Rating</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill" style={{ width: widths.rating, background: 'linear-gradient(90deg,#93c5fd,var(--purple))' }}></div>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {/* Today's Schedule */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🕐 Today's Schedule</div>
              <div className="card-sub">Wednesday, March 18, 2026</div>
            </div>
            <a className="view-all" onClick={() => navigate('/trainer-dashboard/schedule')}>View All</a>
          </div>
          <div className="card-body">
            <div className="schedule-item">
              <div className="sch-time">09:00 AM</div>
              <div className="sch-dot" style={{ background: 'var(--blue-500)' }}></div>
              <div className="sch-info">
                <div className="sch-course">Full Stack Development</div>
                <div className="sch-batch">Batch B12 · 32 Students</div>
                <span className="sch-mode online">🌐 Online</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">12:00 PM</div>
              <div className="sch-dot" style={{ background: 'var(--green)' }}></div>
              <div className="sch-info">
                <div className="sch-course">Python & Data Science</div>
                <div className="sch-batch">Batch C09 · 28 Students</div>
                <span className="sch-mode offline">🏛️ Offline</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">03:30 PM</div>
              <div className="sch-dot" style={{ background: 'var(--purple)' }}></div>
              <div className="sch-info">
                <div className="sch-course">UI/UX Design Basics</div>
                <div className="sch-batch">Batch A05 · 24 Students</div>
                <span className="sch-mode online">🟢 Online</span>
              </div>
            </div>
            <div className="schedule-item">
              <div className="sch-time">06:00 PM</div>
              <div className="sch-dot" style={{ background: 'var(--amber)' }}></div>
              <div className="sch-info">
                <div className="sch-course">DevOps Fundamentals</div>
                <div className="sch-batch">Batch D02 · 20 Students</div>
                <span className="sch-mode online">🟢 Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions + Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div className="card-header"><div className="card-title">🚀 Quick Actions</div></div>
            <div className="card-body">
              <div className="qa-grid">
                <div className="qa-btn" onClick={() => navigate('/trainer-dashboard/attendance')}>
                  <span>📋</span><span>Mark Attendance</span>
                </div>
                <div className="qa-btn" onClick={() => navigate('/trainer-dashboard/materials')}>
                  <span>📤</span><span>Upload Material</span>
                </div>
                <div className="qa-btn">
                  <span>📝</span><span>Post Assignment</span>
                </div>
                <div className="qa-btn" onClick={() => navigate('/trainer-dashboard/messages')}>
                  <span>✉️</span><span>Message Batch</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">📢 Notifications</div><a className="view-all">Clear All</a></div>
            <div className="card-body" style={{ paddingBottom: '12px' }}>
              <div className="notif-item">
                <div className="notif-icon" style={{ background: 'var(--blue-50)' }}>📩</div>
                <div>
                  <div className="notif-msg">New batch <b>E14</b> has been assigned to you for React Advanced course.</div>
                  <div className="notif-time">2 hours ago</div>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-icon" style={{ background: 'var(--green-light)' }}>📝</div>
                <div>
                  <div className="notif-msg">Student <b>Priya S.</b> submitted assignment for review.</div>
                  <div className="notif-time">5 hours ago</div>
                </div>
              </div>
              <div className="notif-item">
                <div className="notif-icon" style={{ background: 'var(--amber-light)' }}>⏰</div>
                <div>
                  <div className="notif-msg">Attendance report for Batch B12 is due today.</div>
                  <div className="notif-time">8 hours ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Batch Progress */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">📈 Batch Progress</div><div className="card-sub">Course completion overview</div></div>
            <a className="view-all" onClick={() => navigate('/trainer-dashboard/batches')}>View All</a>
          </div>
          <div className="card-body" style={{ paddingTop: '8px' }}>
            <table className="batch-table">
              <thead><tr><th>Batch</th><th>Course</th><th>Progress</th><th>Status</th></tr></thead>
              <tbody>
                <tr>
                  <td><b>B12</b></td>
                  <td>Full Stack Dev</td>
                  <td>
                    <div className="progress-wrap">
                      <div className="prog-bar"><div className="prog-fill" style={{ width: widths.b12 }}></div></div>
                      <span className="prog-pct">75%</span>
                    </div>
                  </td>
                  <td><span className="badge active-b">Active</span></td>
                </tr>
                <tr>
                  <td><b>C09</b></td>
                  <td>Python & DS</td>
                  <td>
                    <div className="progress-wrap">
                      <div className="prog-bar"><div className="prog-fill" style={{ width: widths.c09 }}></div></div>
                      <span className="prog-pct">60%</span>
                    </div>
                  </td>
                  <td><span className="badge active-b">Active</span></td>
                </tr>
                <tr>
                  <td><b>A05</b></td>
                  <td>UI/UX Design</td>
                  <td>
                    <div className="progress-wrap">
                      <div className="prog-bar"><div className="prog-fill" style={{ width: widths.a05 }}></div></div>
                      <span className="prog-pct">90%</span>
                    </div>
                  </td>
                  <td><span className="badge active-b">Active</span></td>
                </tr>
                <tr>
                  <td><b>D02</b></td>
                  <td>DevOps</td>
                  <td>
                    <div className="progress-wrap">
                      <div className="prog-bar"><div className="prog-fill" style={{ width: widths.d02 }}></div></div>
                      <span className="prog-pct">30%</span>
                    </div>
                  </td>
                  <td><span className="badge upcoming">New</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Chart + Student Performance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div className="card-header"><div className="card-title">📊 Weekly Sessions</div><div className="card-sub">Hours delivered this week</div></div>
            <div className="card-body">
              <div className="bar-chart" id="activity-chart">
                {days.map((day, index) => {
                  const pct = Math.round((day.h / 8) * 100);
                  return (
                    <div className="bar-col" key={index}>
                      <div 
                        className={`bar-fill${day.today ? ' today' : ''}`} 
                        style={{ height: `${pct}%` }} 
                        title={`${day.h} hrs`}
                      ></div>
                      <div className="bar-day">{day.d}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">🌟 Top Students</div><a className="view-all">See All</a></div>
            <div className="card-body" style={{ paddingBottom: '8px' }}>
              <div className="perf-row">
                <div className="perf-avatar" style={{ background: 'linear-gradient(135deg,var(--blue-400),var(--blue-600))' }}>PS</div>
                <div><div className="perf-name">Priya Sharma</div><div className="perf-course">Full Stack Dev · B12</div></div>
                <div className="perf-score"><span className="score-num high">98%</span><span className="score-label">Score</span></div>
              </div>
              <div className="perf-row">
                <div className="perf-avatar" style={{ background: 'linear-gradient(135deg,#7dd3fc,var(--green))' }}>AK</div>
                <div><div className="perf-name">Arjun Kumar</div><div className="perf-course">Python & DS · C09</div></div>
                <div className="perf-score"><span className="score-num high">94%</span><span className="score-label">Score</span></div>
              </div>
              <div className="perf-row">
                <div className="perf-avatar" style={{ background: 'linear-gradient(135deg,#93c5fd,var(--purple))' }}>NR</div>
                <div><div className="perf-name">Nisha Reddy</div><div className="perf-course">UI/UX Design · A05</div></div>
                <div className="perf-score"><span className="score-num mid">87%</span><span className="score-label">Score</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Distribution */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="card-header"><div className="card-title">📍 Course Mode Distribution</div><div className="card-sub">Online vs Offline split across batches</div></div>
        <div className="card-body">
          <div className="donut-wrap">
            <svg className="donut-svg" width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--border)" strokeWidth="18"/>
              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--blue-500)" strokeWidth="18"
                strokeDasharray="174 115" strokeDashoffset="23" strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1)', transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}/>
              <circle cx="60" cy="60" r="46" fill="none" stroke="var(--accent)" strokeWidth="18"
                strokeDasharray={widths.donut} strokeDashoffset="23" strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1.4s cubic-bezier(.4,0,.2,1) .1s', transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}/>
              <text x="60" y="65" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--text-dark)" fontFamily="Plus Jakarta Sans">60%</text>
            </svg>
            <div className="donut-legend" style={{ flex: 1, maxWidth: '300px' }}>
              <div className="leg-item"><div className="leg-dot" style={{ background: 'var(--blue-500)' }}></div><span className="leg-label">Online Training</span><span className="leg-val" style={{ marginLeft: '12px' }}>60%</span></div>
              <div className="leg-item"><div className="leg-dot" style={{ background: 'var(--accent)' }}></div><span className="leg-label">Offline Training</span><span className="leg-val" style={{ marginLeft: '12px' }}>40%</span></div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'flex-end' }}>
              <div style={{ textAlign: 'center', padding: '14px 20px', background: 'var(--blue-50)', borderRadius: '12px', border: '1px solid var(--blue-100)' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--blue-500)' }}>3</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>Online Batches</div>
              </div>
              <div style={{ textAlign: 'center', padding: '14px 20px', background: 'var(--accent-light)', borderRadius: '12px', border: '1px solid var(--blue-100)' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent)' }}>1</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>Offline Batches</div>
              </div>
              <div style={{ textAlign: 'center', padding: '14px 20px', background: 'var(--green-light)', borderRadius: '12px', border: '1px solid var(--blue-100)' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--green)' }}>128</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>Total Students</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

