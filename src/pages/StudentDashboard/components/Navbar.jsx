import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser") || "{}");
  const userName = loggedUser.username || "Student";
  const [liveDate, setLiveDate] = useState('');
  const location = useLocation();

  const activePage = location.pathname.split('/').pop() || 'counselling';

  const pageTitles = {
    counselling: ['Counselling', `Welcome back, ${userName}! Guided career paths.`],
    'skill-test': ['Skill Based Test', 'Evaluate your technical proficiency'],
    courses: ['Enrolled Courses', 'Continue your learning journey'],
    'mock-interview': ['Mock Interviews', 'Practice and prepare for real interviews'],
    projects: ['Projects & Certificates', 'Your portfolio and verified achievements'],
    profile: ['My Profile', 'Personal & academic information'],
  };

  useEffect(() => {
    const d = new Date();
    setLiveDate(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  const [title, sub] = pageTitles[activePage] || ['Student Dashboard', `Welcome back, ${userName}! Build your future with InfyCode.`];

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>
      <div className="topbar-actions">
        <div className="date-chip">{liveDate}</div>
        <div className="icon-btn" title="Notifications">📨<span className="notif-dot"></span></div>
        <div className="icon-btn" title="Settings">🔧</div>
      </div>
    </div>
  );
};

export default Navbar;
