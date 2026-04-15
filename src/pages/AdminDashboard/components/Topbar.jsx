import React, { useState, useEffect, useRef } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import './Topbar.css';

import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';

/* ── SVG Icons ── */
const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Notification icon resolver ── */
const NotifIcon = ({ type }) => {
  if (type === 'success') return <CheckCircleIcon />;
  if (type === 'warning') return <AlertIcon />;
  return <InfoIcon />;
};

/* ── Page meta map ── */
const PAGE_META = {
  dashboard:              { title: 'Admin Dashboard',       sub: 'System overview and key metrics' },
  'student-verification': { title: 'Student Verification',  sub: 'Manage registration approvals' },
  'course-config':        { title: 'Course Management',     sub: 'New Courses creation' },
  'trainer-approval':     { title: 'Trainer Approvals',     sub: 'Onboard and assign new trainers' },
  'batch-setup':          { title: 'Batch Management',      sub: 'Configure and schedule training batches' },
  enrollment:             { title: 'Enrolment Mapping',     sub: 'Map students to courses and batches' },
  analytics:              { title: 'Analytics & Monitoring',sub: 'System performance overview' },
  activation:             { title: 'Learning Activation',   sub: 'Manage active learning modules' },
  reports:                { title: 'Reports & Logs',        sub: 'System performance and data export' },
};

const Topbar = () => {
  const { notifications, markNotificationRead } = useAdmin();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.fullname || user.fullName || 'Admin';
  const userInitial = userName.charAt(0).toUpperCase();

  const location = useLocation();
  const activePage = location.pathname.split('/').pop() || 'dashboard';
  const { title, sub } = PAGE_META[activePage] || { title: 'Admin Portal', sub: `Welcome, ${userName}.` };

  const [liveDate, setLiveDate] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showLogoLogoutModal, setShowLogoLogoutModal] = useState(false);
  
  const navigate = useNavigate();
  
  const handleLogoLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    navigate('/');
  };

  const notifRef = useRef(null);
  const settingsRef = useRef(null);
  const userMenuRef = useRef(null);

  /* Live clock — date only */
  useEffect(() => {
    const update = () => {
      setLiveDate(new Date().toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      }));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  /* Click-outside handler */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    notifications.forEach((n) => { if (!n.read) markNotificationRead(n.id); });
  };

  return (
    <header className="tb-root">

      {/* ── Brand / Logo (Moved from Sidebar) ── */}
      <div className="adm-brand-section-tb">
        <div className="adm-logo-container" onClick={() => setShowLogoLogoutModal(true)} style={{cursor: 'pointer'}}>
          <img
            src={icLogo}
            alt="InfyCode Logo"
            className="adm-logo-img"
          />
          <div className="adm-brand-text">
            <img src={bannerLogo} alt="InfyCode Banner" className="adm-title-img" />
          </div>
        </div>
      </div>

      <div className="tb-divider-vert" />

      {/* ── Left: breadcrumb + title ── */}
      <div className="tb-left">
        {/* <div className="tb-breadcrumb">
          <span className="tb-breadcrumb-home">Admin</span>
          <span className="tb-breadcrumb-sep">/</span>
          <span className="tb-breadcrumb-current">{title}</span>
        </div> */}
        <div className="tb-title-row">
          <h1 className="tb-title">{title}</h1>
        </div>
        <p className="tb-sub">{sub}</p>
      </div>

      {/* ── Right: actions ── */}
      <div className="tb-right">

        {/* Search */}
        <div className={`tb-search ${searchFocused ? 'focused' : ''}`}>
          <span className="tb-search-icon"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search anything..."
            className="tb-search-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchValue && (
            <button className="tb-search-clear" onClick={() => setSearchValue('')}>
              <CloseIcon />
            </button>
          )}
          {/* <kbd className="tb-search-kbd">⌘K</kbd> */}
        </div>

        {/* Date chip */}
        <div className="tb-date-chip">{liveDate}</div>

        <div className="tb-divider" />

        {/* Notification bell */}
        <div className="tb-notif-wrap" ref={notifRef}>
          <button
            className={`tb-icon-btn ${showNotifications ? 'active' : ''}`}
            title="Notifications"
            onClick={() => setShowNotifications((p) => !p)}
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="tb-notif-dot">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          {showNotifications && (
            <div className="tb-notif-dropdown">
              <div className="tb-notif-hdr">
                <div className="tb-notif-hdr-left">
                  <span className="tb-notif-hdr-title">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="tb-notif-badge">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button className="tb-notif-mark-all" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="tb-notif-list">
                {notifications.length === 0 ? (
                  <div className="tb-notif-empty">
                    <div className="tb-notif-empty-icon"><BellIcon /></div>
                    <p>You're all caught up!</p>
                    <span>No new notifications right now</span>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`tb-notif-item ${!n.read ? 'unread' : ''} ${n.type || 'info'}`}
                      onClick={() => markNotificationRead(n.id)}
                    >
                      <div className={`tb-notif-icon-wrap type-${n.type || 'info'}`}>
                        <NotifIcon type={n.type} />
                      </div>
                      <div className="tb-notif-body">
                        <p className="tb-notif-msg">{n.message}</p>
                        <span className="tb-notif-time">{n.time}</span>
                      </div>
                      {!n.read && <span className="tb-notif-unread-pip" />}
                    </div>
                  ))
                )}
              </div>

              <div className="tb-notif-footer">
                <button className="tb-notif-view-all" onClick={() => setShowNotifications(false)}>
                  View all alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="tb-settings-wrap" ref={settingsRef}>
          <button 
            className={`tb-icon-btn ${showSettings ? 'active' : ''}`} 
            title="Settings"
            onClick={() => setShowSettings((p) => !p)}
          >
            <SettingsIcon />
          </button>
          
          {showSettings && (
            <div className="tb-settings-dropdown">
              <NavLink to="/admin-dashboard/settings/account" className="tb-settings-item">
                Account setting
              </NavLink>
              <NavLink to="/admin-dashboard/settings/security" className="tb-settings-item">
                Security
              </NavLink>
              <NavLink to="/admin-dashboard/settings/preferences" className="tb-settings-item">
                Global Preferences
              </NavLink>
            </div>
          )}
        </div>

        

        {/* User menu */}
        <div className="tb-user-wrap" ref={userMenuRef}>
         

          {showUserMenu && (
            <div className="tb-user-dropdown">
              
            </div>
          )}
        </div>

      </div>
      
      {/* ── RED LOGOUT CONFIRMATION MODAL ── */}
      {showLogoLogoutModal && (
        <div className="adm-modal-overlay" onClick={() => setShowLogoLogoutModal(false)}>
          <div className="adm-modal-card" onClick={e => e.stopPropagation()}>

            <div className="adm-red-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>

            <h2 className="adm-modal-title">Logout</h2>
            <p className="adm-modal-subtitle">Are you sure you want to log out?</p>

            <div className="adm-modal-actions">
              <button className="adm-modal-out-cancel" onClick={() => setShowLogoLogoutModal(false)}>
                Cancel
              </button>
              <button className="adm-modal-out-ok" onClick={handleLogoLogout}>
                OK, Logout
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Topbar;
