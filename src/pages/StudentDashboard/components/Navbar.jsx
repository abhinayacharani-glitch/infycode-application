import React, { useState, useRef, useEffect } from 'react';
import { Search, Mail, Bell, ChevronDown, LogOut, User, Edit, MessageSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import "./Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null); // 'profile', 'notifications', 'messages', or null
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { fullname: "Anjali Syamala", role: "student" };
  const userName = user.fullname || user.fullName || "Anjali Syamala";
  const userRole = user.role || "student";

  const notifications = [
    {
      id: 1,
      title: "Assessment Due",
      message: "Your React Fundamentals assessment is due in 2 hours.",
      time: "2h ago",
      type: "warning"
    },
    {
      id: 2,
      title: "Grade Updated",
      message: "Your project 'E-commerce API' has been graded.",
      time: "5h ago",
      type: "info"
    },
    {
      id: 3,
      title: "New Course Available",
      message: "Advanced Node.js is now open for enrollment.",
      time: "1d ago",
      type: "success"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Charani (Mentor)",
      text: "Don't forget to push your code for the latest assignment.",
      time: "10m ago",
      unread: true
    },
    {
      id: 2,
      sender: "Admin",
      text: "System maintenance scheduled for tonight at 2 AM.",
      time: "3h ago",
      unread: false
    },
    {
      id: 3,
      sender: "Placement Cell",
      text: "New internship opportunity at TechCorp for React Developers.",
      time: "1d ago",
      unread: false
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdown = !dropdownRef.current || !dropdownRef.current.contains(event.target);
      const isOutsideNotifications = !notificationsRef.current || !notificationsRef.current.contains(event.target);
      const isOutsideMessages = !messagesRef.current || !messagesRef.current.contains(event.target);

      if (isOutsideDropdown && isOutsideNotifications && isOutsideMessages) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (dropdownType) => {
    setActiveDropdown(activeDropdown === dropdownType ? null : dropdownType);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="student-topbar">
      <div className="topbar-left">
        {/* Search removed */}
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        {/* NOTIFICATIONS DROPDOWN */}
        <div className="dropdown-wrapper" ref={notificationsRef} onClick={() => toggleDropdown('notifications')}>
          <div className="action-with-badge">
            <Bell size={24} />
            <span className="nav-badge blue">3</span>
          </div>

          {activeDropdown === 'notifications' && (
            <div className="content-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="view-all">Mark all read</button>
              </div>
              <div className="dropdown-body">
                {notifications.map(notif => (
                  <div key={notif.id} className={`dropdown-item ${notif.type === 'warning' ? 'unread' : ''}`}>
                    <div className={`item-icon ${notif.type}`}>
                      <Bell size={20} />
                    </div>
                    <div className="item-content">
                      <div className="item-title">{notif.title}</div>
                      <div className="item-snippet">{notif.message}</div>
                      <div className="item-time">
                        <Clock size={12} />
                        {notif.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="nav-user-profile" ref={dropdownRef} onClick={() => toggleDropdown('profile')}>
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Profile"
            className="navbar-avatar"
          />
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
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
                  alt="Profile"
                  className="dropdown-avatar"
                />
                <div className="dropdown-user-info">
                  <div className="dropdown-name">{userName}</div>
                  <div className="dropdown-role">{userRole}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item"
                onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); navigate('/student-dashboard/profile?edit=true'); }}
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>

              <div className="dropdown-divider"></div>

              <button
                className="dropdown-item logout-item"
                onClick={(e) => { e.stopPropagation(); setActiveDropdown(null); setShowLogoutModal(true); }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── LOGOUT CONFIRMATION MODAL ── */}
      {showLogoutModal && (
        <div className="sd-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="sd-modal-card" onClick={e => e.stopPropagation()}>

            <div className="sd-modal-user-header">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" alt="Profile" className="sd-modal-avatar" />
              <div className="sd-modal-user-info">
                <span className="sd-modal-name">{userName}</span>
                <span className="sd-modal-role">{userRole}</span>
              </div>
            </div>

            <h2 className="sd-modal-title">Log out to Sign in Page?</h2>
            <p className="sd-modal-subtitle">Are you sure you want to end your current dashboard session?</p>

            <div className="sd-modal-actions">
              <button className="sd-modal-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="sd-modal-logout" onClick={handleLogout}>
                Yes, log out
              </button>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
