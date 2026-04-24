import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Layers,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Play,
  Upload,
  UserCheck,
  MessageSquare,
  FileText,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import LiveSessionCard from '../components/LiveSessionCard';
import './Dashboard.css';

// --- MOCK API LAYER ---
const fetchDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        attendance: {
          batch: "Batch B12",
          present: 24,
          total: 32,
          lastMarked: "10:30 AM",
          percentage: 75
        },
        materials: {
          moduleName: "Python: Module 4 - Advanced Data structures",
          uploaded: ["Lecture Notes", "Assignment PDF", "Quiz Link"],
          pending: ["Video Tutorial", "Reference Guide"]
        },
        queries: {
          count: 3,
          latestMessage: "Could you please explain the difference between for-in and for-of loops in detail?",
          students: [
            { initials: "RK", color: "#6366F1", bg: "#EEF2FF" },
            { initials: "AM", color: "#10B981", bg: "#ECFDF5" },
            { initials: "VK", color: "#F59E0B", bg: "#FFFBEB" },
          ],
          totalAvatars: 5
        }
      });
    }, 1500);
  });
};

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

const SkeletonCard = () => (
  <div className="modern-card skeleton-pulse">
    <div className="card-main-content">
      <div className="skeleton-icon"></div>
      <div className="card-details">
        <div className="skeleton-line title"></div>
        <div className="skeleton-line sub"></div>
        <div className="skeleton-line progress"></div>
      </div>
    </div>
    <div className="skeleton-btn"></div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dashData, setDashData] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("loggedUser") || "{}");
  const userName = loggedUser.fullName || loggedUser.fullname || loggedUser.username || "Trainer";

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchDashboardData();
      setDashData(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const kpis = [
    { label: 'Active Batches', value: 4, trend: '+5%', icon: <Layers size={22} />, color: 'blue' },
    { label: 'Total Students', value: 128, trend: '+12%', icon: <Users size={22} />, color: 'green' },
    { label: 'Sessions Today', value: 3, trend: 'On track', icon: <Calendar size={22} />, color: 'amber' },
    { label: 'Avg Attendance', value: 92, trend: '+3%', icon: <CheckCircle size={22} />, color: 'purple', suffix: '%' }
  ];

  const [schedule, setSchedule] = useState([
    { id: 1, time: '09:00 AM', course: 'Full Stack Development', batch: 'B1', students: 32, duration: '2h', mode: 'Online', status: 'Completed' },
    { id: 2, time: '12:00 PM', course: 'Python & Data Science', batch: 'B2', students: 28, duration: '1.5h', mode: 'Offline', status: 'In Progress', active: true },
    { id: 3, time: '03:30 PM', course: 'UI/UX Design Basics', batch: 'B3', students: 24, duration: '2h', mode: 'Online', status: 'Upcoming' },
  ]);

  return (
    <div className="dashboard-container-v2 animate-fade-in">
      {/* Welcome Banner — Restored with identical design */}
      <div className="dashboard-banner">
        <div className="banner-content">
          <div className="banner-left">
            <h1>Welcome Back, {userName}!</h1>
            <p>Here’s what’s happening with your batches today.</p>
          </div>
          <div className="banner-right">
            <div className="banner-stat-item">
              <span className="banner-stat-value"><Counter target={128} /></span>
              <span className="banner-stat-label">Total Students</span>
            </div>
            <div className="banner-divider"></div>
            <div className="banner-stat-item">
              <span className="banner-stat-value"><Counter target={4} /></span>
              <span className="banner-stat-label">Active Batches</span>
            </div>
            <div className="banner-divider"></div>
            <div className="banner-stat-item">
              <span className="banner-stat-value"><Counter target={3} /></span>
              <span className="banner-stat-label">Live Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="dashboard-kpi-row-v2">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`kpi-card-v2`}>
            <div className={`kpi-icon-v2 ${kpi.color}`}>{kpi.icon}</div>
            <div className="kpi-info-v2">
              <span className="kpi-label-v2">{kpi.label}</span>
              <h3 className="kpi-value-v2">
                <Counter target={kpi.value} />{kpi.suffix}
              </h3>
              <span className={`kpi-trend-v2 ${kpi.trend.startsWith('+') ? 'pos' : ''}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="dashboard-main-content-v2">

        {/* TOP SECTION: Today's Class */}
        <section className="dashboard-section-v2">
          <div className="section-header-v2">
            <h2 className="section-title-v2">Today's Live Sessions</h2>
            <button className="text-btn-v2" onClick={() => navigate('/trainer-dashboard/schedule')}>
              View Full Schedule <ChevronRight size={14} style={{ marginLeft: '4px' }} />
            </button>
          </div>
          <div className="schedule-list-v2">
            {schedule.map((session, idx) => (
              <LiveSessionCard key={idx} session={session} />
            ))}
          </div>
        </section>

        {/* PENDING ACTIONS GRID */}
        <section className="dashboard-section-v2">
          <div className="section-header-v2">
            <h2 className="section-title-v2">Pending Actions</h2>
          </div>
          <div className="pending-actions-grid-v2">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : dashData ? (
              <>
                {/* 1. Attendance Card */}
                <div className="modern-card attendance-card-v2 clickable" onClick={() => navigate('/trainer-dashboard/attendance')}>
                  <div className="card-main-content">
                    <span className="batch-tag">{dashData.attendance.batch}</span>
                    <div className="card-icon-wrapper">
                      <UserCheck size={26} />
                    </div>
                    <div className="card-details">
                      <h4>Mark Attendance</h4>
                      <div className="attendance-stats">
                        <span className="stats-main">{dashData.attendance.present}/{dashData.attendance.total}</span>
                        <span className="stats-label">Present</span>
                      </div>
                      <div className="modern-progress-container">
                        <div className="modern-progress-bar" style={{ width: `${dashData.attendance.percentage}%` }}></div>
                      </div>
                      <div className="card-footer-info">
                        <Clock size={14} /> Last marked: {dashData.attendance.lastMarked}
                      </div>
                    </div>
                    <button className="modern-card-cta primary">
                      Complete Now <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* 2. Materials Card */}
                <div className="modern-card materials-card-v2 clickable" onClick={() => navigate('/trainer-dashboard/materials')}>
                  <div className="card-main-content">
                    <div className="card-icon-wrapper">
                      <Upload size={26} />
                    </div>
                    <div className="card-details">
                      <h4>Upload Materials</h4>
                      <p className="module-name">{dashData.materials.moduleName}</p>
                      <div className="upload-items">
                        {dashData.materials.uploaded.map((item, i) => (
                          <span key={i} className="upload-item"><div className="dot"></div> {item}</span>
                        ))}
                        {dashData.materials.pending.map((item, i) => (
                          <span key={i} className="upload-item pending"><div className="dot grey"></div> {item} (Pending)</span>
                        ))}
                      </div>
                    </div>
                    <button className="modern-card-cta secondary">
                      Upload Files <Upload size={16} />
                    </button>
                  </div>
                </div>

                {/* 3. Queries Card */}
                <div className="modern-card queries-card-v2 clickable" onClick={() => navigate('/trainer-dashboard/feedback')}>
                  <div className="card-main-content">
                    <span className="query-count">{dashData.queries.count} New Messages</span>
                    <div className="card-icon-wrapper">
                      <MessageSquare size={26} />
                    </div>
                    <div className="card-details">
                      <h4>Respond to Queries</h4>
                      <p className="message-preview">"{dashData.queries.latestMessage}"</p>
                      <div className="student-avatars">
                        <div className="avatar-stack">
                          {dashData.queries.students.map((st, i) => (
                            <div key={i} className="avatar" style={{ backgroundColor: st.bg, color: st.color }}>{st.initials}</div>
                          ))}
                          <div className="avatar-more">+{dashData.queries.totalAvatars - dashData.queries.students.length}</div>
                        </div>
                        <p className="avatar-text">Students are waiting</p>
                      </div>
                    </div>
                    <button className="modern-card-cta accent">
                      Open Chat <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state-v2">
                <AlertCircle size={48} />
                <p>No pending actions available right now.</p>
              </div>
            )}
          </div>
        </section>

        {/* QUICK INSIGHTS ROW */}
        <section className="dashboard-section-v2">
          <div className="section-header-v2">
            <h2 className="section-title-v2">Quick Insights</h2>
          </div>
          <div className="quick-actions-row-v2">
            <button className="qa-pill" onClick={() => navigate('/trainer-dashboard/live-session')}>
              <Play size={18} /> Start New Class
            </button>
            <button className="qa-pill" onClick={() => navigate('/trainer-dashboard/batches')}>
              <TrendingUp size={18} /> Batch Progress
            </button>
            <button className="qa-pill" onClick={() => navigate('/trainer-dashboard/attendance')}>
              <FileText size={18} /> Attendance Report
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
