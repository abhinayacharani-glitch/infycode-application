import React from 'react';
import { NavLink } from 'react-router-dom';

/* ── SVG Icons ── */
const DashboardIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a7.97 7.97 0 0 0 .1-2l2.1-1.6-2-3.4-2.5 1a8 8 0 0 0-1.7-1L13 2h-2l-.4 3a8 8 0 0 0-1.7 1l-2.5-1-2 3.4L6.5 13a7.97 7.97 0 0 0 .1 2l-2.1 1.6 2 3.4 2.5-1a8 8 0 0 0 1.7 1L11 22h2l.4-3a8 8 0 0 0 1.7-1l2.5 1 2-3.4z"/>
  </svg>
);

const TrainerIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 1 7 0l1 1a5 5 0 0 1-7 7l-1-1"/>
    <path d="M14 11a5 5 0 0 0-7 0l-1 1a5 5 0 0 0 7 7l1-1"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const BookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const ReportIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const Sidebar = () => {
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = loggedUser.fullName || loggedUser.fullname || loggedUser.username || "Admin";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'A';

  return (
    <aside className="admin-sidebar" id="admin-sidebar">

      {/* ── Brand / Logo ── */}
      <div className="adm-brand-section">
        <div className="adm-logo-container">
          <img
            src="https://image2url.com/r2/default/images/1773904682881-8c279e0e-742e-4d5d-9f55-df1bf46bce45.png"
            alt="InfyCode Logo"
            className="adm-logo-img"
          />
          <div className="adm-brand-text">
            <span className="adm-brand-name">INFYCODE</span>
            <span className="adm-brand-tagline">Admin Portal</span>
          </div>
        </div>
      </div>

      {/* ── Admin User Card ── */}
      <div className="adm-user-card">
        <div className="adm-user-avatar">{userInitial}</div>
        <div className="adm-user-info">
          <div className="adm-user-name">{userName}</div>
          <div className="adm-user-role">
            <span className="adm-status-dot"></span>
            System Admin
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="adm-nav-body">

        {/* CORE OPERATIONS */}
        <div className="adm-nav-section">Core Operations</div>

        <NavLink
          to="/admin-dashboard/dashboard"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><DashboardIcon /></span>
          <span className="adm-nav-label">Overview</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/student-verification"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><ShieldIcon /></span>
          <span className="adm-nav-label">Student Verification</span>
          <span className="adm-nav-badge amber">12</span>
        </NavLink>

        {/* ACADEMICS & CONFIG */}
        <div className="adm-nav-section">Academics &amp; Config</div>

        <NavLink
          to="/admin-dashboard/course-config"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><SettingsIcon /></span>
          <span className="adm-nav-label">Course Setup</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/trainer-approval"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><TrainerIcon /></span>
          <span className="adm-nav-label">Trainer Approvals</span>
          <span className="adm-nav-badge green">3</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/batch-setup"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><CalendarIcon /></span>
          <span className="adm-nav-label">Batch Management</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/enrollment"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><LinkIcon /></span>
          <span className="adm-nav-label">Enrolment Mapping</span>
        </NavLink>

        {/* SYSTEM */}
        <div className="adm-nav-section">System</div>

        <NavLink
          to="/admin-dashboard/analytics"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><ChartIcon /></span>
          <span className="adm-nav-label">Analytics &amp; Monitoring</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/activation"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><BookIcon /></span>
          <span className="adm-nav-label">Learning Activation</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/reports"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><ReportIcon /></span>
          <span className="adm-nav-label">Reports &amp; Logs</span>
        </NavLink>

      </nav>

      {/* ── Footer / Logout ── */}
      <div className="adm-sidebar-footer">
        <NavLink to="/admin-dashboard/logout" className="adm-logout-btn">
          <LogoutIcon />
          <span>Logout</span>
        </NavLink>
      </div>

    </aside>
  );
};

export default Sidebar;