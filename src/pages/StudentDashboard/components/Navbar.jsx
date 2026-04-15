import React from 'react';
import { Search, Mail, Bell, ChevronDown, Menu } from 'lucide-react';
import icLogo from '../../../assets/infycode-final-logo4-1.png';
import bannerLogo from '../../../assets/color-logo-3.png';
import "./Navbar.css";

const Navbar = ({ onToggleSidebar }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : { fullname: "Anjali Shyamala" };
  const userName = user.fullname || user.fullName || "Anjali Shyamala";
  
  return (
    <nav className="student-topbar">
      <div className="topbar-left">
        <div className="navbar-actions">
          <div className="action-with-badge">
            <Mail size={22} className="nav-icon" />
            <span className="nav-badge blue">2</span>
          </div>
          <div className="action-with-badge">
            <Bell size={22} className="nav-icon" />
            <span className="nav-badge orange">2</span>
          </div>
        </div>
      </div>

      <div className="topbar-center">
        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search & Enter" />
        </div>
      </div>

      <div className="topbar-right">
        <div className="nav-user-profile">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200" 
            alt="Profile" 
            className="navbar-avatar" 
          />
          <span className="navbar-username">{userName}</span>
          <ChevronDown size={14} className="chevron-icon" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
