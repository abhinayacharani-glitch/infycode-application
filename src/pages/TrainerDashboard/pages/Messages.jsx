import React, { useState } from 'react';

const Messages = () => {
  const [selected, setSelected] = useState(0);
  const [message, setMessage] = useState('');

  const msgs = [
    { n: 'Priya Sharma', preview: 'Thank you so much sir! That cleared...', time: '10:22', unread: false, color: '#2563eb', role: 'Student · Batch B12' },
    { n: 'Management', preview: 'New batch E14 has been assigned to you', time: '09:00', unread: true, color: '#60a5fa', role: 'Admin Team' },
    { n: 'Arjun Kumar', preview: 'Sir, when is the next assignment?', time: 'Yesterday', unread: true, color: '#38bdf8', role: 'Student · Batch C09' },
    { n: 'Nisha Reddy', preview: 'Can I attend makeup session?', time: 'Yesterday', unread: true, color: '#7dd3fc', role: 'Student · Batch A05' },
    { n: 'Admin Team', preview: 'Monthly report submitted. Thank you.', time: 'Mar 16', unread: false, color: '#93c5fd', role: 'INFYCODE Admin' },
    { n: 'Rahul Mehta', preview: 'Sir, doubt in Node.js session.', time: 'Mar 15', unread: false, color: '#3b82f6', role: 'Student · Batch B12' },
  ];

  const threads = [
    [
      { from: 'Priya Sharma', text: 'Hello sir, I have a doubt regarding the React useEffect hook. Can you help me?', time: '10:15 AM', self: false },
      { from: 'You', text: 'Sure Priya! useEffect runs after every render by default. Adding an empty dependency array [] makes it run only once on mount. I\'ll share resources with the batch.', time: '10:20 AM', self: true },
      { from: 'Priya Sharma', text: 'Thank you so much sir! That cleared it up. 🙏', time: '10:22 AM', self: false },
    ],
    [
      { from: 'Management', text: 'New batch E14 has been assigned to you starting April 1, 2026. Please check your schedule.', time: '09:00 AM', self: false },
    ],
    [
      { from: 'Arjun Kumar', text: 'Sir, when is the next Python assignment due?', time: 'Yesterday', self: false },
      { from: 'You', text: 'The next assignment is due on March 22nd. Check the materials section for the details.', time: 'Yesterday', self: true },
    ],
    [
      { from: 'Nisha Reddy', text: 'Sir, I missed the last UI/UX session due to health issues. Can I attend a makeup session?', time: 'Yesterday', self: false },
    ],
    [
      { from: 'Admin Team', text: 'Monthly report for February has been submitted. Thank you for your timely submission.', time: 'Mar 16', self: false },
    ],
    [
      { from: 'Rahul Mehta', text: 'Sir, I have a doubt in the Node.js session. Can you explain RESTful API design again?', time: 'Mar 15', self: false },
      { from: 'You', text: 'Sure Rahul, I will cover REST API design in our next session. You can also check the recording.', time: 'Mar 15', self: true },
    ],
  ];

  return (
    <div className="page active" id="page-messages">

      {/* KPI Row */}
      <div className="kpi-grid" style={{ marginBottom: '28px' }}>
        <div className="kpi-card blue">
          <div className="kpi-top"><div className="kpi-icon blue">✉️</div><span className="kpi-trend up">Inbox</span></div>
          <div className="kpi-val">6</div>
          <div className="kpi-label">Total Messages</div>
          <div className="kpi-bar"><div className="kpi-bar-fill blue" style={{ width: '100%' }}></div></div>
        </div>
        <div className="kpi-card green">
          <div className="kpi-top"><div className="kpi-icon green">🔔</div><span className="kpi-trend up">New</span></div>
          <div className="kpi-val">3</div>
          <div className="kpi-label">Unread Messages</div>
          <div className="kpi-bar"><div className="kpi-bar-fill green" style={{ width: '50%' }}></div></div>
        </div>
        <div className="kpi-card amber">
          <div className="kpi-top"><div className="kpi-icon amber">👥</div><span className="kpi-trend up">Active</span></div>
          <div className="kpi-val">5</div>
          <div className="kpi-label">Students Messaging</div>
          <div className="kpi-bar"><div className="kpi-bar-fill amber" style={{ width: '62%' }}></div></div>
        </div>
        <div className="kpi-card purple">
          <div className="kpi-top"><div className="kpi-icon purple">⚡</div><span className="kpi-trend up">Fast</span></div>
          <div className="kpi-val">4m</div>
          <div className="kpi-label">Avg Response Time</div>
          <div className="kpi-bar"><div className="kpi-bar-fill purple" style={{ width: '85%' }}></div></div>
        </div>
      </div>

      {/* 3-col layout: Inbox | Thread | Compose/Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '24px' }}>

        {/* Inbox */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <div>
              <div className="card-title">✉️ Inbox</div>
              <div className="card-sub">{msgs.filter(m => m.unread).length} unread</div>
            </div>
          </div>
          <div className="card-body" style={{ padding: '8px 0' }}>
            <div className="msg-list">
              {msgs.map((m, i) => (
                <div
                  key={i}
                  className={`msg-item${m.unread ? ' unread' : ''}${selected === i ? ' active' : ''}`}
                  onClick={() => setSelected(i)}
                  style={{ cursor: 'pointer', background: selected === i ? 'var(--blue-50)' : 'transparent', borderLeft: selected === i ? '3px solid var(--blue-500)' : '3px solid transparent' }}
                >
                  <div className="msg-avatar" style={{ background: m.color }}>
                    {m.n.split(' ').map(x => x[0]).join('').slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="msg-name">{m.n}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '1px' }}>{m.role}</div>
                    <div className="msg-preview">{m.preview}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                    <span className="msg-time">{m.time}</span>
                    {m.unread && <div className="unread-dot"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: '500px' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: msgs[selected].color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '13px', fontWeight: '700' }}>
                {msgs[selected].n.split(' ').map(x => x[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="card-title" style={{ marginBottom: '1px' }}>📨 {msgs[selected].n}</div>
                <div className="card-sub">{msgs[selected].role}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif' }}>📞 Call</button>
              <button style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid var(--blue-200)', background: 'var(--blue-50)', color: 'var(--blue-600)', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif' }}>📁 File</button>
            </div>
          </div>
          <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {threads[selected].map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.self ? 'flex-end' : 'flex-start' }}>
                {!msg.self && <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>{msg.from}</div>}
                <div style={{ background: msg.self ? 'linear-gradient(135deg,var(--blue-500),var(--blue-600))' : 'var(--blue-50)', borderRadius: msg.self ? '12px 12px 4px 12px' : '12px 12px 12px 4px', padding: '12px 16px', maxWidth: '80%', border: msg.self ? 'none' : '1px solid var(--border)' }}>
                  <div style={{ fontSize: '13px', color: msg.self ? '#fff' : 'var(--text-dark)', lineHeight: '1.5' }}>{msg.text}</div>
                  <div style={{ fontSize: '10px', color: msg.self ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)', marginTop: '4px' }}>{msg.time}{msg.self ? ' · You' : ''}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: '10px', fontFamily: '"Urbanist", sans-serif', fontSize: '13px', color: 'var(--text-dark)', outline: 'none', background: 'var(--white)' }}
              />
              <button style={{ padding: '10px 16px', background: 'linear-gradient(135deg,var(--blue-500),var(--blue-600))', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', cursor: 'pointer' }}>➤</button>
            </div>
          </div>
        </div>

        {/* Contact Info / Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card">
            <div className="card-header"><div className="card-title">👤 Contact Info</div></div>
            <div className="card-body">
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: msgs[selected].color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: '700', margin: '0 auto 10px' }}>
                  {msgs[selected].n.split(' ').map(x => x[0]).join('').slice(0, 2)}
                </div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-dark)' }}>{msgs[selected].n}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{msgs[selected].role}</div>
              </div>
              {[
                { label: 'Last Active', value: msgs[selected].time },
                { label: 'Messages', value: threads[selected].length },
                { label: 'Status', value: msgs[selected].unread ? 'Unread' : 'Read' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-dark)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">⚡ Quick Reply</div></div>
            <div className="card-body">
              {[
                '✅ Noted, thank you!',
                '📅 Let\'s discuss in next session',
                '📎 Check materials section',
                '👍 Got it, will get back to you',
              ].map((t, i) => (
                <button key={i} onClick={() => setMessage(t)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', marginBottom: i < 3 ? '8px' : '0', border: '1.5px solid var(--border)', borderRadius: '8px', background: 'transparent', color: 'var(--text-mid)', fontSize: '12px', cursor: 'pointer', fontFamily: '"Urbanist", sans-serif', transition: 'all .2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-50)'; e.currentTarget.style.borderColor = 'var(--blue-200)'; e.currentTarget.style.color = 'var(--blue-600)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mid)'; }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
