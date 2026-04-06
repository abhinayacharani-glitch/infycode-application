import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { sendOTP } from '../../services/api';
import '../styles/login.css';
import '../styles/trainerForgot.css';

const ForgotPassword = () => {
  const navigate = useNavigate();

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
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!validateEmail(email)) { setError('Invalid email address'); return; }
    setError('');
    setIsLoading(true);

    try {
      await sendOTP(email, 'trainer');
      navigate('/trainer/verify-otp', {
        state: { email, message: 'OTP sent to your registered email' },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* ── LEFT: Branded Visual ── */}
        <div className="auth-image-section">
          <img src="/mnt/data/a2b9b7ca-6bdc-4eb8-96f3-d8165e900f1f.png" alt="" className="auth-image" />
          <div className="auth-image-overlay" />
          <div className="auth-image-content">
            <h2 className="auth-tagline">
              Forgot Your
              <span>Password?</span>
            </h2>
            <p className="auth-tagline-sub">
              No worries — we'll send you a secure OTP right away.
            </p>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Forgot Password</h1>
            <p>Enter your registered email to receive an OTP.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="fp-email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon" />
                <input
                  id="fp-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={error ? 'error' : ''}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && <span className="error-text">{error}</span>}

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </form>

          <div className="auth-footer">
            Remembered your password?
            <Link to="/trainer/login">Back to Login</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
