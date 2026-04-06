import React from 'react';
import { NavLink } from 'react-router-dom';

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

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16v16H4z"/>
    <polyline points="22,6 12,13 2,6"/>
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
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const userName = loggedUser.username || "Trainer";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'T';

  return (
    <aside className="sidebar" id="sidebar">
      <div className="brand-section">
        <div className="logo-container">
          <img 
            src="https://image2url.com/r2/default/images/1773904682881-8c279e0e-742e-4d5d-9f55-df1bf46bce45.png" 
            alt="InfyCode Logo" 
            className="infycode-logo" 
          />
          <div className="brand-text">
            <span className="brand-name">INFYCODE</span>
            <span className="brand-tagline">Trainer Portal</span>
          </div>
        </div>
      </div>

      <div className="trainer-card">
        <div className="trainer-avatar">{userInitial}</div>
        <div>
          <div className="trainer-name">{userName}</div>
          <div className="trainer-role">
            <span className="status-dot"></span>Active Trainer
          </div>
        </div>
      </div>

      <div className="nav-section">Main</div>

      <NavLink to="/trainer-dashboard/dashboard"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><DashboardIcon /></span> Dashboard
      </NavLink>

      <NavLink to="/trainer-dashboard/profile"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><UserIcon /></span> My Profile
      </NavLink>

      <NavLink to="/trainer-dashboard/batches"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><BookIcon /></span> My Batches
        <span className="nav-badge">4</span>
      </NavLink>

      <NavLink to="/trainer-dashboard/schedule"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><CalendarIcon /></span> Schedule
      </NavLink>

      <div className="nav-section">Academic</div>

      <NavLink to="/trainer-dashboard/materials"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><PaperclipIcon /></span> Course Materials
        <span className="nav-badge green">12</span>
      </NavLink>

      <NavLink to="/trainer-dashboard/attendance"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><ClipboardIcon /></span> Attendance
      </NavLink>

      <NavLink to="/trainer-dashboard/feedback"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><MessageIcon /></span> Feedback & Ratings
        <span className="nav-badge amber">3</span>
      </NavLink>

      {/* <div className="nav-section">Communication</div>

      <NavLink to="/trainer-dashboard/messages"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <span className="nav-icon"><MailIcon /></span> Messages
        <span className="nav-badge">5</span>
      </NavLink> */}

      <div className="sidebar-footer">
        <NavLink to="/trainer-dashboard/logout" className="logout-btn">
          <LogoutIcon /> Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;