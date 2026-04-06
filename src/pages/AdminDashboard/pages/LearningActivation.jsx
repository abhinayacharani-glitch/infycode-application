import React, { useState } from 'react';

const LearningActivation = () => {
  const [activation, setActivation] = useState({
    dashboard: true,
    courseAccess: false,
    mentorship: true,
    assessments: false
  });

  const toggle = (key) => setActivation(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="page active">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header">
          <h3 className="card-title">System Learning Activation</h3>
          <p className="card-sub">Control global access to various learning modules and dashboard features.</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { id: 'dashboard', label: 'Activate Main Dashboard', desc: 'Enable student and trainer login and dashboard access.', icon: '🔐' },
              { id: 'courseAccess', label: 'Enable Course Content', desc: 'Allow students to view and download study materials.', icon: '📚' },
              { id: 'mentorship', label: 'Mentorship Portal', desc: 'Enable meeting scheduling and counselling sessions.', icon: '🤝' },
              { id: 'assessments', label: 'Live Assessments', desc: 'Activate quiz and test modules for all batches.', icon: '📝' }
            ].map(item => (
              <div key={item.id} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                padding: '20px', border: '1.5px solid var(--border)', borderRadius: '16px', 
                background: activation[item.id] ? 'linear-gradient(135deg, #f0f9ff, #e0f2fe)' : 'var(--white)',
                transition: 'all 0.3s ease',
                boxShadow: activation[item.id] ? '0 8px 20px rgba(14, 165, 233, 0.08)' : 'none'
              }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                  <div style={{ fontSize: '24px', background: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-dark)', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className={`badge ${activation[item.id] ? 'active-b' : 'offline'}`} style={{ minWidth: '70px' }}>
                    {activation[item.id] ? 'Active' : 'Inactive'}
                  </span>
                  <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '22px' }}>
                    <input 
                      type="checkbox" 
                      checked={activation[item.id]} 
                      onChange={() => toggle(item.id)}
                      style={{ opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: activation[item.id] ? 'var(--blue-500)' : '#cbd5e1',
                      transition: '.4s', borderRadius: '22px',
                      boxShadow: activation[item.id] ? '0 0 10px rgba(37, 99, 235, 0.2)' : 'none'
                    }}>
                      <span style={{
                        position: 'absolute', content: '""', height: '16px', width: '16px', 
                        left: activation[item.id] ? '24px' : '3px', bottom: '3px',
                        backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}></span>
                    </span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '32px', padding: '16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', display: 'flex', gap: '12px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div style={{ fontSize: '13px', color: '#92400e' }}>
              <b>Note:</b> These settings affect all users across the platform. Changes are applied instantly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningActivation;
