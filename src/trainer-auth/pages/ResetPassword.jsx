import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { validatePassword } from '../utils/validation';
import { resetPassword as resetPasswordAPI } from '../../services/api';
import '../styles/login.css';
import '../styles/trainerReset.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();



  // Gate: must arrive from /trainer/verify-otp with otpVerified + resetToken
  const { otpVerified = false, email = '', resetToken = '' } = location.state || {};

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Strength indicator
  const strength = (() => {
    const p = formData.password;
    if (!p) return { pct: 0, color: '#e2e8f0', label: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[!@#$%^&*]/.test(p)) score++;
    const map = [
      { pct: 0,   color: '#e2e8f0', label: '' },
      { pct: 25,  color: '#ef4444', label: 'Weak' },
      { pct: 50,  color: '#f97316', label: 'Fair' },
      { pct: 75,  color: '#eab308', label: 'Good' },
      { pct: 100, color: '#22c55e', label: 'Strong' },
    ];
    return map[score];
  })();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (errors.api) setErrors(p => ({ ...p, api: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!otpVerified || !resetToken) {
      errs.general = 'Access denied. Please verify your OTP first.';
    } else if (!validatePassword(formData.password).isValid) {
      errs.password = 'Min 8 chars, uppercase, number & symbol';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);

    try {
      await resetPasswordAPI(resetToken, formData.password, formData.confirmPassword);
      setSuccess(true);
      setTimeout(() =>
        navigate('/trainer/login', { state: { message: 'Password reset successful. Please sign in.' } }),
        1800
      );
    } catch (err) {
      setErrors({ api: err.message });
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
              Set a New
              <span>Password</span>
            </h2>
            <p className="auth-tagline-sub">
              Choose a strong password to keep your trainer account secure.
            </p>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Create Password</h1>
            <p>Enter and confirm your new password below.</p>
          </div>

          {/* Access denied */}
          {!otpVerified && !success && (
            <div className="error-text" style={{
              padding: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} />
              Access denied. Please verify your OTP first.
            </div>
          )}

          {/* API Error */}
          {errors.api && (
            <div className="error-text" style={{
              padding: '12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <AlertCircle size={16} />
              {errors.api}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="success-banner">
              <CheckCircle size={18} />
              Password reset successfully! Redirecting to login…
            </div>
          )}

          {errors.general && <span className="error-text">{errors.general}</span>}

          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="rp-password">New Password</label>
              <div className="input-wrapper" style={{ position: 'relative', width: '100%' }}>
                <Lock size={17} className="input-icon" />
                <input
                  id="rp-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min 8 chars, uppercase, number & symbol"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  autoComplete="new-password"
                  disabled={!otpVerified || success || isLoading}
                  style={{ paddingRight: '48px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPassword)}
                  className="toggle-password"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* Strength bar */}
              {formData.password && (
                <div className="strength-bar-wrap">
                  <div
                    className="strength-bar"
                    style={{ width: `${strength.pct}%`, background: strength.color }}
                  />
                </div>
              )}
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="rp-confirm">Confirm Password</label>
              <div className="input-wrapper" style={{ position: 'relative', width: '100%' }}>
                <Lock size={17} className="input-icon" />
                <input
                  id="rp-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  autoComplete="new-password"
                  disabled={!otpVerified || success || isLoading}
                  style={{ paddingRight: '48px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="toggle-password"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={!otpVerified || isLoading || success}
            >
              {isLoading ? 'Resetting…' : success ? 'Password Reset ✓' : 'Reset Password →'}
            </button>
          </form>


        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
