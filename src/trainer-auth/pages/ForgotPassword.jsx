import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { sendOTP } from '../../services/api';
import ModernAuthLayout from '../../student-auth/components/ModernAuthLayout';
import "../../student-auth/styles/ModernAuth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

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
    <ModernAuthLayout 
      title="Forgot Password?"
      subtitle="Enter your registered email to receive an OTP."
    >
      {error && (
        <div className="auth-alert auth-alert-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fp-email">Email Address</label>
          <div className="input-container">
            <Mail size={17} className="input-icon" />
            <input
              id="fp-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="auth-input"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? <><span className="spinner" /> Sending OTP...</> : 'Send OTP →'}
        </button>
      </form>

      <div style={{ textAlign: 'center' }}>
        <Link to="/trainer/login" className="back-home">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </ModernAuthLayout>
  );
};

export default ForgotPassword;
