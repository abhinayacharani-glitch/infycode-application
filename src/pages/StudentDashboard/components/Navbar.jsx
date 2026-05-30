import React, { useState, useRef, useEffect } from 'react';
import { Search, Mail, Bell, ChevronDown, LogOut, User, Edit, MessageSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../../../context/StudentContext';
import { markQueryReadByStudentAPI } from '../../../services/api';
import "./Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { studentQueries, unreadQueryCount, fetchStudentQueries } = useStudent();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  useEffect(() => {
    const handleProfileSync = () => {
      setUser(getInitialUser());
    };
    window.addEventListener('profileUpdate', handleProfileSync);
    window.addEventListener('storage', handleProfileSync);

    // Global sync on mount to catch profileImage if missing from login
    import('../../../services/api').then(({ getStudentProfile }) => {
      getStudentProfile().then(res => {
        if (res.success && res.profile && res.profile.profileImage) {
          const currentLocal = JSON.parse(localStorage.getItem('loggedUser') || localStorage.getItem('user') || '{}');
          if (currentLocal.profileImage !== res.profile.profileImage) {
            currentLocal.profileImage = res.profile.profileImage;
            localStorage.setItem('loggedUser', JSON.stringify(currentLocal));
            localStorage.setItem('user', JSON.stringify(currentLocal));
            setUser(prev => ({ ...prev, profileImage: res.profile.profileImage }));
            window.dispatchEvent(new Event('profileUpdate')); // Sync Sidebar
          }
        }
      }).catch(err => console.error("Global profile sync error:", err));
    });

    return () => {
      window.removeEventListener('profileUpdate', handleProfileSync);
      window.removeEventListener('storage', handleProfileSync);
    };
  }, []);

  // Map unread trainer solutions to notifications
  const queryNotifications = studentQueries
    .filter(q => q.readByStudent === false && q.solution)
    .map(q => ({
      id: `query_${q.id}`,
      queryId: q.id,
      title: `💬 Reply from ${q.trainerName || 'Trainer'}`,
      message: q.solution.substring(0, 60) + (q.solution.length > 60 ? '...' : ''),
      time: "Just now",
      type: "success",
      read: false,
      isQuery: true,
      createdAt: new Date(q.createdAt).getTime()
    }));

  const allNotifications = [...queryNotifications].sort((a, b) => b.createdAt - a.createdAt);
  const totalUnreadCount = allNotifications.filter(n => !n.read).length;

  const messages = [
    { id: 1, sender: "Charani (Mentor)", text: "Don't forget to push your code for the latest assignment.", time: "10m ago", unread: true },
    { id: 2, sender: "Admin", text: "System maintenance scheduled for tonight at 2 AM.", time: "3h ago", unread: false },
    { id: 3, sender: "Placement Cell", text: "New internship opportunity at TechCorp for React Developers.", time: "1d ago", unread: false }
  ];

  useEffect(() => {
    if (!activeDropdown) return;

    const handleGlobalClick = (event) => {
      // Check if the click was on a dropdown trigger
      const isNotificationTrigger = notificationsRef.current && notificationsRef.current.contains(event.target);
      const isProfileTrigger = dropdownRef.current && dropdownRef.current.contains(event.target);

      // If we clicked something else, close the dropdown
      if (!isNotificationTrigger && !isProfileTrigger) {
        setActiveDropdown(null);
      }
    };

    // Use a small timeout to ensure the opening click doesn't immediately trigger this
    const timer = setTimeout(() => {
      window.addEventListener('click', handleGlobalClick);
    }, 0);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [activeDropdown]);

  const toggleDropdown = (dropdownType) => {
    // Always set to the type to ensure it opens/stays open
    setActiveDropdown(dropdownType);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="student-topbar">
      <div className="topbar-left">
      </div>

      <div className="topbar-right">

        {/* NOTIFICATIONS */}
        <div className="dropdown-wrapper" ref={notificationsRef} onClick={() => toggleDropdown('notifications')}>
          <div className="action-with-badge">
            <Bell size={24} />
            {totalUnreadCount > 0 && <span className="nav-badge blue">{totalUnreadCount}</span>}
          </div>

          {activeDropdown === 'notifications' && (
            <div className="content-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="view-all">Mark all read</button>
              </div>
              <div className="dropdown-body">
                {allNotifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No notifications yet</div>
                ) : (
                  allNotifications.map(notif => {
                    const handleItemClick = async () => {
                      if (notif.isQuery) {
                        try {
                          await markQueryReadByStudentAPI(notif.queryId);
                          fetchStudentQueries();
                        } catch (err) {
                          console.error("Error marking query as read:", err);
                        }
                        navigate(`/student-dashboard/my-queries/${notif.queryId}/solution`);
                      }
                    };

                    return (
                      <div
                        key={notif.id}
                        className={`dropdown-item ${!notif.read ? 'unread' : ''}`}
                        onClick={handleItemClick}
                        style={{ cursor: notif.isQuery ? 'pointer' : 'default' }}
                      >
                        <div className={`item-icon ${notif.type}`}><Bell size={20} /></div>
                        <div className="item-content">
                          <div className="item-title">{notif.title}</div>
                          <div className="item-snippet">{notif.message}</div>
                          <div className="item-time"><Clock size={12} /> {notif.time}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="nav-user-profile" ref={dropdownRef} onClick={() => toggleDropdown('profile')}>
          {user.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="navbar-avatar" />
          ) : (
            <div className="navbar-avatar-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
          )}
          <ChevronDown
            size={18}
            className="chevron-icon"
            style={{
              transform: activeDropdown === 'profile' ? 'rotate(180deg)' : 'rotate(0)',
              transition: 'transform 0.2s'
            }}
          />

          {activeDropdown === 'profile' && (
            <div className="profile-dropdown-menu">
              <div className="profile-dropdown-header">
                {user.profileImage ? (
                  <img src={user.profileImage} alt="Profile" className="dropdown-avatar" />
                ) : (
                  <div className="dropdown-avatar-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} /></div>
                )}
                <div className="dropdown-user-info">
                  <div className="dropdown-name">{user.fullname}</div>
                  <div className="dropdown-role">{user.role}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>

              <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); navigate('/student-dashboard/profile?edit=true'); }}>
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item logout-item" onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); setShowLogoutModal(true); }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="sd-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="sd-modal-card" onClick={e => e.stopPropagation()}>
            <div className="sd-modal-logout-icon">
              <div className="logout-icon-circle-red">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
            </div>
            <h2 className="sd-modal-title">Logout?</h2>
            <p className="sd-modal-subtitle">Are you sure you want to end your current session?</p>
            <div className="sd-modal-actions">
              <button className="sd-modal-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="sd-modal-logout-red" onClick={handleLogout}>OK, Logout</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
