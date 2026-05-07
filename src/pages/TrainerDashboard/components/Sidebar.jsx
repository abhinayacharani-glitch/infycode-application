import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../context/TrainerContext';
import './Sidebar.css';
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';
import { User } from 'lucide-react';

// ✅ SVG Icons
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </svg>
);

const BookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 0 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.2" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <rect x="9" y="2" width="6" height="4" />
    <rect x="4" y="6" width="16" height="16" rx="2" />
  </svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V5a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const LiveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10 9l5 3-5 3V9z" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const Sidebar = ({ isOpen, onClose, externalShowLogoutModal, setExternalShowLogoutModal }) => {
  const navigate = useNavigate();
  const { trainerData, profileImage, pendingCounsellingCount, batchNotificationCount } = useTrainer();

  const userName = trainerData.fullName || trainerData.fullname || trainerData.name || "Trainer";
  const userInitial = userName.charAt(0).toUpperCase();
  const [internalShowLogoutModal, setInternalShowLogoutModal] = useState(false);

  // Sync internal modal state with external (for browser back button)
  useEffect(() => {
    if (externalShowLogoutModal) setInternalShowLogoutModal(true);
  }, [externalShowLogoutModal]);

  const handleLogout = () => {
    localStorage.clear();
    setInternalShowLogoutModal(false);
    setExternalShowLogoutModal?.(false);
    navigate('/');
  };

  return (
    <>
      <aside className={`sd-sidebar ${isOpen ? 'open' : ''}`}>
        <Link
          to="/trainer-dashboard/profile"
          className="sd-profile-link"
          onClick={onClose}
        >
          <div className="sd-profile-card">
            <div className="sd-avatar-circle">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="sd-avatar-img" />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'white' }}>
                  <User size={20} />
                </div>
              )}
            </div>
            <div className="sd-user-info">
              <div className="sd-user-name-wrapper">
                <div className="sd-user-name">{userName}</div>
                <span className="sd-status-dot"></span>
              </div>
              <div className="sd-user-role">Trainer</div>
            </div>
          </div>
        </Link>

        {/* NAV */}
        <div className="sd-nav">
          <NavLink to="/trainer-dashboard/dashboard"
            onClick={onClose}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon"><DashboardIcon /></span>
              <span className="sd-text">Dashboard</span>
            </div>
          </NavLink>

          <NavLink to="/trainer-dashboard/schedule"
            onClick={onClose}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon"><CalendarIcon /></span>
              <span className="sd-text">Schedule</span>
            </div>
          </NavLink>

          <NavLink to="/trainer-dashboard/batches"
            onClick={onClose}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon"><BookIcon /></span>
              <span className="sd-text">Batches</span>
              {batchNotificationCount > 0 && (
                <span className="sd-count-badge">{batchNotificationCount}</span>
              )}
            </div>
          </NavLink>

          <NavLink to="/trainer-dashboard/counselling"
            onClick={onClose}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon"><LiveIcon /></span>
              <span className="sd-text">Counselling sessions</span>
              {pendingCounsellingCount > 0 && (
                <span className="sd-count-badge">{pendingCounsellingCount}</span>
              )}
            </div>

          </NavLink>

          <NavLink to="/trainer-dashboard/materials"
            onClick={onClose}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon"><PaperclipIcon /></span>
              <span className="sd-text">Course & material</span>
            </div>
          </NavLink>

          <NavLink to="/trainer-dashboard/student-connect"
            onClick={onClose}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon"><MessageIcon /></span>
              <span className="sd-text">Student connect</span>
            </div>
          </NavLink>

          <NavLink to="/trainer-dashboard/calendar"
            onClick={onClose}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon"><CalendarIcon /></span>
              <span className="sd-text">Calendar</span>
            </div>
          </NavLink>

          <NavLink to="/trainer-dashboard/profile"
            onClick={onClose}
            className={({ isActive }) => `sd-item ${isActive ? 'active' : ''}`}>
            <div className="sd-box">
              <span className="sd-icon"><UserIcon /></span>
              <span className="sd-text">My profile</span>
            </div>
          </NavLink>
        </div>

        {/* LOGOUT */}
        <div className="sd-footer">
          <div className="sd-logout-btn" onClick={() => { onClose(); setInternalShowLogoutModal(true); }}>
            <span className="sd-icon"><LogoutIcon /></span>
            <span className="sd-text">Logout</span>
          </div>
        </div>
      </aside>

      {/* CONFIRMATION MODAL SC-UI */}
      {internalShowLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => { setInternalShowLogoutModal(false); setExternalShowLogoutModal?.(false); }}>
          <div className="logout-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal-profile-section">
              <div className="logout-modal-avatar">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="sd-avatar-img" />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', color: 'white', backgroundColor: '#94a3b8', borderRadius: '50%' }}>
                    <User size={30} />
                  </div>
                )}
              </div>
              <h3>{userName}</h3>
            </div>

            <div className="logout-modal-message-section">
              <h2>Are you sure you want to logout?</h2>
              <p>You will be redirected to the sign in page.</p>
            </div>

            <div className="logout-modal-button-group">
              <button className="logout-modal-cancel-btn" onClick={() => { setInternalShowLogoutModal(false); setExternalShowLogoutModal?.(false); }}>
                Cancel
              </button>
              <button className="logout-modal-ok-btn" onClick={handleLogout}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


export default Sidebar;