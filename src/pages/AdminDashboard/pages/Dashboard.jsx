import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

/* ─── Animated counter ──────────────────────────────────────── */
const Counter = ({ target, isDecimal = false }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let s = 0;
    const dur = 1000;
    const step = 16;
    const inc = target / (dur / step);
    const t = setInterval(() => {
      s += inc;
      if (s >= target) { s = target; clearInterval(t); }
      setCount(s);
    }, step);
    return () => clearInterval(t);
  }, [target]);
  return <span>{isDecimal ? count.toFixed(1) : Math.floor(count)}</span>;
};

/* ─── Mock student dataset with dates spread across 30 days ── */
// Mock student dataset removed. Component now uses real students from AdminContext.

/* ─── Chart data generators ─────────────────────────────────── */
const buildChartData = (students, dateFilter) => {
  const today = new Date(); // Use actual today

  if (dateFilter === 'Today') {
    const hours = ['8am','10am','12pm','2pm','4pm','6pm','8pm'];
    const baseData = [2, 5, 8, 4, 6, 3, 1];
    return hours.map((h, i) => ({ name: h, students: baseData[i] }));
  }

  if (dateFilter === 'Last 7 Days') {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
      const dateStr = d.toISOString().split('T')[0];
      const count = students.filter(s => (s.createdAt || '').split('T')[0] === dateStr).length;
      days.push({ name: label, students: count });
    }
    return days;
  }

  if (dateFilter === 'Last 30 Days') {
    const weeks = [];
    for (let w = 4; w >= 1; w--) {
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - w * 7);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() - (w - 1) * 7);
      const count = students.filter(s => {
        const d = new Date(s.createdAt || '');
        return !isNaN(d) && d >= startDate && d < endDate;
      }).length;
      weeks.push({
        name: `Week ${5 - w}`,
        students: count,
      });
    }
    return weeks;
  }

  return [];
};

/* ─── Filter students by date window ────────────────────────── */
const filterByDate = (students, dateFilter) => {
  const today = new Date(); // Use actual today
  if (dateFilter === 'Today') {
    const todayStr = today.toISOString().split('T')[0];
    return students.filter(s => (s.createdAt || '').split('T')[0] === todayStr);
  }
  if (dateFilter === 'Last 7 Days') {
    const cutoff = new Date(today); cutoff.setDate(today.getDate() - 7);
    return students.filter(s => {
      const d = new Date(s.createdAt || '');
      return !isNaN(d) && d >= cutoff;
    });
  }
  if (dateFilter === 'Last 30 Days') {
    const cutoff = new Date(today); cutoff.setDate(today.getDate() - 30);
    return students.filter(s => {
      const d = new Date(s.createdAt || '');
      return !isNaN(d) && d >= cutoff;
    });
  }
  return students;
};

/* ─── Main component ─────────────────────────────────────────── */
const Dashboard = () => {
  const { stats, students, notifications, courses, batches, trainers } = useAdmin();
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = loggedUser.fullName || loggedUser.username || "Admin";
  const navigate = useNavigate();

  const [filter, setFilter] = useState({ course: 'All', date: 'Last 7 Days' });
  const [animKey, setAnimKey] = useState(0);

  // Re-trigger counter animation when filter changes
  const handleFilterChange = (key, value) => {
    setFilter(prev => ({ ...prev, [key]: value }));
    setAnimKey(k => k + 1);
  };

  // Live dataset from AdminContext
  const allStudents = students;

  // Apply filters
  const filteredStudents = useMemo(() => {
    let result = allStudents;
    if (filter.course !== 'All') {
      result = result.filter(s => s.course === filter.course);
    }
    result = filterByDate(result, filter.date);
    return result;
  }, [allStudents, filter]);

  // Derived KPIs
  const kpiData = useMemo(() => {
    const total = allStudents.length; // Always show absolute total as requested
    const pending = filteredStudents.filter(s => s.status === 'Pending').length;
    const verified = filteredStudents.filter(s => s.status === 'Verified' || s.status === 'Assigned').length;
    // Derive active batches from filtered course
    const activeBatches = filter.course === 'All'
      ? stats.activeBatches
      : batches?.filter(b => b.course === filter.course && b.status !== 'Completed').length ?? 0;

    // Placement rate scales with date range
    const placementBase = filter.date === 'Today' ? 78 : filter.date === 'Last 7 Days' ? 82 : 91;

    // date-range label for display
    const dateLabel = filter.date === 'Today' ? 'today' :
                      filter.date === 'Last 7 Days' ? 'last 7 days' : 'last 30 days';

    return { total, pending, verified, activeBatches, placementRate: placementBase, dateLabel };
  }, [allStudents, filteredStudents, filter, stats, batches]);

  const chartData = useMemo(() => buildChartData(
    filter.course === 'All' ? allStudents : allStudents.filter(s => s.course === filter.course),
    filter.date
  ), [allStudents, filter]);

  const chartTitle = filter.date === 'Today'
    ? '📈 Hourly Registrations (Today)'
    : filter.date === 'Last 7 Days'
    ? '📈 Daily Registrations (Last 7 Days)'
    : '📈 Weekly Registrations (Last 30 Days)';

  const chartSub = filter.course === 'All'
    ? `All courses · ${filter.date}`
    : `${filter.course} · ${filter.date}`;

  return (
    <div className="page active" id="page-dashboard">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back, {userName}! ⚙️</h2>
          <p>
            Showing data for <strong>{filter.course === 'All' ? 'all courses' : filter.course}</strong> ·{' '}
            <strong>{kpiData.total}</strong> registrations in the {kpiData.dateLabel}
          </p>
        </div>
        <div className="welcome-stats">
          <div className="w-stat">
            <div className="w-stat-num"><Counter key={`total-${animKey}`} target={kpiData.total} /></div>
            <div className="w-stat-label">Total Students</div>
          </div>
          <div className="w-divider"></div>
          <div className="w-stat">
            <div className="w-stat-num"><Counter key={`trainers-${animKey}`} target={stats.trainers.active} /></div>
            <div className="w-stat-label">Active Trainers</div>
          </div>
          <div className="w-divider"></div>
          <div className="w-stat">
            <div className="w-stat-num"><Counter key={`batches-${animKey}`} target={kpiData.activeBatches} /></div>
            <div className="w-stat-label">Live Batches</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="dashboard-filters" style={{ display: 'flex', gap: '12px', marginBottom: '24px', justifyContent: 'flex-end', alignItems: 'center' }}>
        {/* Active filter badge */}
        {(filter.course !== 'All' || filter.date !== 'Last 7 Days') && (
          <span
            className="badge active-b"
            style={{ fontSize: '11px', cursor: 'pointer' }}
            onClick={() => { setFilter({ course: 'All', date: 'Last 7 Days' }); setAnimKey(k => k + 1); }}
          >
            ✕ Reset Filters
          </span>
        )}
        <div className="filter-container-premium">
          <select
            value={filter.course}
            onChange={(e) => handleFilterChange('course', e.target.value)}
            className="filter-select-premium"
          >
            <option value="All">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <select
            value={filter.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="filter-select-premium"
          >
            <option value="Today">Today</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card blue">
          <div className="kpi-top">
            <div className="kpi-icon blue">👤</div>
            <span className="kpi-trend up">↑ {filter.date === 'Last 30 Days' ? '14%' : '8%'}</span>
          </div>
          <div className="kpi-val"><Counter key={`kpi-total-${animKey}`} target={kpiData.total} /></div>
          <div className="kpi-label">Total Registrations</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill blue" style={{ width: `${Math.min(100, (kpiData.total / 20) * 100)}%` }}></div>
          </div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top">
            <div className="kpi-icon purple">👨‍🏫</div>
            <span className="kpi-trend up">↑ 5%</span>
          </div>
          <div className="kpi-val"><Counter key={`kpi-trainers-${animKey}`} target={stats.trainers.active} /></div>
          <div className="kpi-label">Active Trainers</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill" style={{ width: `${Math.min(100, (stats.trainers.active / 10) * 100)}%`, background: 'linear-gradient(90deg,#93c5fd,var(--purple))' }}></div>
          </div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top">
            <div className="kpi-icon green">🏫</div>
            <span className="kpi-trend up">↑ 12%</span>
          </div>
          <div className="kpi-val"><Counter key={`kpi-batches-${animKey}`} target={kpiData.activeBatches} /></div>
          <div className="kpi-label">Active Batches</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill green" style={{ width: '70%' }}></div>
          </div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-top">
            <div className="kpi-icon amber">⏳</div>
            <span className="kpi-trend down">↓ 2%</span>
          </div>
          <div className="kpi-val"><Counter key={`kpi-pending-${animKey}`} target={kpiData.pending} /></div>
          <div className="kpi-label">Pending Verifications</div>
          <div className="kpi-bar">
            <div className="kpi-bar-fill amber" style={{ width: `${kpiData.total > 0 ? Math.min(100, (kpiData.pending / kpiData.total) * 100) : 0}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {/* Recent Registrations — filtered */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🆕 Recent Registrations</div>
              <div className="card-sub">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} · {filter.date}
              </div>
            </div>
            <button className="btn-secondary btn-small" onClick={() => navigate('/admin-dashboard/student-verification')}>View All</button>
          </div>
          <div className="card-body">
            {filteredStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                No registrations found for the selected filters.
              </div>
            ) : (
              filteredStudents.slice(0, 5).map(student => (
                <div className="schedule-item" key={student.id}>
                  <div className="sch-time">{student.date}</div>
                  <div className="sch-dot" style={{ background: student.status === 'Pending' ? 'var(--amber)' : 'var(--green)' }}></div>
                  <div className="sch-info">
                    <div className="sch-course">{student.name}</div>
                    <div className="sch-batch">{student.course}</div>
                    <span className={`sch-mode ${student.status === 'Pending' ? 'offline' : 'online'}`}>{student.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions + Notifications */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div className="card-header"><div className="card-title">⚡ Quick Actions</div></div>
            <div className="card-body">
              <div className="qa-grid">
                <div className="qa-btn" onClick={() => navigate('/admin-dashboard/student-verification')}>
                  <span>✅</span><span>Verify Students</span>
                </div>
                <div className="qa-btn" onClick={() => navigate('/admin-dashboard/course-config')}>
                  <span>📚</span><span>Add Course</span>
                </div>
                <div className="qa-btn" onClick={() => navigate('/admin-dashboard/batch-setup')}>
                  <span>📅</span><span>New Batch</span>
                </div>
                <div className="qa-btn" onClick={() => navigate('/admin-dashboard/reports')}>
                  <span>📉</span><span>Export Report</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

      <div className="grid-2">
        {/* Pipeline overview — filtered */}
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">⏳ Pipeline Overview</div><div className="card-sub">Items requiring admin attention</div></div>
            <button className="btn-secondary btn-small">View All</button>
          </div>
          <div className="card-body" style={{ paddingTop: '8px' }}>
            <table className="batch-table">
              <thead><tr><th>Type</th><th>Identifier</th><th>Status</th><th>Submitted</th></tr></thead>
              <tbody>
                {filteredStudents.filter(s => s.status === 'Pending').slice(0, 5).length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                    No pending items for current filters.
                  </td></tr>
                ) : (
                  filteredStudents.filter(s => s.status === 'Pending').slice(0, 5).map(s => (
                    <tr key={s.id}>
                      <td><b>Student Rev.</b></td>
                      <td>{s.name}</td>
                      <td><span className="badge upcoming">Pending</span></td>
                      <td>{s.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">{chartTitle}</div>
                <div className="card-sub">{chartSub}</div>
              </div>
            </div>
            <div className="card-body" style={{ height: '250px', padding: '20px' }}>
              <ResponsiveContainer width="100%" height="100%">
                {filter.date === 'Last 30 Days' ? (
                  <LineChart key={`line-${animKey}`} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="var(--blue-500)"
                      strokeWidth={2.5}
                      dot={{ r: 5, fill: 'var(--blue-500)', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                ) : (
                  <BarChart key={`bar-${animKey}`} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f5f5f5' }} />
                    <Bar dataKey="students" fill="var(--blue-500)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
