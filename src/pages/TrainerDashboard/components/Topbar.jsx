import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../context/TrainerContext';
import { LogOut } from 'lucide-react';
import './Topbar.css';

import icLogo from '../../../assets/infycode-final-logo4-1.png';

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

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trainerData, profileImage } = useTrainer();

  const userName = trainerData.fullname || trainerData.name || 'Trainer';
  const role = trainerData.role || 'Trainer';
  const userInitial = userName.charAt(0).toUpperCase();

  // State
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalType, setModalType] = useState('user-menu'); // 'user-menu' or 'brand-logo'
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Dummy Data for Trainer
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'Session Reminder', text: 'React Basics starts in 15 mins', time: '10m ago', read: false },
    { id: 2, type: 'success', title: 'Attendance Marked', text: 'Batch B2 attendance updated.', time: '2h ago', read: false }
  ]);
  const [messages] = useState([
    { id: 1, sender: "Admin", text: "Please submit last week's reports.", time: "1h ago", unread: true },
    { id: 2, sender: "Student Council", text: "Doubt clearing session requested.", time: "4h ago", unread: false }
  ]);

  const msgRef = useRef(null);
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  /* Click-outside handler */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (msgRef.current && !msgRef.current.contains(e.target)) setShowMessages(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loggedUser");
    localStorage.removeItem("trainerProfileImage");
    setShowLogoutModal(false);
    navigate('/'); // Redirect to landing page
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="tb-root">
      {/* ── Brand / Logo ── */}
      <div className="adm-brand-section-tb">
        <div 
          className="brand-wrapper" 
          onClick={() => { setModalType('brand-logo'); setShowLogoutModal(true); }} 
          style={{ cursor: 'pointer' }}
          title="Logout"
        >
          <img src={icLogo} alt="Infycode Logo" className="logo" />
          <div className="brand-text">
            <span className="logo-title">INFYCODE</span>
            <span className="logo-subtitle">Infinite Learning Solutions</span>
          </div>
        </div>
      </div>

      {/* ── Search Bar (Center) ── */}
      <div className="tb-left-aligned">
        {/* Search removed as per request */}
      </div>

      <div className="tb-spacer" style={{ flex: 1 }}></div>

      {/* ── Right Items (User Profile + Icons) ── */}
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
          <img src={profileImage || "https://i.pravatar.cc/150?img=5"} alt={userName} className="tb-user-avatar-new" />
          {showUserMenu && (
            <div className="tb-user-dropdown">
              <div className="tb-user-dropdown-header">
                <img src={profileImage || "https://i.pravatar.cc/150?img=5"} alt={userName} className="tb-udrop-avatar" />
                <div>
                  <div className="tb-udrop-name">{userName}</div>
                  <div className="tb-udrop-role">{role}</div>
                </div>
              </div>
              <div className="tb-user-dropdown-divider" />
              <button className="tb-udrop-item" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); navigate('/trainer-dashboard/profile'); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                My Profile
              </button>
              <div className="tb-user-dropdown-divider" />
              <button className="tb-udrop-item tb-udrop-logout" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); setModalType('user-menu'); setShowLogoutModal(true); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRMATION MODAL SC-UI (Conditional based on Trigger Source) */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          {modalType === 'brand-logo' ? (
            /* BRAND-SPECIFIC LOGOUT MODAL (Matching LogoutModal.jsx code) */
            <div className="logout-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="logout-icon-circle">
                <LogOut size={28} strokeWidth={2.5} />
              </div>
              <h2 className="logout-modal-title">Logout</h2>
              <p className="logout-modal-subtitle">Are you sure you want to log out?</p>
              <div className="logout-modal-button-group">
                <button className="logout-modal-cancel-btn" onClick={() => setShowLogoutModal(false)}>
                  Cancel
                </button>
                <button className="logout-modal-confirm-btn" onClick={handleLogout}>
                  OK, Logout
                </button>
              </div>
            </div>
          ) : (
            /* USER-SPECIFIC LOGOUT MODAL (Matching Sidebar style) */
            <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="logout-modal-profile-section">
                <div className="logout-modal-avatar">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="tb-user-avatar-new" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    userInitial
                  )}
                </div>
                <h3>{userName}</h3>
              </div>

              <div className="logout-modal-message-section">
                <h2>Are you sure you want to logout?</h2>
                <p>You will be redirected to the trainer login page.</p>
              </div>

              <div className="logout-modal-button-group">
                <button className="logout-modal-cancel-btn" onClick={() => setShowLogoutModal(false)}>
                  Cancel
                </button>
                <button className="logout-modal-ok-btn" onClick={handleLogout}>
                  OK
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Topbar;


