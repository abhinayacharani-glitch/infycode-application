import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { useStudent } from '../../../context/StudentContext';
import "./Sidebar.css";
import icLogo from '../../../assets/infycode-final-logo4-1.png';

const Sidebar = ({ externalShowLogoutModal, setExternalShowLogoutModal }) => {
  const navigate = useNavigate();
  const { unreadQueryCount } = useStudent();
  const [internalShowLogoutModal, setInternalShowLogoutModal] = useState(false);
  const [logoutDest, setLogoutDest] = useState('/');

  // Sync internal modal state with external (for browser back button)
  useEffect(() => {
    if (externalShowLogoutModal) setInternalShowLogoutModal(true);
  }, [externalShowLogoutModal]);

  const getInitialUser = () => {
    const userString = localStorage.getItem('loggedUser') || localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { fullName: "Student", role: "Student" };
    return {
      fullname: user.fullName || user.fullname || user.username || "Student",
      role: user.role || "Student",
      profileImage: user.profileImage || null
    };
  };

  const [user, setUser] = useState(getInitialUser());

  // Listen for profile updates globally
  useEffect(() => {
    const handleProfileSync = () => {
      setUser(getInitialUser());
    };

    window.addEventListener('profileUpdate', handleProfileSync);
    window.addEventListener('storage', handleProfileSync); // Sync across tabs

    return () => {
      window.removeEventListener('profileUpdate', handleProfileSync);
      window.removeEventListener('storage', handleProfileSync);
    };
  }, []);

  const handleLogout = (dest = '/') => {
    localStorage.clear();
    navigate(dest);
  };

  const navItems = [
    { to: "/student-dashboard/counselling", label: "Counselling" },
    { to: "/student-dashboard/skill-test", label: "Skill Based Test" },
    { to: "/student-dashboard/course", label: "Courses" },
    { to: "/student-dashboard/courses", label: "Enrolled Courses" },
    { to: "/student-dashboard/trainer-connect", label: "Trainer Connect" },
    { to: "/student-dashboard/mock-interview", label: "Mock Tests & Interviews" },
    { to: "/student-dashboard/projects", label: "Projects & Certificates" },
    { to: "/student-dashboard/profile", label: "My Profile" },
  ];

  return (
    <>
      <aside className="student-sd-sidebar">

        {/* BRAND */}
        <div
          className="student-sd-brand"
          onClick={() => { setLogoutDest('/'); setInternalShowLogoutModal(true); }}
        >
          <div className="brand-wrapper">
            <img src={icLogo} alt="Infycode Logo" className="logo" />
            <div className="brand-text">
              <span className="logo-title">INFYCODE</span>
              <span className="logo-subtitle">Infinite Learning Solutions</span>
            </div>
          </div>
        </div>

        {/* USER CARD WITH DYNAMIC PHOTO */}
        <div className="student-sd-user-card" onClick={() => navigate('/student-dashboard/profile')}>
          <div className="student-sd-avatar-section">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="student-sd-mini-avatar" />
            ) : (
              <div className="student-sd-mini-avatar-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={18} />
              </div>
            )}
            <span className="student-sd-status-dot-mini"></span>
          </div>
          <div className="student-sd-user-info">
            <span className="student-sd-name">{user.fullname}</span>
            <span className="student-sd-role">{user.role}</span>
          </div>
        </div>

        {/* NAV */}
        <nav className="student-sd-nav">
          {navItems.map((item, i) => {
            const isTrainerConnect = item.label === "Trainer Connect";
            return (
              <NavLink key={i} to={item.to}
                className={({ isActive }) => `student-sd-item ${isActive ? 'active' : ''}`}>
                <div className="student-sd-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span className="student-sd-text">{item.label}</span>
                  {isTrainerConnect && unreadQueryCount > 0 && (
                    <span className="student-sd-badge" style={{
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '12px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      marginLeft: '8px'
                    }}>
                      {unreadQueryCount}
                    </span>
                  )}
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* FOOTER LOGOUT */}
        <div className="student-sd-footer">
          <button className="student-sd-logout-btn" onClick={() => { setLogoutDest('/login'); setInternalShowLogoutModal(true); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {internalShowLogoutModal && (
        <div className="sd-modal-overlay" onClick={() => { setInternalShowLogoutModal(false); setExternalShowLogoutModal?.(false); }}>
          <div className="sd-modal-card" onClick={e => e.stopPropagation()}>
            <div className="sd-modal-logout-icon">
              <div className="logout-icon-circle-red">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
            </div>

            <h2 className="sd-modal-title">Logout</h2>
            <p className="sd-modal-subtitle">Are you sure you want to log out from InfyCode?</p>

            <div className="sd-modal-actions">
              <button className="sd-modal-cancel" onClick={() => { setInternalShowLogoutModal(false); setExternalShowLogoutModal?.(false); }}>
                Cancel
              </button>
              <button className="sd-modal-logout-red" onClick={() => handleLogout(logoutDest)}>
                OK, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
