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


  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
      const isOutsideNotifications = notificationsRef.current && !notificationsRef.current.contains(event.target);

      if (isOutsideDropdown && isOutsideNotifications) {
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
    navigate('/student/login');
  };

  return (
    <nav className="student-topbar">
      <div className="topbar-left">
        {/* Search bar removed as requested */}
      </div>

      <div className="topbar-right">
        <div className="navbar-actions" style={{ marginRight: '1.5rem' }}>

          {/* NOTIFICATIONS DROPDOWN */}
          <div className="dropdown-wrapper" ref={notificationsRef}>
            <div className="action-with-badge" onClick={() => toggleDropdown('notifications')}>
              <Bell size={22} className="nav-icon" />
              {notifications.length > 0 && (
                <span className="nav-badge orange">{notifications.length}</span>
              )}
            </div>
            {activeDropdown === 'notifications' && (
              <div className="content-dropdown notifications-dropdown">
                <div className="dropdown-header">
                  <h3>Notifications</h3>
                  <button className="view-all">View All</button>
                </div>
                <div className="dropdown-body">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`dropdown-item ${notif.type}`}>
                      <div className={`item-icon ${notif.type}`}>
                        <Bell size={16} />
                      </div>
                      <div className="item-content">
                        <div className="item-title">{notif.title}</div>
                        <div className="item-snippet">{notif.message}</div>
                        <div className="item-time">
                          <Clock size={12} /> {notif.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="nav-user-profile" ref={dropdownRef} onClick={() => toggleDropdown('profile')}>
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
            alt="Profile" 
            className="navbar-avatar" 
          />
          <ChevronDown size={14} className="chevron-icon" />
          
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
