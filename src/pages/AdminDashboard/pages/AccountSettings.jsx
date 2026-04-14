import React from 'react';

const AccountSettings = () => {
  return (
    <div className="settings-page">
      <div className="adm-page-header">
        <h2 className="adm-page-title">Account Settings</h2>
        <p className="adm-page-subtitle">Update your personal information and profile details.</p>
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Full Name</label>
            <input 
              type="text" 
              defaultValue="Admin User" 
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dbeafe' }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Email Address</label>
            <input 
              type="email" 
              defaultValue="admin@infycode.com" 
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
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
