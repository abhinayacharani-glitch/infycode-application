import React from 'react';

const Feedback = () => {
  const reviews = [
    { name: 'Priya Sharma', batch: 'B12', course: 'Full Stack Dev', stars: 5, date: 'Mar 12, 2026', text: 'Ravi sir explains complex topics with real-world examples. Best trainer I\'ve had. The Full Stack course was incredibly practical and hands-on.', avatar: 'PS', color: '#2563eb' },
    { name: 'Arjun Kumar', batch: 'C09', course: 'Python & DS', stars: 5, date: 'Mar 10, 2026', text: 'Excellent teaching methodology. Python and ML concepts were made very easy to understand. Very approachable and always ready to help.', avatar: 'AK', color: '#38bdf8' },
    { name: 'Nisha Reddy', batch: 'A05', course: 'UI/UX Design', stars: 4, date: 'Mar 08, 2026', text: 'Great sessions! The UI/UX fundamentals were well structured. Would love more practice projects in the curriculum.', avatar: 'NR', color: '#7dd3fc' },
    { name: 'Rahul Mehta', batch: 'B12', course: 'Full Stack Dev', stars: 5, date: 'Mar 07, 2026', text: 'The best coding trainer! Node.js sessions were crystal clear. Ravi sir always ensures every student understands before moving forward.', avatar: 'RM', color: '#93c5fd' },
    { name: 'Sneha Patel', batch: 'C09', course: 'Python & DS', stars: 5, date: 'Mar 05, 2026', text: 'Amazing depth of knowledge. The data science modules were industry-focused and extremely relevant. Highly recommend!', avatar: 'SP', color: '#60a5fa' },
    { name: 'Vikram Singh', batch: 'D02', course: 'DevOps', stars: 4, date: 'Mar 03, 2026', text: 'Very informative and well structured course. DevOps concepts explained with live demos make it much easier to grasp.', avatar: 'VS', color: '#3b82f6' },
  ];

  const renderStars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);

  const courseRatings = [
    { name: 'Full Stack Development', batch: 'B12', rating: 4.9, reviews: 32, color: 'var(--blue-500)' },
    { name: 'Python & Data Science', batch: 'C09', rating: 4.8, reviews: 28, color: 'var(--green)' },
    { name: 'UI/UX Design Basics', batch: 'A05', rating: 4.6, reviews: 24, color: 'var(--purple)' },
    { name: 'DevOps Fundamentals', batch: 'D02', rating: 4.7, reviews: 20, color: 'var(--amber)' },
  ];

  return (
    <div className="page active" id="page-feedback">

      {/* KPI Row */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card blue">
          <div className="kpi-top"><div className="kpi-icon blue">⭐</div><span className="kpi-trend up">↑ 0.1</span></div>
          <div className="kpi-val">4.8</div>
          <div className="kpi-label">Overall Rating</div>
          <div className="kpi-bar"><div className="kpi-bar-fill blue" style={{ width: '96%' }}></div></div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top"><div className="kpi-icon green">📝</div><span className="kpi-trend up">↑ 14</span></div>
          <div className="kpi-val">128</div>
          <div className="kpi-label">Total Reviews</div>
          <div className="kpi-bar"><div className="kpi-bar-fill green" style={{ width: '78%' }}></div></div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-top"><div className="kpi-icon amber">🏆</div><span className="kpi-trend up">Top 5%</span></div>
          <div className="kpi-val">78%</div>
          <div className="kpi-label">5-Star Reviews</div>
          <div className="kpi-bar"><div className="kpi-bar-fill amber" style={{ width: '78%' }}></div></div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top"><div className="kpi-icon purple">📣</div><span className="kpi-trend up">NPS</span></div>
          <div className="kpi-val">94</div>
          <div className="kpi-label">Recommend Score</div>
          <div className="kpi-bar"><div className="kpi-bar-fill purple" style={{ width: '94%' }}></div></div>
        </div>
      </div>

      {/* 2-col top section: Rating overview + Course ratings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px', marginBottom: '24px' }}>

        {/* Rating Overview */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">🌟 Rating Overview</div>
              <div className="card-sub">Student reviews breakdown</div>
            </div>
          </div>
          <div className="card-body">
            <div className="rating-overview" style={{ flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="big-rating">4.8</div>
                  <div style={{ color: 'var(--blue-400)', fontSize: '22px', letterSpacing: '2px' }}>★★★★★</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>128 reviews</div>
                </div>
                <div className="rating-bars" style={{ flex: 1 }}>
                  {[{ star: 5, pct: 78 }, { star: 4, pct: 15 }, { star: 3, pct: 5 }, { star: 2, pct: 2 }, { star: 1, pct: 0 }].map((r) => (
                    <div key={r.star} className="rbar-row">
                      <span className="rbar-label">{r.star}★</span>
                      <div className="rbar-track"><div className="rbar-fill" style={{ width: `${r.pct}%` }}></div></div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', width: '30px', textAlign: 'right' }}>{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Achievements */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { icon: '🏅', label: 'Top Trainer', sub: 'March 2026' },
                { icon: '🎯', label: 'Perfect Score', sub: '3 Batches' },
                { icon: '💬', label: 'Most Engaging', sub: 'Student Poll' },
                { icon: '📚', label: 'Best Content', sub: 'Material Award' },
              ].map((a, i) => (
                <div key={i} style={{ padding: '10px 12px', background: 'var(--blue-50)', borderRadius: '10px', border: '1px solid var(--blue-100)', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{a.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dark)' }}>{a.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{a.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Ratings */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📊 Course-wise Ratings</div>
              <div className="card-sub">Per batch performance</div>
            </div>
          </div>
          <div className="card-body">
            {courseRatings.map((c, i) => (
              <div key={i} style={{ marginBottom: i < courseRatings.length - 1 ? '20px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontWeight: '700', color: c.color, fontSize: '13px' }}>{c.batch}</span>
                    <span style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '13px' }}> – {c.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: c.color }}>{c.rating}</span>
                    <span style={{ color: 'var(--blue-400)', fontSize: '14px' }}>★</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="prog-bar" style={{ flex: 1 }}>
                    <div className="prog-fill" style={{ width: `${(c.rating / 5) * 100}%`, background: c.color }}></div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{c.reviews} reviews</span>
                </div>
              </div>
            ))}

            {/* Monthly rating trend */}
            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--blue-50)', borderRadius: '12px', border: '1px solid var(--blue-100)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '10px' }}>📈 Rating Trend (6 Months)</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '50px' }}>
                {[4.5, 4.6, 4.5, 4.7, 4.7, 4.8].map((v, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ flex: 1, width: '100%', background: i === 5 ? 'var(--blue-500)' : 'var(--blue-200)', borderRadius: '4px 4px 0 0', height: `${((v - 4) / 1) * 50}px` }} title={`${v}`}></div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width Reviews */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">💬 Student Reviews</div>
            <div className="card-sub">Recent feedback from your students</div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {reviews.map((r, i) => (
              <div key={i} className="feedback-item" style={{ margin: 0, borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--white)', padding: '16px', transition: 'all .2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.09)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '13px' }}>{r.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.course} · Batch {r.batch}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>{r.date}</div>
                </div>
                <div className="stars" style={{ fontSize: '14px', color: 'var(--blue-400)', marginBottom: '8px', letterSpacing: '1px' }}>{renderStars(r.stars)}</div>
                <div className="fb-text" style={{ fontSize: '12.5px', color: 'var(--text-mid)', lineHeight: '1.5' }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
