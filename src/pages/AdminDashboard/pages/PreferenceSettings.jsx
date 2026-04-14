import React from 'react';

const PreferenceSettings = () => {
  return (
    <div className="settings-page">
      <div className="adm-page-header">
        <h2 className="adm-page-title">Global Preferences</h2>
        <p className="adm-page-subtitle">Configure system-wide settings and preferences.</p>
      </div>

      <div className="settings-card" style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        border: '1.5px solid #dbeafe',
        marginTop: '24px',
        maxWidth: '600px'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '12px' }}>Theme Preference</h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #2563eb', background: '#eff6ff', color: '#2563eb' }}>Light</button>
            <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #dbeafe', background: '#fff' }}>Dark</button>
            <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #dbeafe', background: '#fff' }}>System</button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ marginBottom: '12px' }}>Email Notifications</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" defaultChecked />
            <span>Receive weekly reports</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input type="checkbox" defaultChecked />
            <span>Receive security alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceSettings;
