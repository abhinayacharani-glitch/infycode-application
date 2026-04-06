import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { sendOTP } from '../../../services/api';
import './adminAuth.css';
import './ForgotPassword.css';

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

const ForgotPassword = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

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

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleSend = async () => {
    if (!email) { setEmailError('Email is required'); return; }
    if (!validateEmail(email)) { setEmailError('Enter a valid email address'); return; }

    setLoading(true);
    setEmailError('');

    try {
      await sendOTP(email, 'admin');
      navigate('/admin/verify-otp', {
        state: { email, message: 'OTP sent to your registered email' },
      });
    } catch (err) {
      // Only show error for genuine server failures
      setEmailError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card admin-card--compact">

        {/* ── LEFT: Form ── */}
        <div className="admin-form-side admin-form-side--compact">
          <div className="admin-form-header">
            <h1 className="admin-form-heading">Forgot Password?</h1>
            <p className="admin-form-sub" style={{ marginBottom: '20px' }}>
              Enter your email and we'll send an OTP
            </p>
          </div>

          <div className="admin-form admin-form--compact">

            {/* ── Email Field ── */}
            <div className="admin-form-group">
              <label htmlFor="fpEmail">Email Address</label>
              <div className="admin-input-wrap">
                <Mail size={16} className="admin-input-icon" />
                <input
                  id="fpEmail"
                  ref={emailRef}
                  type="email"
                  placeholder="admin@infycode.com"
                  value={email}
                  onChange={handleChange}
                  className={emailError ? 'admin-error' : ''}
                  onKeyDown={(e) => {
                    if (!loading && e.key === 'Enter') handleSend();
                  }}
                  disabled={loading}
                />
              </div>
              {emailError && <span className="admin-error-text">{emailError}</span>}
            </div>

            {/* ── Send Button ── */}
            <button
              type="button"
              className="admin-submit-btn admin-submit-btn--compact"
              onClick={handleSend}
              disabled={loading}
              style={{ marginTop: '4px' }}
            >
              {loading ? (
                <span className="admin-btn-inner">
                  <span className="admin-spinner" />
                  Sending…
                </span>
              ) : 'Send OTP'}
            </button>

            <div className="admin-form-footer" style={{ display: 'block', marginTop: '16px' }}>
              Remember your password?{' '}
              <Link to="/admin/login">Sign In</Link>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Blue Panel ── */}
        <div className="admin-panel-side">
          <div className="admin-panel-content">
            <h2 className="admin-panel-heading">Secure.<br />Access.</h2>
            <p className="admin-panel-sub">
              Reset your credentials and regain full control of your InfyCode admin dashboard.
            </p>
            <button 
              onClick={() => navigate("/admin/login", { replace: true })} 
              className="admin-panel-btn"
              style={{ background: 'white', color: '#2563eb', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'center', width: 'fit-content' }}
            >
              Back to Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
