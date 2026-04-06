import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullName || user.fullname || "Trainer";
  const [liveDate, setLiveDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  });
  const location = useLocation();

  // Extract the last part of the pathname (e.g., /trainer-dashboard/batches -> batches)
  const activePage = location.pathname.split('/').pop() || 'dashboard';

  const pageTitles = {
    dashboard: ['Dashboard', `Welcome back, ${userName}! Here's your overview.`],
    profile: ['My Profile', 'Personal & professional information'],
    batches: ['My Batches', 'Manage your assigned training batches'],
    schedule: ['Schedule', 'Your weekly training calendar'],
    materials: ['Course Materials', 'All uploaded learning resources'],
    attendance: ['Attendance', 'Track and manage attendance records'],
    feedback: ['Feedback & Ratings', 'Student reviews and performance insights'],
    messages: ['Messages', 'Inbox and communications'],
  };

  const [title, sub] = pageTitles[activePage] || ['Dashboard', `Welcome back, ${userName}! Here's your overview.`];

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

export default Topbar;

