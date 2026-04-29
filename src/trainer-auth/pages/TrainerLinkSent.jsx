import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MailCheck, XCircle, ArrowLeft } from 'lucide-react';
import ModernAuthLayout from '../../student-auth/components/ModernAuthLayout';
import "../../student-auth/styles/ModernAuth.css";

const TrainerLinkSent = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds > 30) return "#10b981";
    if (seconds > 10) return "#f59e0b";
    return "#ef4444";
  };

  const isExpired = timeLeft === 0;

  return (
    <ModernAuthLayout 
      title={isExpired ? "Link Expired" : "Link Sent!"}
      subtitle={isExpired ? "Your password reset verification link has expired." : "Verification link sent to your email."}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        {isExpired ? (
          <XCircle size={80} color="#ef4444" style={{ margin: '0 auto 24px', opacity: 0.8 }} />
        ) : (
          <MailCheck size={80} color="#10b981" style={{ margin: '0 auto 24px', opacity: 0.8 }} />
        )}
        
        <div style={{ fontSize: '48px', fontWeight: 800, color: isExpired ? '#ef4444' : getTimerColor(timeLeft), letterSpacing: '-1px' }}>
          {isExpired ? '00:00' : formatTime(timeLeft)}
        </div>
      </div>

      <button 
        className="submit-button" 
        onClick={() => navigate('/trainer/login', { replace: true })}
        style={isExpired ? { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.1)' } : {}}
      >
        Back to Login
      </button>

      <div style={{ textAlign: 'center' }}>
        <Link to="/trainer/login" className="back-home">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </ModernAuthLayout>
  );
};

export default TrainerLinkSent;

export default TrainerLinkSent;
