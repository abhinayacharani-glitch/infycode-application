import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Sidebar.css';
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';

// ✅ SVG Icons
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
  </svg>
);

const PaperclipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.2"/>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2">
    <rect x="9" y="2" width="6" height="4"/>
    <rect x="4" y="6" width="16" height="16" rx="2"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || user.fullname || "Trainer";
  const userEmail = user.email || "active.trainer@infycode.com";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'T';

  return (
    <aside className="sd-sidebar">
      {/* BRAND */}
      <div className="sd-brand">
        <Link to="/trainer-dashboard/dashboard" className="sd-logo-wrap">
          <img src={icLogo} alt="InfyCode Logo" className="sd-logo" />
          <div className="sd-brand-text">
            <img src={bannerLogo} alt="InfyCode Banner" style={{ width: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} className="sd-title" />
            <span className="sd-subtitle">Trainer Portal</span>
          </div>
        </Link>
      </div>

      {/* USER */}
      <Link to="/trainer-dashboard/profile" className="sd-user-link">
        <div className="sd-user">
          <div className="sd-avatar">{userInitial}</div>
          <div>
            <div className="sd-name">{userName}</div>
            <div className="sd-role">{userEmail}</div>
          </div>
        </div>
      </Link>

      {/* NAV */}
      <div className="sd-nav">
        <div className="nav-section-header">MAIN</div>

        <NavLink to="/trainer-dashboard/dashboard"
          className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
          <div className="sd-box">
            <span className="sd-icon"><DashboardIcon /></span>
            <span className="sd-text">Dashboard</span>
          </div>
        </NavLink>

        <NavLink to="/trainer-dashboard/profile"
          className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
          <div className="sd-box">
            <span className="sd-icon"><UserIcon /></span>
            <span className="sd-text">My Profile</span>
          </div>
        </NavLink>

        <NavLink to="/trainer-dashboard/batches"
          className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
          <div className="sd-box">
            <span className="sd-icon"><BookIcon /></span>
            <span className="sd-text">Batches</span>
            <span className="nav-badge">4</span>
          </div>
        </NavLink>

        <NavLink to="/trainer-dashboard/schedule"
          className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
          <div className="sd-box">
            <span className="sd-icon"><CalendarIcon /></span>
            <span className="sd-text">Schedule</span>
          </div>
        </NavLink>

        <div className="nav-section-header">ACADEMIC</div>

        <NavLink to="/trainer-dashboard/materials"
          className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
          <div className="sd-box">
            <span className="sd-icon"><PaperclipIcon /></span>
            <span className="sd-text">Course Materials</span>
            <span className="nav-badge green">12</span>
          </div>
        </NavLink>

        <NavLink to="/trainer-dashboard/attendance"
          className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
          <div className="sd-box">
            <span className="sd-icon"><ClipboardIcon /></span>
            <span className="sd-text">Attendance</span>
          </div>
        </NavLink>

        <NavLink to="/trainer-dashboard/feedback"
          className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
          <div className="sd-box">
            <span className="sd-icon"><MessageIcon /></span>
            <span className="sd-text">Feedback & Ratings</span>
            <span className="nav-badge amber">3</span>
          </div>
        </NavLink>
      </div>

      {/* FOOTER */}
      <div className="sd-footer">
        <NavLink to="/trainer-dashboard/logout" className="sd-logout">
          <span className="sd-icon"><LogoutIcon /></span>
          <span className="sd-text">Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};


export default Sidebar;