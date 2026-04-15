import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Topbar.css';
import LogoutModal from './LogoutModal';
import icLogo from '../../../assets/infycode-final-logo4-1.png';

// ✅ Icons
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

// Route → page label map
const PAGE_LABELS = {
  '/trainer-dashboard/dashboard':  { name: 'Dashboard',       sub: 'Overview of your training activities' },
  '/trainer-dashboard/profile':    { name: 'My Profile',      sub: 'View and update your trainer profile' },
  '/trainer-dashboard/batches':    { name: 'Batches',         sub: 'Manage your assigned training batches' },
  '/trainer-dashboard/schedule':   { name: 'Schedule',        sub: 'View and plan your teaching schedule' },
  '/trainer-dashboard/materials':  { name: 'Course Materials',sub: 'Upload and manage course content' },
  '/trainer-dashboard/attendance': { name: 'Attendance',      sub: 'Track student attendance records' },
  '/trainer-dashboard/feedback':   { name: 'Feedback & Ratings', sub: 'Review student feedback and ratings' },
};

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [liveDate] = useState(() => {
    const d = new Date();
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const day = d.getDate();
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${weekday}, ${day} ${month}, ${year}`;
  });

  const currentPage = PAGE_LABELS[location.pathname] || { name: 'Dashboard', sub: 'Overview of your training activities' };

  return (
    <nav className="navbar">
      {/* NAVBAR LEFT: BRAND SECTION + TITLES */}
      <div className="navbar-content-left">
        <div 
          className="brand-wrapper" 
          onClick={() => setShowLogoutModal(true)} 
          style={{ cursor: 'pointer' }}
          title="Logout"
        >
          <img src={icLogo} alt="Infycode Logo" className="logo" />
          <div className="brand-text">
            <span className="brand-name">INFYCODE</span>
            <span className="brand-tagline">Infinite Learning Solutions</span>
          </div>
        </div>

        <div className="nav-separator"></div>

        <div className="nav-info-section">
          <div className="nav-breadcrumb-trail">
            <span className="breadcrumb-root">Trainer</span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-current">{currentPage.name}</span>
          </div>
          <h1 className="navbar-main-title">Trainer Dashboard</h1>
          <p className="navbar-page-sub">{currentPage.sub}</p>
        </div>
      </div>

      {/* NAVBAR RIGHT: SEARCH + ACTIONS */}
      <div className="navbar-actions-right">
        <div className="search-container">
          <span className="search-icon"><SearchIcon /></span>
          <input type="text" placeholder="Search anything..." className="search-input" />
        </div>

        <div className="date-pill">{liveDate}</div>

        <button className="icon-utility" aria-label="Notifications">
          <BellIcon />
          <span className="notif-badge">2</span>
        </button>

        <button className="icon-utility" aria-label="Settings">
          <SettingsIcon />
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
      />
    </nav>
  );
};

export default Topbar;
