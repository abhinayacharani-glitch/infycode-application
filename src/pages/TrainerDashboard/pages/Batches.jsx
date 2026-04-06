import React, { useState } from 'react';

const Batches = () => {
  const [activeTab, setActiveTab] = useState('all');

  const batches = [
    { id: 'B12', course: 'Full Stack Development', students: 32, start: 'Jan 10', end: 'Apr 10', mode: 'Online', progress: 75, status: 'active', color: 'var(--blue-500)', icon: '💻' },
    { id: 'C09', course: 'Python & Data Science', students: 28, start: 'Feb 01', end: 'May 01', mode: 'Offline', progress: 60, status: 'active', color: 'var(--green)', icon: '🐍' },
    { id: 'A05', course: 'UI/UX Design Basics', students: 24, start: 'Dec 15', end: 'Mar 25', mode: 'Online', progress: 90, status: 'active', color: 'var(--purple)', icon: '🎨' },
    { id: 'D02', course: 'DevOps Fundamentals', students: 20, start: 'Mar 15', end: 'Jun 15', mode: 'Online', progress: 30, status: 'new', color: 'var(--amber)', icon: '⚙️' },
  ];

  const filtered = activeTab === 'all' ? batches : batches.filter(b => b.status === activeTab);

  return (
    <div className="page active" id="page-batches">

      {/* KPI GRID – 4 columns like dashboard */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card blue">
          <div className="kpi-top">
            <div className="kpi-icon blue">📚</div>
            <span className="kpi-trend up">Active</span>
          </div>
          <div className="kpi-val">4</div>
          <div className="kpi-label">Total Batches</div>
          <div className="kpi-bar"><div className="kpi-bar-fill blue" style={{ width: '100%' }}></div></div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top">
            <div className="kpi-icon green">👥</div>
            <span className="kpi-trend up">↑ 4</span>
          </div>
          <div className="kpi-val">128</div>
          <div className="kpi-label">Total Students</div>
          <div className="kpi-bar"><div className="kpi-bar-fill green" style={{ width: '85%' }}></div></div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-top">
            <div className="kpi-icon amber">🗓️</div>
            <span className="kpi-trend up">Today</span>
          </div>
          <div className="kpi-val">3</div>
          <div className="kpi-label">Sessions Today</div>
          <div className="kpi-bar"><div className="kpi-bar-fill amber" style={{ width: '75%' }}></div></div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top">
            <div className="kpi-icon purple">📋</div>
            <span className="kpi-trend up">↑ 2%</span>
          </div>
          <div className="kpi-val">89%</div>
          <div className="kpi-label">Avg Attendance</div>
          <div className="kpi-bar"><div className="kpi-bar-fill purple" style={{ width: '89%' }}></div></div>
        </div>
      </div>

      {/* BATCH CARDS – 4-column overview */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        {batches.map(b => (
          <div key={b.id} className="card" style={{ border: `1.5px solid ${b.color}22`, cursor: 'pointer', transition: 'all .25s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div className="card-body" style={{ padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{b.icon}</div>
                <span className={`badge ${b.status === 'active' ? 'active-b' : 'upcoming'}`}>{b.status === 'active' ? 'Active' : 'New'}</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '4px' }}>{b.id} – {b.course}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>{b.students} students · {b.mode}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span>{b.start} → {b.end}</span>
                <span style={{ fontWeight: '700', color: b.color }}>{b.progress}%</span>
              </div>
              <div className="prog-bar"><div className="prog-fill" style={{ width: `${b.progress}%`, background: b.color }}></div></div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL-WIDTH BATCH TABLE */}
      <div className="card" style={{ width: '100%' }}>
        <div className="card-header">
          <div>
            <div className="card-title">📖 All Batches</div>
            <div className="card-sub">Complete batch management overview</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'active', 'new'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{ padding: '6px 14px', borderRadius: '8px', border: `1.5px solid ${activeTab === tab ? 'var(--blue-500)' : 'var(--border)'}`, background: activeTab === tab ? 'var(--blue-50)' : 'transparent', color: activeTab === tab ? 'var(--blue-600)' : 'var(--text-muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif', textTransform: 'capitalize' }}>
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="batch-table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th style={{ padding: '14px 18px' }}>Batch ID</th>
                <th>Course</th>
                <th>Students</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Mode</th>
                <th>Progress</th>
                <th>Avg Attendance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ paddingLeft: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{b.icon}</span>
                      <b style={{ color: 'var(--blue-600)' }}>{b.id}</b>
                    </div>
                  </td>
                  <td><span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>{b.course}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px' }}>👥</span>
                      <span>{b.students}</span>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: '"Urbanist", sans-serif', fontSize: '12px' }}>{b.start}</span></td>
                  <td><span style={{ fontFamily: '"Urbanist", sans-serif', fontSize: '12px' }}>{b.end}</span></td>
                  <td><span className={`sch-mode ${b.mode.toLowerCase()}`} style={{ margin: 0 }}>{b.mode}</span></td>
                  <td style={{ minWidth: '130px' }}>
                    <div className="progress-wrap">
                      <div className="prog-bar"><div className="prog-fill" style={{ width: `${b.progress}%` }}></div></div>
                      <span className="prog-pct">{b.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--blue-600)', fontSize: '13px' }}>
                        {b.id === 'B12' ? '92%' : b.id === 'C09' ? '86%' : b.id === 'A05' ? '91%' : '78%'}
                      </span>
                    </div>
                  </td>
                  <td><span className={`badge ${b.status === 'active' ? 'active-b' : 'upcoming'}`}>{b.status === 'active' ? 'Active' : 'New'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={{ padding: '4px 10px', borderRadius: '6px', border: '1.5px solid var(--blue-200)', background: 'var(--blue-50)', color: 'var(--blue-600)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif' }}>View</button>
                      <button style={{ padding: '4px 10px', borderRadius: '6px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif' }}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Batches;
