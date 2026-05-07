import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../context/TrainerContext';
import { LogOut, User } from 'lucide-react';
import { io } from 'socket.io-client';
import './Topbar.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


import icLogo from '../../../assets/infycode-final-logo4-1.png';
import {
  getTrainerNotificationsAPI,
  markTrainerNotificationsReadAPI,
  deleteTrainerNotificationAPI,
  seedTrainerNotificationsAPI,
} from '../../../services/api';

/* ─── SVG Icon Components ─────────────────────────────────────────────── */
const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#606d80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const StudentIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const BellIcon = ({ hasUnread }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={hasUnread ? '#2563eb' : 'none'} stroke={hasUnread ? '#2563eb' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
);

/* ─── Notification type → icon + colour map ──────────────────────────── */
const notifConfig = {
  success: { Icon: CheckCircleIcon, bg: '#dcfce7', color: '#16a34a', label: 'Admin' },
  warning: { Icon: AlertIcon, bg: '#fef3c7', color: '#d97706', label: 'Admin' },
  student: { Icon: StudentIcon, bg: '#ede9fe', color: '#7c3aed', label: 'Student' },
  info: { Icon: InfoIcon, bg: '#dbeafe', color: '#2563eb', label: 'Admin' },
};

const getConfig = (type) => notifConfig[type] || notifConfig.info;

/* ─── Time formatter ─────────────────────────────────────────────────── */
const formatTime = (createdAt) => {
  if (!createdAt) return '';
  const diff = Date.now() - createdAt;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

/* ══════════════════════════════════════════════════════════════════════ */
const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trainerData, profileImage, notifications, setNotifications, fetchTrainerNotifications } = useTrainer();

  const userName = trainerData.fullName || trainerData.fullname || trainerData.name || 'Trainer';
  const role = trainerData.role || 'Trainer';
  const userInitial = userName.charAt(0).toUpperCase();

  /* ── UI state ── */
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalType, setModalType] = useState('user-menu');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState(null);

  /* ── Refs for click-outside ── */
  const notifRef = useRef(null);
  const userMenuRef = useRef(null);

  /* ── Fetch notifications ─────────────────────────────────────────── */
  const handleRefresh = async () => {
    setNotifLoading(true);
    setNotifError(null);
    try {
      await fetchTrainerNotifications();
    } catch (err) {
      setNotifError('Could not load notifications');
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch handled by Context Provider
  }, []);



  /* ── Click-outside handler ───────────────────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Derived counts ─────────────────────────────────────────────── */
  const unreadCount = notifications.filter(n => !n.read).length;

  /* ── Handlers ───────────────────────────────────────────────────── */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('trainerProfileImage');
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleMarkAllRead = async () => {
    try {
      await markTrainerNotificationsReadAPI(null); // null = mark all
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('[Topbar] markAllRead error:', err.message);
    }
  };

  const handleMarkOneRead = async (notif) => {
    if (notif.read) return;
    try {
      await markTrainerNotificationsReadAPI(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('[Topbar] markOneRead error:', err.message);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteTrainerNotificationAPI(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('[Topbar] delete error:', err.message);
    }
  };

  const handleBellClick = () => {
    setShowNotifications(prev => !prev);
    setShowUserMenu(false);
  };

  /* ════════════════════════════════════════════════════════════════ */
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

      {/* ── Centre spacer ── */}
      <div className="tb-left-aligned" />
      <div className="tb-spacer" style={{ flex: 1 }} />

      {/* ── Right: Bell + Profile ── */}
      <div className="tb-right-aligned" style={{ gap: '10px' }}>

        {/* ════ BELL NOTIFICATION BUTTON ════ */}
        <div className="tb-notif-wrapper" ref={notifRef}>
          <button
            id="trainer-notif-bell"
            className={`tb-bell-btn ${showNotifications ? 'active' : ''}`}
            onClick={handleBellClick}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <BellIcon hasUnread={unreadCount > 0} />
            {unreadCount > 0 && (
              <span className="tb-bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {/* ── Notification Dropdown Panel ── */}
          {showNotifications && (
            <div className="tb-notif-panel" role="dialog" aria-label="Notifications">

              {/* Panel Header */}
              <div className="tb-notif-panel-header">
                <div className="tb-notif-panel-title">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="tb-notif-count-pill">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button className="tb-notif-mark-all" onClick={handleMarkAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              {/* Filter tabs (visual only) */}
              <div className="tb-notif-tabs">
                <span className="tb-notif-tab active">All</span>
              </div>


              {/* Notification list */}
              <div className="tb-notif-list">
                {notifLoading && (
                  <div className="tb-notif-empty">
                    <div className="tb-notif-spinner" />
                    <span>Loading notifications…</span>
                  </div>
                )}

                {!notifLoading && notifError && (
                  <div className="tb-notif-empty tb-notif-error">
                    <span>⚠ {notifError}</span>
                    <button onClick={handleRefresh} className="tb-notif-retry">Retry</button>
                  </div>
                )}

                {!notifLoading && !notifError && notifications.length === 0 && (
                  <div className="tb-notif-empty">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span>No notifications yet</span>
                  </div>
                )}

                {!notifLoading && !notifError && notifications.map((notif) => {
                  const cfg = getConfig(notif.type);
                  return (
                    <div
                      key={notif.id}
                      className={`tb-notif-item ${notif.read ? '' : 'unread'}`}
                      onClick={() => handleMarkOneRead(notif)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && handleMarkOneRead(notif)}
                    >
                      {/* Unread dot */}
                      {!notif.read && <span className="tb-notif-unread-dot" />}

                      {/* Icon avatar */}
                      <div className="tb-notif-icon-wrap" style={{ background: cfg.bg }}>
                        <cfg.Icon />
                      </div>

                      {/* Content */}
                      <div className="tb-notif-content">
                        <div className="tb-notif-sender-row">
                          <span
                            className="tb-notif-sender-badge"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            {notif.senderRole === 'student' ? '🎓 Student' : '🛡 Admin'}
                          </span>
                          <span className="tb-notif-time">{formatTime(notif.createdAt)}</span>
                        </div>
                        <div className="tb-notif-title">{notif.title}</div>
                        <div className="tb-notif-text">{notif.text}</div>
                        {notif.senderName && notif.senderName !== 'System' && (
                          <div className="tb-notif-from">— {notif.senderName}</div>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        className="tb-notif-delete-btn"
                        onClick={(e) => handleDelete(e, notif.id)}
                        aria-label="Delete notification"
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Panel Footer */}
              {notifications.length > 0 && (
                <div className="tb-notif-panel-footer">
                  <button
                    className="tb-notif-refresh-btn"
                    onClick={handleRefresh}
                  >
                    ↻ Refresh
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ════ USER PROFILE ════ */}
        <div className="tb-user-profile-new" ref={userMenuRef} onClick={() => setShowUserMenu(!showUserMenu)}>
          {profileImage ? (
            <img src={profileImage} alt={userName} className="tb-user-avatar-new" />
          ) : (
            <div className="tb-avatar-initial" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
          )}
          {showUserMenu && (
            <div className="tb-user-dropdown">
              <div className="tb-user-dropdown-header">
                {profileImage ? (
                  <img src={profileImage} alt={userName} className="tb-udrop-avatar" />
                ) : (
                  <div className="tb-udrop-avatar tb-avatar-initial-small" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} /></div>
                )}
                <div>
                  <div className="tb-udrop-name">{userName}</div>
                  <div className="tb-udrop-role">{role}</div>
                </div>
              </div>
              <div className="tb-user-dropdown-divider" />
              <button className="tb-udrop-item" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); navigate('/trainer-dashboard/profile'); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                My Profile
              </button>
              <div className="tb-user-dropdown-divider" />
              <button className="tb-udrop-item tb-udrop-logout" onClick={(e) => { e.stopPropagation(); setShowUserMenu(false); setModalType('user-menu'); setShowLogoutModal(true); }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Logout Modal ── */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          {modalType === 'brand-logo' ? (
            <div className="logout-modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="logout-icon-circle">
                <LogOut size={28} strokeWidth={2.5} />
              </div>
              <h2 className="logout-modal-title">Logout</h2>
              <p className="logout-modal-subtitle">Are you sure you want to log out?</p>
              <div className="logout-modal-button-group">
                <button className="logout-modal-cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                <button className="logout-modal-confirm-btn" onClick={handleLogout}>OK, Logout</button>
              </div>
            </div>
          ) : (
            <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="logout-modal-profile-section">
                <div className="logout-modal-avatar">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="tb-user-avatar-new" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                  ) : (
                    <div className="tb-avatar-initial-modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#94a3b8', color: 'white' }}><User size={24} /></div>
                  )}
                </div>
                <h3>{userName}</h3>
              </div>
              <div className="logout-modal-message-section">
                <h2>Are you sure you want to logout?</h2>
                <p>You will be redirected to the trainer login page.</p>
              </div>
              <div className="logout-modal-button-group">
                <button className="logout-modal-cancel-btn" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                <button className="logout-modal-ok-btn" onClick={handleLogout}>OK</button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Topbar;
