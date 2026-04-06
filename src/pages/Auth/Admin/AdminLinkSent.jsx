import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminAuth.css';
import './ForgotPassword.css';

const AdminLinkSent = () => {
  const navigate = useNavigate();
  // Timer for 5 minutes (300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
      window.location.replace("/admin/login");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds > 30) return "#10b981"; // Green
    if (seconds > 10) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const isExpired = timeLeft === 0;

  return (
    <div className="admin-wrapper">
      <div className="ve-card">
        <div className="ve-check-wrap">
          {isExpired ? (
            <svg className="ve-checkmark" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Expired / Cross Icon */}
              <circle className="ve-checkmark__circle" cx="26" cy="26" r="24" stroke="#ef4444" strokeWidth="3" fill="none" />
              <path className="ve-checkmark__check" d="M16 16l20 20M36 16L16 36" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          ) : (
            <svg className="ve-checkmark" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="ve-checkmark__circle" cx="26" cy="26" r="24" stroke="#1e3a8a" strokeWidth="3" fill="none" />
              <path className="ve-checkmark__check" d="M14 26l9 9 15-17" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </div>

        {isExpired ? (
          <>
            <h1 className="ve-heading" style={{ color: '#ef4444' }}>Link Expired</h1>
            <p className="ve-sub">Your password reset verification link has expired.</p>
          </>
        ) : (
          <>
            <h1 className="ve-heading">Link Sent!</h1>
            <p className="ve-sub">Verification link sent to your email.</p>
          </>
        )}

        <div className="ve-countdown" style={{ color: isExpired ? '#ef4444' : getTimerColor(timeLeft), fontWeight: 'bold' }}>
          {isExpired ? '00:00' : formatTime(timeLeft)}
        </div>

        <button
          className="admin-submit-btn"
          style={{ maxWidth: 260, margin: '20px auto 0', opacity: isExpired ? 0.6 : 1, cursor: isExpired ? 'not-allowed' : 'pointer' }}
          onClick={() => navigate('/admin/login', { replace: true })}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default AdminLinkSent;
