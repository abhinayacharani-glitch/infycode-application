import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';
import AuthFormCard from '../components/AuthFormCard';
import PageWrapper from '../components/PageWrapper';
import "../styles/Login.css";
import { validateEmail } from '../utils/validation';
import { studentForgotPassword } from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { emailRef.current?.focus(); }, []);

  /* Block browser back → redirect to login */
  useEffect(() => {
    const guard = () => {
      window.history.pushState(null, '', window.location.href);
      window.location.replace('/student/login');
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', guard);
    return () => window.removeEventListener('popstate', guard);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!validateEmail(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    try {
      await studentForgotPassword(email.trim());
      navigate('/student/verify-otp', {
        state: { email: email.trim(), message: 'OTP sent to your registered email', type: 'password-reset' },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="studentLogin-wrapper">
        <div className="studentLogin-container studentLogin-active">
          <div className="studentLogin-form-container studentLogin-sign-up">
            <form className="sa-form" onSubmit={handleSubmit} noValidate>
              <h1 className="sa-form-heading">Forgot Password?</h1>
              <p className="sa-form-sub">Enter your registered email — we'll send you a reset OTP.</p>

              <div className="sa-input-wrap">
                <Mail size={15} className="sa-input-icon" />
                <input
                  ref={emailRef}
                  id="fp-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`sa-input${error ? ' sa-input--error' : ''}`}
                  autoComplete="email"
                  disabled={loading}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
                />
              </div>
              {error && <span className="sa-error-text">{error}</span>}

              <button type="submit" className="sa-submit-btn" disabled={loading}>
                {loading ? <span className="sa-btn-inner"><span className="sa-spinner" />Sending OTP…</span> : 'Send OTP'}
              </button>
            </form>
          </div>
          
          <div className="studentLogin-toggle-container">
            <div className="studentLogin-toggle">
              <div className="studentLogin-toggle-panel studentLogin-toggle-left">
                <h1>Forgot Password?</h1>
                <p>We will help you get back to your account.</p>
                <button className="studentLogin-hidden" onClick={() => navigate('/student/login')} type="button">Back to Login</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ForgotPassword;
