import React, { useState } from 'react';

const Materials = () => {
  const [uploadHover, setUploadHover] = useState(false);

  const materials = [
    { icon: '📄', title: 'Full Stack – Module 1 Notes', batch: 'B12', type: 'PDF Document', size: '2.4 MB', date: 'Mar 10', color: 'var(--blue-500)', bg: 'var(--blue-50)' },
    { icon: '🎥', title: 'React Hooks – Video Lecture', batch: 'B12', type: 'MP4 Video', size: '124 MB', date: 'Mar 12', color: 'var(--purple)', bg: 'var(--purple-light)' },
    { icon: '📊', title: 'Python ML – Slides Deck', batch: 'C09', type: 'PPTX Presentation', size: '8.1 MB', date: 'Mar 08', color: 'var(--green)', bg: 'var(--green-light)' },
    { icon: '💻', title: 'DevOps Lab Exercise Files', batch: 'D02', type: 'ZIP Archive', size: '15 MB', date: 'Mar 15', color: 'var(--amber)', bg: 'var(--amber-light)' },
    { icon: '🎨', title: 'UI/UX Figma Templates', batch: 'A05', type: 'Figma Link', size: 'Online', date: 'Mar 05', color: 'var(--purple)', bg: 'var(--purple-light)' },
    { icon: '📝', title: 'Assignment Sheet – Week 8', batch: 'All', type: 'DOCX Document', size: '340 KB', date: 'Mar 18', color: 'var(--blue-500)', bg: 'var(--blue-50)' },
    { icon: '🎥', title: 'Python – Pandas Tutorial', batch: 'C09', type: 'MP4 Video', size: '87 MB', date: 'Mar 14', color: 'var(--green)', bg: 'var(--green-light)' },
    { icon: '📄', title: 'DevOps – Kubernetes Cheatsheet', batch: 'D02', type: 'PDF Document', size: '1.2 MB', date: 'Mar 16', color: 'var(--amber)', bg: 'var(--amber-light)' },
    { icon: '📊', title: 'Full Stack – System Design Slides', batch: 'B12', type: 'PPTX Presentation', size: '5.6 MB', date: 'Mar 17', color: 'var(--blue-500)', bg: 'var(--blue-50)' },
    { icon: '💻', title: 'UI/UX – Wireframing Exercise', batch: 'A05', type: 'PDF Document', size: '3.1 MB', date: 'Mar 19', color: 'var(--purple)', bg: 'var(--purple-light)' },
    { icon: '🎥', title: 'Docker Fundamentals Video', batch: 'D02', type: 'MP4 Video', size: '210 MB', date: 'Mar 19', color: 'var(--amber)', bg: 'var(--amber-light)' },
    { icon: '📝', title: 'Week 9 Quiz – Full Stack', batch: 'B12', type: 'DOCX Document', size: '520 KB', date: 'Mar 20', color: 'var(--blue-500)', bg: 'var(--blue-50)' },
  ];

  const batchTotals = [
    { batch: 'B12', name: 'Full Stack Development', total: 5, size: '133 MB', color: 'var(--blue-500)' },
    { batch: 'C09', name: 'Python & Data Science', total: 3, size: '95 MB', color: 'var(--green)' },
    { batch: 'A05', name: 'UI/UX Design Basics', total: 2, size: '3.2 MB', color: 'var(--purple)' },
    { batch: 'D02', name: 'DevOps Fundamentals', total: 3, size: '226 MB', color: 'var(--amber)' },
  ];

  return (
    <div className="page active" id="page-materials">

      {/* KPI Row */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card blue">
          <div className="kpi-top"><div className="kpi-icon blue">📁</div><span className="kpi-trend up">↑ 12</span></div>
          <div className="kpi-val">12</div>
          <div className="kpi-label">Total Materials</div>
          <div className="kpi-bar"><div className="kpi-bar-fill blue" style={{ width: '100%' }}></div></div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top"><div className="kpi-icon green">🎥</div><span className="kpi-trend up">Videos</span></div>
          <div className="kpi-val">3</div>
          <div className="kpi-label">Video Lectures</div>
          <div className="kpi-bar"><div className="kpi-bar-fill green" style={{ width: '25%' }}></div></div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-top"><div className="kpi-icon amber">📄</div><span className="kpi-trend up">Docs</span></div>
          <div className="kpi-val">6</div>
          <div className="kpi-label">Documents & PDFs</div>
          <div className="kpi-bar"><div className="kpi-bar-fill amber" style={{ width: '50%' }}></div></div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top"><div className="kpi-icon purple">💾</div><span className="kpi-trend up">Total</span></div>
          <div className="kpi-val">458</div>
          <div className="kpi-label">Total Size (MB)</div>
          <div className="kpi-bar"><div className="kpi-bar-fill purple" style={{ width: '60%' }}></div></div>
        </div>
      </div>

      {/* Two-col layout: Batch summary + Upload area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>

        {/* Batch Material Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📂 Materials by Batch</div>
              <div className="card-sub">Storage overview per batch</div>
            </div>
          </div>
          <div className="card-body">
            {batchTotals.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 0', borderBottom: i < batchTotals.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${b.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>📁</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '13.5px' }}>{b.batch} – {b.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{b.total} files · {b.size}</div>
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(b.total / 5) * 100}%`, background: b.color, borderRadius: '4px' }}></div>
                    </div>
                  </div>
                </div>
                <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--blue-200)', background: 'var(--blue-50)', color: 'var(--blue-600)', fontSize: '11px', fontWeight: '600', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif' }}>View All</button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload zone + Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-header"><div className="card-title">⬆️ Upload Material</div></div>
            <div className="card-body">
              <div
                style={{ border: `2px dashed ${uploadHover ? 'var(--blue-500)' : 'var(--border)'}`, borderRadius: '12px', padding: '30px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all .2s', background: uploadHover ? 'var(--blue-50)' : 'transparent' }}
                onMouseEnter={() => setUploadHover(true)} onMouseLeave={() => setUploadHover(false)}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>📤</div>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '6px' }}>Drop files here</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>PDF, PPTX, MP4, DOCX, ZIP</div>
                <button style={{ padding: '9px 20px', background: 'linear-gradient(135deg,var(--blue-500),var(--blue-600))', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif' }}>Browse Files</button>
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>Select Batch</div>
                <select style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: '8px', fontFamily: '"Urbanist", sans-serif', fontSize: '13px', color: 'var(--text-dark)', background: 'var(--white)', cursor: 'pointer' }}>
                  <option>Batch B12 – Full Stack Dev</option>
                  <option>Batch C09 – Python & DS</option>
                  <option>Batch A05 – UI/UX</option>
                  <option>Batch D02 – DevOps</option>
                  <option>All Batches</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Materials Grid */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📎 All Course Materials</div>
            <div className="card-sub">All uploaded resources across your batches</div>
          </div>
          <button style={{ padding: '8px 16px', background: 'linear-gradient(135deg,var(--blue-500),var(--blue-600))', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif' }}>📄 Upload New</button>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {materials.map((m, i) => (
              <div key={i} className="mat-card" style={{ border: `1.5px solid ${m.color}22`, borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'all .2s', background: 'var(--white)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.10)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '12px' }}>{m.icon}</div>
                <div className="mat-title" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '4px', lineHeight: '1.35' }}>{m.title}</div>
                <div className="mat-meta" style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>Batch {m.batch} · {m.type}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: m.color, background: m.bg, padding: '3px 8px', borderRadius: '6px' }}>{m.size}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
