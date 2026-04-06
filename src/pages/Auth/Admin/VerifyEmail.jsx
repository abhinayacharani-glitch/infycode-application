import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminAuth.css';
import './ForgotPassword.css';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Redirect to reset-password with verified flag
          navigate('/admin/reset-password?verified=true');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

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

  return (
    <div className="admin-wrapper">
      <div className="ve-card">
        <div className="ve-check-wrap">
          <svg className="ve-checkmark" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="ve-checkmark__circle" cx="26" cy="26" r="24" stroke="#1e3a8a" strokeWidth="3" fill="none" />
            <path className="ve-checkmark__check" d="M14 26l9 9 15-17" stroke="#1e3a8a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        <h1 className="ve-heading">Email Verified!</h1>
        <p className="ve-sub">Your identity has been confirmed. You can now reset your password.</p>

        <div className="ve-countdown">
          Redirecting in <span className="ve-countdown__num">{countdown}</span>{countdown === 1 ? ' second…' : ' seconds…'}
        </div>

        <button
          className="admin-submit-btn"
          style={{ maxWidth: 260, margin: '20px auto 0' }}
          onClick={() => navigate('/admin/reset-password?verified=true')}
        >
          Continue to Reset Password
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
