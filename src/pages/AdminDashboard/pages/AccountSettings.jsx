import React, { useState, useRef } from 'react';

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
);

const AccountSettings = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [profileImage, setProfileImage] = useState(user.profileImage || "https://i.pravatar.cc/150?img=5");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // In a real app, you would upload to server here
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="settings-page" style={{ padding: '24px', fontFamily: 'Urbanist, sans-serif' }}>
      <div className="adm-page-header" style={{ marginBottom: '32px' }}>
        <h2 className="adm-page-title" style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>Trainer Profile Settings</h2>
        <p className="adm-page-subtitle" style={{ color: '#64748b' }}>Configure your professional profile and training credentials.</p>
      </div>
      
      <div className="profile-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
        {/* Left: Profile Photo Section */}
        <div className="profile-photo-card" style={{
          background: '#fff',
          padding: '32px',
          borderRadius: '20px',
          border: '1.5px solid #e2e8f0',
          textAlign: 'center',
          height: 'fit-content'
        }}>
          <div className="photo-container" style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 24px' }}>
            <img 
              src={profileImage} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid #f1f5f9' }} 
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              style={{
                position: 'absolute', bottom: '5px', right: '5px',
                background: '#2563eb', color: '#fff', border: 'none',
                width: '42px', height: '42px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <CameraIcon />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '700' }}>{user.fullName || "Trainer Name"}</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Senior Lead Trainer</p>
          <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #dbeafe', fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>
            ID Verified Member
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="form-card" style={{
          background: '#fff',
          padding: '40px',
          borderRadius: '24px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
        }}>
          <form className="settings-form">
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', borderBottom: '1.5px solid #f1f5f9', paddingBottom: '12px' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: '#334155' }}>Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user.fullName || "Admin User"}
                  className="profile-input"
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: '#334155' }}>Email Address</label>
                <input 
                  type="email" 
                  defaultValue={user.email || "admin@infycode.com"}
                  className="profile-input"
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: '#334155' }}>Specialization</label>
                <input 
                  type="text" 
                  defaultValue="Full Stack Development" 
                  className="profile-input"
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: '#334155' }}>Experience (Years)</label>
                <input 
                  type="number" 
                  defaultValue="8" 
                  className="profile-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '14px', color: '#334155' }}>Professional Bio</label>
              <textarea 
                defaultValue="Expert in React, Node.js and Cloud Architecture. Passionate about teaching and building scalable web applications." 
                className="profile-input"
                style={{ height: '120px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" style={{ 
                background: '#f1f5f9', color: '#475569', 
                padding: '12px 24px', borderRadius: '12px', border: 'none', 
                fontWeight: '700', cursor: 'pointer' 
              }}>Cancel</button>
              <button type="submit" style={{ 
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)', 
                color: '#fff', padding: '12px 32px', borderRadius: '12px', 
                border: 'none', fontWeight: '700', cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
              }}>Update Profile</button>
            </div>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          font-family: inherit;
          font-size: 15px;
          color: #1e293b;
          transition: all 0.2s;
          background: #f8fafc;
        }
        .profile-input:focus {
          outline: none;
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}} />
    </div>
  );
};

export default AccountSettings;
