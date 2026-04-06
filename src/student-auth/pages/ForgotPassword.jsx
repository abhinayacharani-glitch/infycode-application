import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail } from 'lucide-react';

import AuthLayout from '../components/AuthLayout';
import AuthFormCard from '../components/AuthFormCard';
import PageWrapper from '../components/PageWrapper';
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
      <AuthLayout
        panelHeading="Forgot Password?"
    >
      <AuthFormCard>
        <h1 className="sa-form-heading">Forgot Password?</h1>
        <p className="sa-form-sub">
          Enter your registered email — we'll send you a reset OTP.
        </p>

        <form className="sa-form" onSubmit={handleSubmit} noValidate>
          {/* Email */}
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

          <button
            type="submit"
            className="sa-submit-btn"
            disabled={loading}
          >
            {loading
              ? <span className="sa-btn-inner"><span className="sa-spinner" />Sending OTP…</span>
              : 'Send OTP'}
          </button>
        </form>

        <p className="sa-form-footer">
          Remember your password?
          <Link to="/student/login" className="sa-link"> Back to Login</Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
    </PageWrapper>
  );
};

export default ForgotPassword;
