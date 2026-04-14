import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = loggedUser.fullName || loggedUser.fullname || loggedUser.username || "Admin";
  const userInitial = userName ? userName.charAt(0).toUpperCase() : 'A';

  const isSettingsActive = location.pathname.includes('/settings/');

  return (
    <aside className="admin-sidebar" id="admin-sidebar">

      {/* ── Admin User Card ── */}
      <div className="adm-user-card">
        <div className="adm-user-avatar">
          <img src={loggedUser.profileImage || "https://i.pravatar.cc/150?img=5"} alt="Profile" className="adm-user-avatar-img" />
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

      </nav>

      {/* ── Footer / Logout ── */}
      <div className="adm-sidebar-footer">
        <NavLink to="/admin-dashboard/logout" className="adm-logout-btn">
          <LogOut size={22} />
          <span>Logout</span>
        </NavLink>
      </div>

    </aside>
  );
};

export default Sidebar;