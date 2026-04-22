import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import "./Sidebar.css";

/* ── Custom SVG Icons ── */
const DashboardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
  </svg>
);
const UserCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" />
  </svg>
);
const LibraryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" />
  </svg>
);
const UserPlusIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="17" y1="11" x2="23" y2="11" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const LinkIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const ChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);
const ZapIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const FileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);
const LogOutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const Sidebar = ({ isCollapsed, externalShowLogoutModal, setExternalShowLogoutModal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = loggedUser.fullName || loggedUser.fullname || loggedUser.username || "Admin";

  const [internalShowLogoutModal, setInternalShowLogoutModal] = useState(false);
  
  // Sync internal modal state with external (for browser back button)
  useEffect(() => {
    if (externalShowLogoutModal) setInternalShowLogoutModal(true);
  }, [externalShowLogoutModal]);

  const [profileImage, setProfileImage]         = useState(loggedUser.profileImage || "https://i.pravatar.cc/150?img=5");
  const [currentUserName, setCurrentUserName]   = useState(userName);
  const [currentUserRole, setCurrentUserRole]   = useState(loggedUser.role || "TRAINER");

  useEffect(() => {
    const syncProfile = () => {
      const updated = JSON.parse(localStorage.getItem("user") || "{}");
      setProfileImage(updated.profileImage || "https://i.pravatar.cc/150?img=5");
      setCurrentUserName(updated.fullName || updated.fullname || updated.username || "Admin");
      setCurrentUserRole(updated.role || "TRAINER");
    };
    window.addEventListener('storage', syncProfile);
    window.addEventListener('adminProfileUpdate', syncProfile);
    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('adminProfileUpdate', syncProfile);
    };
  }, []);

  return (
    <>
      <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`} id="admin-sidebar">

        {/* ── Admin User Card ── */}
        <div
          className="adm-user-card"
          onClick={() => navigate('/admin-dashboard/profile')}
          style={{ cursor: 'pointer' }}
          title="View Profile"
        >
          <div className="adm-user-avatar">
            <img src={profileImage} alt="Profile" className="adm-user-avatar-img" />
          </div>
          {!isCollapsed && (
            <div className="adm-user-info">
              <div className="adm-user-name">
                {currentUserName}
                <span className="adm-user-status-dot"></span>
              </div>
              <div className="adm-user-role">
                {currentUserRole}
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation ── */}
        <nav className="adm-nav-body">

          <NavLink to="/admin-dashboard/dashboard" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`} title="Dashboard" data-tooltip="Dashboard">
            <span className="adm-nav-icon"><DashboardIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Dashboard</span>}
          </NavLink>

          <NavLink to="/admin-dashboard/student-verification" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`} title="Student Verification" data-tooltip="Student Verification">
            <span className="adm-nav-icon"><UserCheckIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Student Verification</span>}
            {!isCollapsed && <span className="adm-nav-badge amber">12</span>}
          </NavLink>

          <NavLink to="/admin-dashboard/course-config" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`} title="Course Management" data-tooltip="Course Management">
            <span className="adm-nav-icon"><LibraryIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Course Management</span>}
          </NavLink>

          <NavLink to="/admin-dashboard/trainer-approval" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`} title="Trainer Approvals" data-tooltip="Trainer Approvals">
            <span className="adm-nav-icon"><UserPlusIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Trainer Approvals</span>}
            {!isCollapsed && <span className="adm-nav-badge green">3</span>}
          </NavLink>

          <NavLink to="/admin-dashboard/batch-setup" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`} title="Batch Management" data-tooltip="Batch Management">
            <span className="adm-nav-icon"><CalendarIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Batch Management</span>}
          </NavLink>

          <NavLink to="/admin-dashboard/enrollment" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`} title="Enrolment Mapping" data-tooltip="Enrolment Mapping">
            <span className="adm-nav-icon"><LinkIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Enrolment Mapping</span>}
          </NavLink>

          <NavLink to="/admin-dashboard/analytics" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}>
            <span className="adm-nav-icon"><ChartIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Analytics &amp; Monitoring</span>}
          </NavLink>

          <NavLink to="/admin-dashboard/activation" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}>
            <span className="adm-nav-icon"><ZapIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Learning Activation</span>}
          </NavLink>

          <NavLink to="/admin-dashboard/reports" className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}>
            <span className="adm-nav-icon"><FileIcon /></span>
            {!isCollapsed && <span className="adm-nav-label">Reports &amp; Logs</span>}
          </NavLink>

        </nav>

        {/* ── Footer / Logout ── */}
        <div className="adm-sidebar-footer">
          <button className="adm-logout-btn" onClick={() => setInternalShowLogoutModal(true)}>
            <LogOutIcon />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>

      {/* ── Logout Confirmation Modal ── */}
      {internalShowLogoutModal && (
        <div className="adm-logout-overlay" onClick={() => { setInternalShowLogoutModal(false); setExternalShowLogoutModal?.(false); }}>
          <div className="adm-logout-modal" onClick={e => e.stopPropagation()}>
            {/* Profile Image */}
            <div className="adm-logout-photo-section">
              <img
                src={profileImage}
                alt="Profile"
                className="adm-logout-photo-img"
              />
            </div>

            {/* Message */}
            <h2 className="adm-logout-title">Are you sure you want to logout?</h2>
            <p className="adm-logout-subtitle">You will be redirected to the sign in page.</p>

            {/* Actions */}
            <div className="adm-logout-actions">
              <button className="adm-logout-cancel" onClick={() => { setInternalShowLogoutModal(false); setExternalShowLogoutModal?.(false); }}>Cancel</button>
              <button className="adm-logout-confirm" onClick={() => {
                localStorage.clear();
                setInternalShowLogoutModal(false);
                setExternalShowLogoutModal?.(false);
                navigate("/student/login");
              }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;