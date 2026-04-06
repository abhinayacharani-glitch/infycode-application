import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullname || user.fullName || "Student";
  const [liveDate, setLiveDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  });
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

  const [title, sub] = pageTitles[activePage] || ['Student Dashboard', `Welcome back, ${userName}! Build your future with InfyCode.`];

  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>
      <div className="topbar-actions">
        <div className="date-chip">{liveDate}</div>
      </div>
    </div>
  );
};

export default Navbar;
