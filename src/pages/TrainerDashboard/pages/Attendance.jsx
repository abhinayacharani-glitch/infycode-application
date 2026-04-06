import React, { useState } from 'react';

const Attendance = () => {
  const [students, setStudents] = useState([
    { n: 'Priya Sharma', present: true, roll: 'BS001' },
    { n: 'Arjun Kumar', present: true, roll: 'BS002' },
    { n: 'Nisha Reddy', present: false, roll: 'BS003' },
    { n: 'Rahul Mehta', present: true, roll: 'BS004' },
    { n: 'Sneha Patel', present: true, roll: 'BS005' },
    { n: 'Vikram Singh', present: true, roll: 'BS006' },
    { n: 'Ananya Iyer', present: true, roll: 'BS007' },
    { n: 'Rohan Das', present: false, roll: 'BS008' },
  ]);

  const handleStudentChange = (index) => {
    const newStudents = [...students];
    newStudents[index].present = !newStudents[index].present;
    setStudents(newStudents);
  };

  const types = ['empty', 'empty', 'present', 'present', 'present', 'present', 'present',
    'present', 'present', 'holiday', 'present', 'present', 'present', 'present',
    'absent', 'present', 'present', 'today', 'present', 'present', 'present',
    'present', 'present', 'present', 'present', 'present', 'present', 'present',
    'present', 'present', 'present'];

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;
  const pct = Math.round((presentCount / students.length) * 100);

  const batchStats = [
    { id: 'B12', name: 'Full Stack Development', today: '09:00 AM', present: 29, total: 32, pct: 91, color: 'var(--blue-500)' },
    { id: 'C09', name: 'Python & Data Science', today: '12:00 PM', present: 24, total: 28, pct: 86, color: 'var(--green)' },
    { id: 'A05', name: 'UI/UX Design Basics', today: '03:30 PM', present: 22, total: 24, pct: 92, color: 'var(--purple)' },
    { id: 'D02', name: 'DevOps Fundamentals', today: '06:00 PM', present: 16, total: 20, pct: 80, color: 'var(--amber)' },
  ];

  return (
    <div className="page active" id="page-attendance">

      {/* KPI Row */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card blue">
          <div className="kpi-top"><div className="kpi-icon blue">👥</div><span className="kpi-trend up">Today</span></div>
          <div className="kpi-val">91</div>
          <div className="kpi-label">Present Students</div>
          <div className="kpi-bar"><div className="kpi-bar-fill blue" style={{ width: '91%' }}></div></div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top"><div className="kpi-icon green">📈</div><span className="kpi-trend up">↑ 2%</span></div>
          <div className="kpi-val">89%</div>
          <div className="kpi-label">Avg Attendance Rate</div>
          <div className="kpi-bar"><div className="kpi-bar-fill green" style={{ width: '89%' }}></div></div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-top"><div className="kpi-icon amber">⚠️</div><span className="kpi-trend down">↓ Low</span></div>
          <div className="kpi-val">12</div>
          <div className="kpi-label">Below 75% Attendance</div>
          <div className="kpi-bar"><div className="kpi-bar-fill amber" style={{ width: '12%' }}></div></div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top"><div className="kpi-icon purple">🏖️</div><span className="kpi-trend up">Month</span></div>
          <div className="kpi-val">15</div>
          <div className="kpi-label">Days Present (Mar)</div>
          <div className="kpi-bar"><div className="kpi-bar-fill purple" style={{ width: '75%' }}></div></div>
        </div>
      </div>

      {/* 3-col layout: Calendar | Batch Overview | Mark Attendance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>

        {/* Attendance Calendar */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🗓️ March 2026 – Record</div>
              <div className="card-sub">Your session attendance</div>
            </div>
          </div>
          <div className="card-body">
            <div className="att-legend">
              <div className="att-leg"><div className="att-dot" style={{ background: 'var(--blue-50)', border: '1px solid var(--blue-400)' }}></div>Present</div>
              <div className="att-leg"><div className="att-dot" style={{ background: 'var(--blue-100)', border: '1px solid var(--blue-300)' }}></div>Absent</div>
              <div className="att-leg"><div className="att-dot" style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)' }}></div>Holiday</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '6px' }}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                <div key={`${d}-${idx}`} style={{ textAlign: 'center', fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>{d}</div>
              ))}
            </div>
            <div className="att-grid">
              {types.map((t, i) => (
                <div
                  key={i}
                  className={`att-day${t === 'today' ? ' present today' : t === 'empty' ? ' empty' : ' ' + t}`}
                  title={t !== 'empty' ? t : ''}
                >
                  {t === 'empty' ? '' : i - 1}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <div style={{ flex: 1, padding: '12px', background: 'var(--blue-50)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--blue-500)' }}>15</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Present</div>
              </div>
              <div style={{ flex: 1, padding: '12px', background: 'var(--blue-100)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--blue-400)' }}>1</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Absent</div>
              </div>
              <div style={{ flex: 1, padding: '12px', background: 'var(--accent-light)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent)' }}>2</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Holidays</div>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Attendance Overview */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📊 Batch Overview</div>
              <div className="card-sub">Today's attendance per batch</div>
            </div>
          </div>
          <div className="card-body">
            {batchStats.map((b, i) => (
              <div key={i} style={{ marginBottom: i < batchStats.length - 1 ? '20px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: b.color, fontSize: '13px' }}>{b.id}</span>
                    <span style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '13px' }}> – {b.name}</span>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: b.color }}>{b.pct}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="prog-bar" style={{ flex: 1 }}>
                    <div className="prog-fill" style={{ width: `${b.pct}%`, background: b.color }}></div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{b.present}/{b.total} students</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Session at {b.today}</div>
              </div>
            ))}
            {/* Monthly trend summary */}
            <div style={{ marginTop: '20px', padding: '14px', background: 'var(--blue-50)', borderRadius: '12px', border: '1px solid var(--blue-100)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>📅 Monthly Trend</div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '40px' }}>
                {[72, 80, 88, 85, 91, 89, 93, 87, 90, 92].map((v, i) => (
                  <div key={i} style={{ flex: 1, background: i === 9 ? 'var(--blue-500)' : 'var(--blue-200)', borderRadius: '4px 4px 0 0', height: `${(v / 100) * 40}px`, transition: 'all .3s' }} title={`${v}%`}></div>
                ))}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right' }}>Last 10 sessions</div>
            </div>
          </div>
        </div>

        {/* Mark Attendance */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📋 Mark Attendance</div>
              <div className="card-sub">For today's session</div>
            </div>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '6px' }}>Select Batch</div>
              <select style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: '"Urbanist", sans-serif', fontSize: '13px', color: 'var(--text-dark)', background: 'var(--white)', cursor: 'pointer' }}>
                <option>Batch B12 – Full Stack Dev (09:00 AM)</option>
                <option>Batch C09 – Python & DS (12:00 PM)</option>
                <option>Batch A05 – UI/UX (03:30 PM)</option>
                <option>Batch D02 – DevOps (06:00 PM)</option>
              </select>
            </div>
            {/* Quick stats */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <div style={{ flex: 1, padding: '10px', background: 'var(--blue-50)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--blue-500)' }}>{presentCount}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Present</div>
              </div>
              <div style={{ flex: 1, padding: '10px', background: 'var(--blue-100)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--blue-400)' }}>{absentCount}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Absent</div>
              </div>
              <div style={{ flex: 1, padding: '10px', background: 'var(--green-light)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--green)' }}>{pct}%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Rate</div>
              </div>
            </div>
            <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
              <table className="batch-table">
                <thead><tr><th>Roll</th><th>Student</th><th>Status</th></tr></thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: '"Urbanist", sans-serif', fontSize: '11px', color: 'var(--text-muted)' }}>{s.roll}</td>
                      <td>{s.n}</td>
                      <td>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={s.present}
                            onChange={() => handleStudentChange(i)}
                            style={{ accentColor: 'var(--blue-500)', width: '16px', height: '16px' }}
                          />
                          <span style={{ fontSize: '12px', color: s.present ? 'var(--blue-500)' : 'var(--blue-300)', fontWeight: '600' }}>
                            {s.present ? 'Present' : 'Absent'}
                          </span>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button style={{ width: '100%', marginTop: '14px', padding: '12px', background: 'linear-gradient(135deg,var(--blue-500),var(--blue-600))', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif' }}>💾 Submit Attendance</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
