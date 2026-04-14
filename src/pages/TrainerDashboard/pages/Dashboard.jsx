import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Layers, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  MoreVertical,
  Play,
  Upload,
  UserCheck,
  MessageSquare,
  FileText
} from 'lucide-react';
import LiveSessionCard from '../components/LiveSessionCard';
import './Dashboard.css';

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
    b12: '0%',
    c09: '0%',
    a05: '0%',
    d02: '0%',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidths({
        b12: '75%',
        c09: '60%',
        a05: '90%',
        d02: '30%',
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const kpis = [
    { label: 'Active Batches', value: 4, trend: '+5%', icon: <Layers size={20} />, color: 'blue' },
    { label: 'Total Students', value: 128, trend: '+12%', icon: <Users size={20} />, color: 'green' },
    { label: 'Sessions Today', value: 3, trend: 'On track', icon: <Calendar size={20} />, color: 'amber' },
    { label: 'Avg Attendance', value: 92, trend: '+3%', icon: <CheckCircle size={20} />, color: 'purple', suffix: '%' }
  ];

  const [schedule, setSchedule] = useState(() => {
    const fallback = [
      { id: 1, time: '09:00 AM', course: 'Full Stack Development', batch: 'B12', students: 32, duration: '2h', mode: 'Online', status: 'Completed' },
      { id: 2, time: '12:00 PM', course: 'Python & Data Science', batch: 'C09', students: 28, duration: '1.5h', mode: 'Offline', status: 'In Progress', active: true },
      { id: 3, time: '03:30 PM', course: 'UI/UX Design Basics', batch: 'A05', students: 24, duration: '2h', mode: 'Online', status: 'Upcoming' },
    ];
    try {
      const computeSessionStatus = (dateStr) => {
          const today = new Date().toISOString().split('T')[0];
          if (dateStr < today) return 'completed';
          if (dateStr === today) return 'active';
          return 'planned';
      };
      const data = localStorage.getItem('trainer_sessions');
      if (data) {
        const parsed = JSON.parse(data);
        const todayStr = new Date().toISOString().split('T')[0];
        const allForToday = parsed
          .filter(s => s.date === todayStr)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));

        const activeSess = allForToday.filter(s => computeSessionStatus(s.date) === 'active');
        const nextPlanned = allForToday.filter(s => computeSessionStatus(s.date) === 'planned').slice(0, 1);
        
        const todaySess = [...activeSess, ...nextPlanned].map(s => ({
            id: s.id,
            time: s.startTime,
            course: s.courseName || s.topic,
            batch: s.batchId,
            duration: `${s.duration}m`,
            mode: s.mode,
            status: computeSessionStatus(s.date),
            active: computeSessionStatus(s.date) === 'active'
        }));
        if (todaySess.length > 0) return todaySess;
      }
      return fallback;
    } catch {
      return fallback;
    }
  });

  const activities = [
    { type: 'attendance', msg: 'Attendance marked for Batch B12', time: '2 hours ago' },
    { type: 'upload', msg: 'New course material uploaded for React', time: '4 hours ago' },
    { type: 'feedback', msg: 'Received 5-star feedback from Batch C09', time: '1 day ago' },
    { type: 'system', msg: 'Batch D02 schedule updated', time: '2 days ago' },
  ];

  return (
    <div className="dashboard-container">
      {/* 0. HEADER */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your training performance and batches</p>
      </div>

      {/* 1. TOP KPI CARDS */}
      <div className="dashboard-kpi-row">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`kpi-card-saas ${kpi.color}`}>
            <div className="kpi-header">
              <div className={`kpi-icon-box ${kpi.color}`}>{kpi.icon}</div>
              <span className="kpi-trend-badge">{kpi.trend}</span>
            </div>
            <div className="kpi-content">
              <h3 className="kpi-value">
                <Counter target={kpi.value} />{kpi.suffix}
              </h3>
              <p className="kpi-label">{kpi.label}</p>
            </div>
            <div className="kpi-progress-line"><div className="fill" style={{ width: '70%' }}></div></div>
          </div>
        ))}
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <div className="dashboard-main-grid">
        
        {/* LEFT COLUMN */}
        <div className="dashboard-column-left">
          
          {/* Today's Schedule */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Today's Schedule</h2>
              <button className="text-btn" onClick={() => navigate('/trainer-dashboard/schedule')}>View full schedule</button>
            </div>
            <div className="schedule-list">
              {schedule.map((session, idx) => (
                <LiveSessionCard key={idx} session={session} />
              ))}
            </div>
          </section>

          {/* Pending Actions */}
          <section className="dashboard-section">
            <h2 className="section-title">Pending Actions</h2>
            <div className="pending-actions-grid">
              <div className="pending-card blue">
                <div className="pending-icon"><UserCheck size={20} /></div>
                <div className="pending-info">
                  <h4>Mark Attendance</h4>
                  <p>Batch B12 session ended</p>
                </div>
                <button className="cta-link"><ArrowUpRight size={18} /></button>
              </div>
              <div className="pending-card green">
                <div className="pending-icon"><Upload size={20} /></div>
                <div className="pending-info">
                  <h4>Upload Materials</h4>
                  <p>Python Module 4 pending</p>
                </div>
                <button className="cta-link"><ArrowUpRight size={18} /></button>
              </div>
              <div className="pending-card purple">
                <div className="pending-icon"><MessageSquare size={20} /></div>
                <div className="pending-info">
                  <h4>Respond to Queries</h4>
                  <p>3 new student messages</p>
                </div>
                <button className="cta-link"><ArrowUpRight size={18} /></button>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="dashboard-column-right">
          
          {/* Quick Actions */}
          <section className="dashboard-section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="quick-actions-blocks">
              <button className="qa-block" onClick={() => navigate('/trainer-dashboard/live-session')}>
                <Play size={20} />
                <span>Start Class</span>
              </button>
              <button className="qa-block" onClick={() => navigate('/trainer-dashboard/materials')}>
                <FileText size={20} />
                <span>Upload Material</span>
              </button>
              <button className="qa-block" onClick={() => navigate('/trainer-dashboard/attendance')}>
                <UserCheck size={20} />
                <span>Mark Attendance</span>
              </button>
            </div>
          </section>

          {/* Batch Progress */}
          <section className="dashboard-section">
            <div className="section-header">
              <h2 className="section-title">Batch Progress</h2>
              <button className="icon-btn-ghost"><MoreVertical size={18} /></button>
            </div>
            <div className="batch-progress-list">
              {[
                { name: 'Batch B12', pct: '75%', color: '#3B82F6' },
                { name: 'Batch C09', pct: '60%', color: '#10B981' },
                { name: 'Batch A05', pct: '90%', color: '#8B5CF6' }
              ].map((batch, idx) => (
                <div key={idx} className="batch-progress-item">
                  <div className="batch-info-min">
                    <span className="batch-name-min">{batch.name}</span>
                    <span className="batch-pct-min">{batch.pct}</span>
                  </div>
                  <div className="progress-bar-min">
                    <div className="progress-fill-min" style={{ width: batch.pct, backgroundColor: batch.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Activity */}
          <section className="dashboard-section">
            <h2 className="section-title">Recent Activity</h2>
            <div className="activity-timeline">
              {activities.map((act, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p className="act-msg">{act.msg}</p>
                    <span className="act-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
