import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck, XCircle } from 'lucide-react';
import '../styles/login.css';
import '../styles/trainerForgot.css';

const TrainerLinkSent = () => {
  const navigate = useNavigate();
  // Timer for 1 minute (60 seconds)
  const [timeLeft, setTimeLeft] = useState(60);

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
      window.location.replace("/trainer/login");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds > 30) return "#10b981"; // Green
    if (seconds > 10) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const isExpired = timeLeft === 0;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        {/* ── LEFT: Branded Visual ── */}
        <div className="auth-image-section">
          <img src="/mnt/data/a2b9b7ca-6bdc-4eb8-96f3-d8165e900f1f.png" alt="" className="auth-image" />
          <div className="auth-image-overlay" />
          <div className="auth-image-content">
            <h2 className="auth-tagline">
              Check Your
              <span>Email</span>
            </h2>
            <p className="auth-tagline-sub">
              We've sent a secure reset link. It will expire in exactly 5 minutes.
            </p>
            <div className="auth-stats">
              <div className="stat-pill"><strong>SSL</strong><span>Secured</span></div>
              <div className="stat-pill"><strong>256-bit</strong><span>Encrypted</span></div>
              <div className="stat-pill"><strong>24/7</strong><span>Support</span></div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form / Status ── */}
        <div className="auth-form-section">
          <div className="auth-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
            {isExpired ? (
              <XCircle size={56} color="#ef4444" style={{ margin: '0 auto 16px' }} />
            ) : (
              <MailCheck size={56} color="#10b981" style={{ margin: '0 auto 16px' }} />
            )}
            
            {isExpired ? (
              <>
                <h1 style={{ color: '#ef4444' }}>Link Expired</h1>
                <p>Your password reset verification link has expired.</p>
              </>
            ) : (
              <>
                <h1>Link Sent!</h1>
                <p>Verification link sent to your email.</p>
              </>
            )}
          </div>

          <div 
            style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              textAlign: 'center', 
              margin: '20px 0 30px', 
              color: isExpired ? '#ef4444' : getTimerColor(timeLeft) 
            }}
          >
            {isExpired ? '00:00' : formatTime(timeLeft)}
          </div>

          <button 
            className="submit-btn" 
            onClick={() => navigate('/trainer/login', { replace: true })}
            style={isExpired ? { background: '#94a3b8', cursor: 'not-allowed', boxShadow: 'none' } : {}}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainerLinkSent;
