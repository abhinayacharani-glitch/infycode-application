import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useLocation, NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import './Topbar.css';

import icLogo from '../../../assets/infycode-final-logo4-1.png';
import logoDark from '../../../assets/color-logo-3.png';

/* ── SVG Icons ── */
const MenuToggleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#606d80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#606d80">
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
  </svg>
);

const BellSolidIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#606d80">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#606d80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#606d80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);


const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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

  const navigate = useNavigate();

  const [liveDate, setLiveDate] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(userName);
  const [userProfileImage, setUserProfileImage] = useState(user?.profileImage || "https://i.pravatar.cc/150?img=5");

  useEffect(() => {
    const syncProfile = () => {
      const updated = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUserName(updated.fullName || updated.fullname || updated.username || "Admin");
      setUserProfileImage(updated.profileImage || "https://i.pravatar.cc/150?img=5");
    };
    window.addEventListener('storage', syncProfile);
    window.addEventListener('adminProfileUpdate', syncProfile);
    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('adminProfileUpdate', syncProfile);
    };
  }, []);

  const handleLogoutConfirm = () => {
    localStorage.clear();
    navigate('/');
  };

  // Sample Messages
  const [messages] = useState([
    { id: 1, sender: "Arjun Kumar", text: "I have updated the course curriculum...", time: "2m ago", unread: true },
    { id: 2, sender: "Sneha Patel", text: "Can we schedule a meeting for batch B4?", time: "1h ago", unread: true },
    { id: 3, sender: "Rahul Sharma", text: "New enrollment request received.", time: "3h ago", unread: false }
  ]);

  const msgRef = useRef(null);
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
      if (msgRef.current && !msgRef.current.contains(e.target)) setShowMessages(false);
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

      {/* ── Brand / Logo ── */}
      <div className="adm-brand-section-tb">
        <div className="adm-logo-container" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
          <img
            src={icLogo}
            alt="InfyCode Logo"
            className="adm-logo-img"
          />
          <div className="adm-brand-text">
            <img src={logoDark} alt="InfyCode Banner" className="adm-title-img" />
          </div>
        </div>
      </div>

      <div className="tb-divider-vert" />

      {/* ── New Left Items (Badges, Search) ── */}
      <div className="tb-left-aligned">

        <div className={`tb-search-box-new ${searchFocused ? 'focused' : ''}`}>
          <span className="tb-search-icon-new"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search & Enter"
            className="tb-search-input-new"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      <div className="tb-spacer" style={{ flex: 1 }}></div>

      {/* ── Right Items (User Profile) ── */}
      <div className="tb-right-aligned">
        <div className="tb-icon-badge-wrap" style={{ marginRight: '24px' }}>
          <div className="tb-icon-box" ref={notifRef} onClick={() => setShowNotifications(!showNotifications)}>
            <BellSolidIcon />
            <span className="tb-badge orange">{notifications.filter(n => !n.read).length}</span>
            {showNotifications && (
              <div className="tb-dropdown modern">
                <div className="tb-dropdown-header">Notifications</div>
                <div className="tb-dropdown-list">
                  {notifications.map(n => (
                    <div className={`tb-dropdown-item ${!n.read ? 'unread' : ''}`} key={n.id}>
                      <div className="tb-item-icon"><NotifIcon type={n.type} /></div>
                      <div className="tb-item-content">
                        <div className="tb-item-title">{n.title}</div>
                        <div className="tb-item-text">{n.text}</div>
                        <div className="tb-item-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tb-dropdown-footer" onClick={markAllRead}>Mark all as read</div>
              </div>
            )}
          </div>
          <div className="tb-icon-box" ref={msgRef} onClick={() => setShowMessages(!showMessages)}>
            <EnvelopeIcon />
            <span className="tb-badge teal">{messages.filter(m => m.unread).length}</span>
            {showMessages && (
              <div className="tb-dropdown modern">
                <div className="tb-dropdown-header">Messages</div>
                <div className="tb-dropdown-list">
                  {messages.map(m => (
                    <div className={`tb-dropdown-item ${m.unread ? 'unread' : ''}`} key={m.id}>
                      <div className="tb-item-avatar">{m.sender.charAt(0)}</div>
                      <div className="tb-item-content">
                        <div className="tb-item-sender">{m.sender}</div>
                        <div className="tb-item-text">{m.text}</div>
                        <div className="tb-item-time">{m.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tb-dropdown-footer">View All Messages</div>
              </div>
            )}
          </div>
        </div>
        <div className="tb-user-profile-new" ref={userMenuRef} onClick={() => setShowUserMenu(!showUserMenu)}>
          <img src={userProfileImage} alt={currentUserName} className="tb-user-avatar-new" />
          <span className="tb-user-name-new">
            {currentUserName}
            <span className="tb-chevron-new"><ChevronDownIcon /></span>
          </span>
          {showUserMenu && (
            <div className="tb-user-dropdown">
              <div className="tb-user-dropdown-header">
                <img src={userProfileImage} alt={currentUserName} className="tb-udrop-avatar" />
                <div>
                  <div className="tb-udrop-name">{currentUserName}</div>
                  <div className="tb-udrop-role">{user?.role || 'Administrator'}</div>
                </div>
              </div>
              <div className="tb-user-dropdown-divider" />
              <button className="tb-udrop-item" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); navigate('/admin-dashboard/profile'); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                My Profile
              </button>
              <div className="tb-user-dropdown-divider" />
              <button className="tb-udrop-item tb-udrop-logout" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); setShowLogoutModal(true); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Logout modal rendered via portal to blur sidebar too */}
      {showLogoutModal && ReactDOM.createPortal(
        <div className="tb-logout-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="tb-logout-modal" onClick={e => e.stopPropagation()}>
            <div className="tb-logout-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h2 className="tb-logout-title">Logout</h2>
            <p className="tb-logout-msg">Are you sure you want to log out?</p>
            <div className="tb-logout-actions">
              <button className="tb-logout-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="tb-logout-ok" onClick={handleLogoutConfirm}>OK, Logout</button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </header>
  );
};

export default Topbar;
