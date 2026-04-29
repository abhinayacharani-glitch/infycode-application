import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, Send, RefreshCw } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { studentForgotPassword } from '../../services/api';
import ModernAuthLayout from '../components/ModernAuthLayout';
import "../styles/ModernAuth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!validateEmail(email)) { setError('Enter a valid email address'); return; }
    setError(''); setLoading(true);
    try {
      await studentForgotPassword(email.trim());
      setSent(true);
      setTimeout(() => navigate('/student/verify-otp', {
        state: { email: email.trim(), message: 'OTP sent to your registered email', type: 'password-reset' }
      }), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernAuthLayout 
      title="Reset Password"
      subtitle="Enter your registered email — we'll send an OTP to get you back in."
    >
      {!sent ? (
        <>
          {error && <div className="auth-alert auth-alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-container">
                <Mail size={17} className="input-icon" />
                <input
                  ref={emailRef} type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="auth-input"
                  autoComplete="email" disabled={loading}
                />
              </div>
              {error && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{error}</span>}
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading
                ? <><span className="spinner" /> Sending OTP...</>
                : <><Send size={15} /> Send OTP →</>}
            </button>
          </form>

          <div style={{ textAlign: 'center' }}>
            <Link to="/student/login" className="back-home">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </>
      ) : (
        /* Success state */
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '24px', margin: '0 auto 24px',
            background: 'rgba(52, 211, 153, 0.1)',
            border: '1px solid rgba(52, 211, 153, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#34d399', animation: 'fade-up 0.4s ease-out'
          }}>
            <Mail size={36} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>OTP Sent!</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: 8 }}>
            We've sent a verification code to
          </p>
          <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: 18, marginBottom: 24 }}>{email}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Redirecting to OTP verification...</p>
        </div>
      )}
    </ModernAuthLayout>
  );
};

export default ForgotPassword;
