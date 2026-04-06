import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';

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
            <div style={{
              position: 'absolute',
              top: '46px',
              right: '0',
              width: '320px',
              background: '#fff',
              border: '1.5px solid #dbeafe',
              borderRadius: '14px',
              boxShadow: '0 16px 48px rgba(37,99,235,0.12)',
              zIndex: 200,
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{
                padding: '14px 18px 12px',
                borderBottom: '1px solid #dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                  Notifications
                </h4>
                {unreadCount > 0 && (
                  <span style={{
                    background: '#2563eb',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '20px',
                  }}>
                    {unreadCount} New
                  </span>
                )}
              </div>

              {/* List */}
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px 18px',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        background: notif.read ? '#fff' : '#eff6ff',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{
                        width: '34px', height: '34px', minWidth: '34px',
                        borderRadius: '10px', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        background: notif.type === 'error' ? '#fee2e2'
                                  : notif.type === 'success' ? '#dcfce7' : '#e0f2fe',
                        fontSize: '15px',
                      }}>
                        {notif.type === 'info' ? 'ℹ️' : notif.type === 'success' ? '✅' : '⚠️'}
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#94a3b8', marginTop: '2px' }}>
                          {notif.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div style={{ padding: '10px 18px', borderTop: '1px solid #dbeafe' }}>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{
                    width: '100%', padding: '8px', borderRadius: '8px',
                    border: '1.5px solid #dbeafe', background: '#fff',
                    fontSize: '12.5px', fontWeight: 600, color: '#2563eb',
                    cursor: 'pointer', fontFamily: 'Urbanist, sans-serif',
                    transition: 'background 0.15s',
                  }}
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
