import React from 'react';

const SecuritySettings = () => {
  return (
    <div className="settings-page">
      <div className="adm-page-header">
        <h2 className="adm-page-title">Security Settings</h2>
        <p className="adm-page-subtitle">Manage your password and account security.</p>
      </div>

      <div className="settings-card" style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '12px',
        border: '1.5px solid #dbeafe',
        marginTop: '24px',
        maxWidth: '600px'
      }}>
        <form className="settings-form">
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Current Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dbeafe' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>New Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dbeafe' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Confirm New Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dbeafe' }}
            />
          </div>
          <button type="submit" style={{ 
            background: '#2563eb', 
            color: '#fff', 
            padding: '10px 20px', 
            borderRadius: '8px', 
            border: 'none', 
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;
