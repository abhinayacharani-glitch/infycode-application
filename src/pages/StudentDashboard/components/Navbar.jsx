import React, { useState, useRef, useEffect } from 'react';
import { Search, Mail, Bell, ChevronDown, LogOut, User, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { fullname: "Pandeti Abhinaya", role: "STUDENT" };
  const userName = user.fullname || user.fullName || "Pandeti Abhinaya";
  const userRole = user.role || "STUDENT";
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/student/login');
  };

  return (
    <nav className="student-topbar">
      <div className="topbar-left">
        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search & Enter" />
        </div>
      </div>

      <div className="topbar-right">
        <div className="navbar-actions" style={{ marginRight: '1.5rem' }}>
          <div className="action-with-badge">
            <Mail size={22} className="nav-icon" />
            <span className="nav-badge blue">2</span>
          </div>
          <div className="action-with-badge">
            <Bell size={22} className="nav-icon" />
            <span className="nav-badge orange">2</span>
          </div>
        </div>

        <div className="nav-user-profile" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
            alt="Profile" 
            className="navbar-avatar" 
          />
          <span className="navbar-username">{userName}</span>
          <ChevronDown size={14} className="chevron-icon" />
          
          {isDropdownOpen && (
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
              
              {/* Removed My Profile as requested */}
              <button 
                className="dropdown-item" 
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(false); navigate('/student-dashboard/profile?edit=true'); }}
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout-item" 
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(false); setShowLogoutModal(true); }}
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
