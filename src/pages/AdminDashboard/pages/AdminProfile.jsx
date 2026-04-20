import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProfile.css";

/* ── Icons ── */
const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  </svg>
);

const RoleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AdminProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Load initial state from localStorage
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: loggedUser.fullName || loggedUser.fullname || "Admin User",
    email: loggedUser.email || "admin@infycode.com",
    role: loggedUser.role || "Administrator",
    profileImage: loggedUser.profileImage || "https://i.pravatar.cc/150?img=5"
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedUser = {
      ...loggedUser,
      fullName: formData.fullName,
      fullname: formData.fullName, // Consistency
      email: formData.email,
      role: formData.role,
      profileImage: previewImage || formData.profileImage
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setFormData(prev => ({ ...prev, profileImage: updatedUser.profileImage }));
    setPreviewImage(null);
    setIsEditing(false);
    
    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Dispatch events to notify other components (Sidebar, Topbar)
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('adminProfileUpdate'));
  };

  const handleCancel = () => {
    setFormData({
      fullName: loggedUser.fullName || loggedUser.fullname || "Admin User",
      email: loggedUser.email || "admin@infycode.com",
      role: loggedUser.role || "Administrator",
      profileImage: loggedUser.profileImage || "https://i.pravatar.cc/150?img=5"
    });
    setPreviewImage(null);
    setIsEditing(false);
  };

  return (
    <div className="ap-page">
      {/* Banner */}
      <div className="ap-banner">
        <div className="ap-banner-overlay" />
        <div className="ap-banner-content">
          <button className="ap-back-btn" onClick={() => navigate(-1)}>
            <BackIcon /> Back
          </button>
        </div>
      </div>

      <div className="ap-card-wrap">
        <div className="ap-card">
          
          {/* Header Section (Avatar & Basic Info) */}
          <div className="ap-avatar-row">
            <div className="ap-avatar-wrap">
              <img 
                src={previewImage || formData.profileImage} 
                alt="Profile" 
                className="ap-avatar-img" 
              />
              <span className="ap-status-dot" />
              {isEditing && (
                <button className="ap-avatar-edit-btn" onClick={() => fileInputRef.current.click()}>
                  <CameraIcon />
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="ap-name-block">
              {isEditing ? (
                <input 
                  className="ap-edit-input ap-edit-name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoFocus
                />
              ) : (
                <h1 className="ap-name">{formData.fullName}</h1>
              )}
              <span className="ap-role-badge">{formData.role}</span>
            </div>

            <div className="ap-action-buttons">
              {isEditing ? (
                <>
                  <button className="ap-btn ap-btn-cancel" onClick={handleCancel}>Cancel</button>
                  <button className="ap-btn ap-btn-save" onClick={handleSave}>Save Changes</button>
                </>
              ) : (
                <button className="ap-btn ap-btn-edit" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {showToast && (
            <div className="ap-saved-toast">
              <CheckIcon /> Profile updated successfully!
            </div>
          )}

          <div className="ap-divider" />

          {/* Detailed Info Section */}
          <div className="ap-info-grid">
            
            <div className="ap-info-item">
              <div className="ap-info-icon"><UserIcon /></div>
              <div className="ap-info-content">
                <div className="ap-info-label">Full Name</div>
                {isEditing ? (
                  <input 
                    className="ap-edit-input"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="ap-info-value">{formData.fullName}</div>
                )}
              </div>
            </div>

            <div className="ap-info-item">
              <div className="ap-info-icon"><MailIcon /></div>
              <div className="ap-info-content">
                <div className="ap-info-label">Email Address</div>
                {isEditing ? (
                  <input 
                    className="ap-edit-input"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="ap-info-value">{formData.email}</div>
                )}
              </div>
            </div>

            <div className="ap-info-item">
              <div className="ap-info-icon"><RoleIcon /></div>
              <div className="ap-info-content">
                <div className="ap-info-label">System Role</div>
                {isEditing ? (
                  <input 
                    className="ap-edit-input"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="ap-info-value">{formData.role}</div>
                )}
              </div>
            </div>

          </div>

          <div className="ap-divider" />

          {/* Stats Row */}
          <div className="ap-stats-row">
            <div className="ap-stat">
              <div className="ap-stat-num">12</div>
              <div className="ap-stat-label">Pending Verifications</div>
            </div>
            <div className="ap-stat-divider" />
            <div className="ap-stat">
              <div className="ap-stat-num">8</div>
              <div className="ap-stat-label">Active Batches</div>
            </div>
            <div className="ap-stat-divider" />
            <div className="ap-stat">
              <div className="ap-stat-num">24</div>
              <div className="ap-stat-label">System Reports</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
