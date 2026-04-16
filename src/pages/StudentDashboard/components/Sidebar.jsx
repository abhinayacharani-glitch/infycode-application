import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import "./Sidebar.css";
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLogoLogoutModal, setShowLogoLogoutModal] = useState(false);

  const getInitialUser = () => {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : { fullname: "Student", role: "Developer" };
  };

  const [user, setUser] = useState(getInitialUser());
  const [formData, setFormData] = useState({
    fullname: user.fullname || user.fullName || "Student",
    role: user.role || "Developer"
  });

  useEffect(() => {
    setFormData({
      fullname: user.fullname || user.fullName || "Student",
      role: user.role || "STUDENT"
    });
  }, [user]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowEditProfileModal(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/student/login');
  };

  const navItems = [
    { to: "/student-dashboard/counselling", label: "Counselling" },
    { to: "/student-dashboard/skill-test", label: "Skill Based Test" },
    { to: "/student-dashboard/course", label: "Courses" },
    { to: "/student-dashboard/courses", label: "Enrolled Courses" },
    { to: "/student-dashboard/mentor-connection", label: "Mentor Connect" },
    { to: "/student-dashboard/mock-interview", label: "Mock Tests & Interviews" },
    { to: "/student-dashboard/projects", label: "Projects & Certificates" },
    { to: "/student-dashboard/profile", label: "My Profile" },
  ];

  return (
    <>
      <aside className="student-sd-sidebar">

        {/* BRAND — click opens logo logout modal */}
        <button className="student-sd-brand" onClick={() => setShowLogoLogoutModal(true)}>
          <div className="sidebar-logo-group">
            <img src={icLogo} alt="Logo" className="sidebar-ic-logo" />
            <img src={bannerLogo} alt="InfyCode" className="sidebar-banner-logo" />
          </div>
        </button>

        {/* USER PROFILE CARD - Click opens Edit Profile Modal */}
        <div className="student-sd-user-link" onClick={() => setShowEditProfileModal(true)}>
          <div className="student-sd-user">
            <div className="student-sd-avatar-wrap">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                alt="User"
                className="student-sd-avatar"
              />
              <span className="student-sd-status-dot"></span>
            </div>
            <div className="student-sd-user-info">
              <div className="student-sd-name">{formData.fullname}</div>
              <div className="student-sd-role">{formData.role}</div>
            </div>
          </div>
        </div>

        {/* NAV — text only, no icons */}
        <nav className="student-sd-nav">
          {navItems.map((item, i) => (
            <NavLink key={i} to={item.to}
              className={({ isActive }) => `student-sd-item ${isActive ? 'active' : ''}`}>
              <div className="student-sd-box">
                <span className="student-sd-text">{item.label}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        {/* FOOTER LOGOUT */}
        <div className="student-sd-footer">
          <button className="student-sd-logout-btn" onClick={() => setShowLogoutModal(true)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── EDIT PROFILE MODAL ── */}
      {showEditProfileModal && (
        <div className="sd-modal-overlay" onClick={() => setShowEditProfileModal(false)}>
          <div className="sd-edit-profile-modal" onClick={e => e.stopPropagation()}>
            <div className="sd-modal-header">
              <h3>Edit Profile</h3>
              <button className="sd-modal-close" onClick={() => setShowEditProfileModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="sd-modal-body">
              <div className="sd-avatar-upload">
                <div className="sd-avatar-container">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                    alt="Profile"
                    className="sd-modal-large-avatar"
                  />
                  <div className="sd-camera-overlay">
                    <Camera size={20} color="#ffffff" />
                  </div>
                </div>
                <p className="sd-upload-hint">Click the camera icon to upload a photo</p>
              </div>

              <form onSubmit={handleSaveProfile} className="sd-edit-profile-form">
                <div className="sd-form-group">
                  <label>FULL NAME</label>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="sd-form-group">
                  <label>ROLE</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Enter role"
                  />
                </div>

                <div className="sd-modal-footer">
                  <button type="button" className="sd-btn-cancel" onClick={() => setShowEditProfileModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="sd-btn-save">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── LOGOUT CONFIRMATION MODAL (To Sign In) ── */}
      {showLogoutModal && (
        <div className="sd-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="sd-modal-card" onClick={e => e.stopPropagation()}>

            <div className="sd-modal-user-header">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Profile" className="sd-modal-avatar" />
              <div className="sd-modal-user-info">
                <span className="sd-modal-name">{formData.fullname}</span>
                <span className="sd-modal-role">{formData.role}</span>
              </div>
            </div>

            <h2 className="sd-modal-title">Log out to Sign in Page?</h2>
            <p className="sd-modal-subtitle">Are you sure you want to end your current dashboard session?</p>

            <div className="sd-modal-actions">
              <button className="sd-modal-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="sd-modal-logout" onClick={handleLogout}>
                Yes, log out
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── LOGO LOGOUT CONFIRMATION MODAL (To Landing Page) ── */}
      {showLogoLogoutModal && (
        <div className="sd-modal-overlay" onClick={() => setShowLogoLogoutModal(false)}>
          <div className="sd-logo-modal-card" onClick={e => e.stopPropagation()}>
            
            <div className="sd-logo-modal-icon-wrapper">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>

            <h2 className="sd-logo-modal-title">Logout</h2>
            <p className="sd-logo-modal-subtitle">Are you sure you want to log out?</p>

            <div className="sd-logo-modal-actions">
              <button className="sd-logo-modal-cancel" onClick={() => setShowLogoLogoutModal(false)}>
                Cancel
              </button>
              <button className="sd-logo-modal-confirm" onClick={() => { localStorage.clear(); navigate('/'); }}>
                OK, Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
