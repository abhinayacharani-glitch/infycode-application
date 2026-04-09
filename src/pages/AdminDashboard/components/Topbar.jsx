import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import "./Topbar.css";

const Topbar = () => {
  const { notifications, markNotificationRead } = useAdmin();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.fullname || user.fullName || "Admin";

  const [liveDate, setLiveDate] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const location = useLocation();

  const activePage = location.pathname.split('/').pop() || 'dashboard';

  const pageTitles = {
    dashboard:             ['Admin Dashboard',      `Welcome back, ${userName}! System overview.`],
    'student-verification':['Student Verification', 'Manage registration approvals'],
    'course-config':       ['Course Configuration', 'Setup syllabus and learning modes'],
    'trainer-approval':    ['Trainer Approvals',    'Onboard and assign new trainers'],
    'batch-setup':         ['Batch Setup',          'Configure and schedule training batches'],
    enrollment:            ['Enrollment Mapping',   'Map students to courses and batches'],
    analytics:             ['Analytics & Monitoring','System performance overview'],
    activation:            ['Learning Activation',  'Manage active learning modules'],
    reports:               ['Reports & Logs',       'System performance and data export'],
  };

  const [title, sub] = pageTitles[activePage] || ['Admin Portal', `Welcome, ${userName}.`];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="adm-topbar">
      {/* Left: Page title */}
      <div className="adm-topbar-left">
        <div className="adm-topbar-title">{title}</div>
        <div className="adm-topbar-sub">{sub}</div>
      </div>

      {/* Right: Actions */}
      <div className="adm-topbar-actions">
        <div className="adm-date-chip">{liveDate}</div>

        {/* Notification Bell */}
        <div className="notification-wrapper" ref={notificationRef} style={{ position: 'relative' }}>
          <div
            className="adm-icon-btn"
            title="Alerts"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            🔔
            {unreadCount > 0 && <span className="adm-notif-dot"></span>}
          </div>

          {showNotifications && (
            <div className="adm-notif-dropdown">
              {/* Header */}
              <div className="adm-notif-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <span className="adm-notif-count">
                    {unreadCount} New
                  </span>
                )}
              </div>

              {/* List */}
              <div className="adm-notif-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`adm-notif-item ${!notif.read ? 'unread' : ''}`}
                    >
                      <div className={`adm-notif-icon-wrap ${notif.type || 'info'}`}>
                        {notif.type === 'info' ? 'ℹ️' : notif.type === 'success' ? '✅' : '⚠️'}
                      </div>
                      <div className="adm-notif-content">
                        <div className="adm-notif-message">
                          {notif.message}
                        </div>
                        <div className="adm-notif-time">
                          {notif.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="adm-notif-footer">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="adm-notif-view-all"
                >
                  View All Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="adm-icon-btn" title="Settings">⚙️</div>
      </div>
    </div>
  );
};

export default Topbar;
