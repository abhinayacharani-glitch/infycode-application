import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminProfile.css';

/* ── SVG Icons ── */
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AdminProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  /* ── State ── */
  const [isEditing, setIsEditing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const [fullName, setFullName]       = useState(user.fullName || user.fullname || user.username || 'Administrator');
  const [email, setEmail]             = useState(user.email || 'admin@infycode.com');
  const [phone, setPhone]             = useState(user.phone || '');
  const [role, setRole]               = useState(user.role || 'Administrator');
  const [profileImage, setProfileImage] = useState(user.profileImage || 'https://i.pravatar.cc/150?img=5');
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'N/A';

  /* ── Handlers ── */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      fullName: fullName,
      fullname: fullName,
      email: email,
      phone: phone,
      role: role,
      profileImage: previewImage || profileImage,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setProfileImage(previewImage || profileImage);
    setPreviewImage(null);
    setIsEditing(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  const handleCancel = () => {
    // Reset to stored values
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    setFullName(stored.fullName || stored.fullname || stored.username || 'Administrator');
    setEmail(stored.email || 'admin@infycode.com');
    setPhone(stored.phone || '');
    setRole(stored.role || 'Administrator');
    setPreviewImage(null);
    setIsEditing(false);
  };

  const displayImage = previewImage || profileImage;

  return (
    <div className="ap-page">

      {/* Hero Banner */}
      <div className="ap-banner">
        <div className="ap-banner-overlay" />
        <div className="ap-banner-content">
          <button className="ap-back-btn" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="ap-card-wrap">
        <div className="ap-card">

          {/* Avatar + Name Row */}
          <div className="ap-avatar-row">
            <div className="ap-avatar-wrap">
              <img src={displayImage} alt={fullName} className="ap-avatar-img" />
              <span className="ap-status-dot" title="Online" />
              {isEditing && (
                <button
                  className="ap-avatar-edit-btn"
                  onClick={() => fileInputRef.current.click()}
                  title="Change Photo"
                >
                  <CameraIcon />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
            <div className="ap-name-block">
              {isEditing ? (
                <input
                  type="text"
                  className="ap-edit-input ap-edit-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                />
              ) : (
                <h1 className="ap-name">{fullName}</h1>
              )}
              <span className="ap-role-badge">{role}</span>
            </div>

            {/* Edit / Save / Cancel buttons */}
            <div className="ap-action-buttons">
              {isEditing ? (
                <>
                  <button className="ap-btn ap-btn-cancel" onClick={handleCancel} title="Cancel">
                    <CloseIcon /> Cancel
                  </button>
                  <button className="ap-btn ap-btn-save" onClick={handleSave} title="Save Changes">
                    <CheckIcon /> Save
                  </button>
                </>
              ) : (
                <button className="ap-btn ap-btn-edit" onClick={() => setIsEditing(true)} title="Edit Profile">
                  <EditIcon /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Saved toast */}
          {showSaved && (
            <div className="ap-saved-toast">
              <CheckIcon /> Changes saved successfully!
            </div>
          )}

          {/* Divider */}
          <div className="ap-divider" />

          {/* Info Grid */}
          <div className="ap-info-grid">
            {/* Email */}
            <div className="ap-info-item">
              <div className="ap-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <div className="ap-info-label">Email Address</div>
                {isEditing ? (
                  <input
                    type="email"
                    className="ap-edit-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                ) : (
                  <div className="ap-info-value">{email}</div>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="ap-info-item">
              <div className="ap-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.72 3.38 2 2 0 0 1 3.69 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 6.24 6.24l1.21-1.04a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <div className="ap-info-label">Phone Number</div>
                {isEditing ? (
                  <input
                    type="tel"
                    className="ap-edit-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone Number"
                  />
                ) : (
                  <div className="ap-info-value">{phone || 'Not provided'}</div>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="ap-info-item">
              <div className="ap-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div>
                <div className="ap-info-label">Role</div>
                {isEditing ? (
                  <input
                    type="text"
                    className="ap-edit-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Role"
                  />
                ) : (
                  <div className="ap-info-value">{role}</div>
                )}
              </div>
            </div>

            {/* Member Since (non-editable) */}
            <div className="ap-info-item">
              <div className="ap-info-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <div className="ap-info-label">Member Since</div>
                <div className="ap-info-value">{joinDate}</div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="ap-divider" />

          {/* Stats Row */}
          <div className="ap-stats-row">
            <div className="ap-stat">
              <div className="ap-stat-num">12</div>
              <div className="ap-stat-label">Courses Managed</div>
            </div>
            <div className="ap-stat-divider" />
            <div className="ap-stat">
              <div className="ap-stat-num">340</div>
              <div className="ap-stat-label">Students Enrolled</div>
            </div>
            <div className="ap-stat-divider" />
            <div className="ap-stat">
              <div className="ap-stat-num">28</div>
              <div className="ap-stat-label">Trainers Approved</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminProfile;
