import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import "./Sidebar.css";
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';

import {
  LayoutDashboard,
  UserCheck,
  Settings2,
  UserPlus,
  CalendarDays,
  Link2,
  BarChart3,
  Zap,
  FileText,
  LogOut,
  ChevronDown,
  Library
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = loggedUser.fullName || loggedUser.fullname || loggedUser.username || "Admin";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'A';
  const profileImage = loggedUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff&size=150`;

  const isSettingsActive = location.pathname.includes('/settings/');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <aside className="admin-sidebar" id="admin-sidebar">

      {/* ── Admin User Card ── */}
      <div className="adm-user-card">
        <div className="adm-user-avatar">
          <img src={profileImage} alt="Profile" className="adm-user-avatar-img" />
        </div>
        <div className="adm-user-info">
          <div className="adm-user-name">{userName}</div>
          <div className="adm-user-role">
            Web Developer
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="adm-nav-body">

        {/* CORE OPERATIONS */}
        {/* <div className="adm-nav-section">Core Operations</div> */}

        <NavLink
          to="/admin-dashboard/dashboard"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><LayoutDashboard size={22} /></span>
          <span className="adm-nav-label">Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/student-verification"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><UserCheck size={22} /></span>
          <span className="adm-nav-label">Student Verification</span>
          <span className="adm-nav-badge amber">12</span>
        </NavLink>

        {/* ACADEMICS & CONFIG */}
        {/* <div className="adm-nav-section">Academics &amp; Config</div> */}

        <NavLink
          to="/admin-dashboard/course-config"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><Library size={22} /></span>
          <span className="adm-nav-label">Course Management</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/trainer-approval"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><UserPlus size={22} /></span>
          <span className="adm-nav-label">Trainer Approvals</span>
          <span className="adm-nav-badge green">3</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/batch-setup"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><CalendarDays size={22} /></span>
          <span className="adm-nav-label">Batch Management</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/enrollment"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><Link2 size={22} /></span>
          <span className="adm-nav-label">Enrolment Mapping</span>
        </NavLink>

        {/* SYSTEM */}
        {/* <div className="adm-nav-section">System</div> */}

        <NavLink
          to="/admin-dashboard/analytics"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><BarChart3 size={22} /></span>
          <span className="adm-nav-label">Analytics &amp; Monitoring</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/activation"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><Zap size={22} /></span>
          <span className="adm-nav-label">Learning Activation</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/reports"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><FileText size={22} /></span>
          <span className="adm-nav-label">Reports &amp; Logs</span>
        </NavLink>

        {/* SETTINGS */}
        <div className="adm-nav-section" style={{ marginTop: '20px', fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', padding: '0 12px' }}>Account Settings</div>

        <NavLink
          to="/admin-dashboard/settings/account"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><Settings2 size={22} /></span>
          <span className="adm-nav-label">Profile Info</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/settings/security"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><Settings2 size={22} /></span>
          <span className="adm-nav-label">Security</span>
        </NavLink>

        <NavLink
          to="/admin-dashboard/settings/preferences"
          className={({ isActive }) => `adm-nav-item${isActive ? ' active' : ''}`}
        >
          <span className="adm-nav-icon"><Settings2 size={22} /></span>
          <span className="adm-nav-label">Preferences</span>
        </NavLink>
      </nav>

      {/* ── Footer / Logout ── */}
      <div className="adm-sidebar-footer">
        <button onClick={() => setShowLogoutModal(true)} className="adm-logout-btn" style={{border: 'none', background: 'transparent', width: '100%', cursor: 'pointer'}}>
          <LogOut size={22} />
          <span>Logout</span>
        </button>
      </div>

      {/* ── BLUE LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutModal && (
        <div className="adm-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="adm-modal-card" onClick={e => e.stopPropagation()}>

            {/* Profile Photo at top */}
            <div className="adm-modal-profile-wrap">
              <img src={profileImage} alt="User" />
            </div>

            <h2 className="adm-modal-title">Are you sure you want to logout?</h2>
            <p className="adm-modal-subtitle">You will be redirected to the main page.</p>

            <div className="adm-modal-actions">
              <button className="adm-modal-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="adm-modal-logout" onClick={handleLogout}>
                OK
              </button>
            </div>

          </div>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;