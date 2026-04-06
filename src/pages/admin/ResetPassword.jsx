import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { resetPassword as resetPasswordAPI } from '../../services/api';
import './adminAuth.css';
import './ForgotPassword.css';

const validatePassword = (password) =>
  password.length >= 8 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Gate: must arrive from /admin/verify-otp with otpVerified + resetToken
  const { otpVerified = false, email = '', resetToken = '' } = location.state || {};

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!otpVerified || !resetToken) return;

    const newErrors = {};
    if (!formData.newPassword) newErrors.newPassword = 'Required';
    else if (!validatePassword(formData.newPassword))
      newErrors.newPassword = 'Min 8 chars, 1 number & 1 symbol';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Required';
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setResetLoading(true);

    try {
      await resetPasswordAPI(resetToken, formData.newPassword, formData.confirmPassword);
      setResetSuccess(true);
      setTimeout(() =>
        navigate('/admin/login', { state: { message: 'Password reset successful! Please sign in.' } }),
        2000
      );
    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-card admin-card--compact">

        {/* ── LEFT: Form ── */}
        <div className="admin-form-side admin-form-side--compact">
          <div className="admin-form-header">
            <h1 className="admin-form-heading">Reset Password</h1>
            <p className="admin-form-sub" style={{ marginBottom: '16px' }}>
              Set a new secure password for your account
            </p>
          </div>

          <form className="admin-form admin-form--compact" onSubmit={handleReset} noValidate>

            {/* ── Access Denied Warning ── */}
            {!otpVerified && (
              <div className="fp-banner fp-banner--error">
                <AlertCircle size={15} />
                <span>Access denied. Please verify your OTP first.</span>
              </div>
            )}

            {/* ── API Error ── */}
            {errors.api && (
              <div className="fp-banner fp-banner--error">
                <AlertCircle size={15} />
                <span>{errors.api}</span>
              </div>
            )}

            {/* ── Success Banner ── */}
            {resetSuccess && (
              <div className="fp-banner fp-banner--success">
                <ShieldCheck size={15} />
                <span>Password reset successful! Redirecting to login…</span>
              </div>
            )}

            {/* ── New Password ── */}
            <div className={`admin-form-group ${!otpVerified ? 'fp-disabled-group' : ''}`}>
              <label htmlFor="rpNewPassword">New Password</label>
              <div className="admin-input-wrap">
                <Lock size={16} className="admin-input-icon" />
                <input
                  id="rpNewPassword"
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword ? 'admin-error' : ''}
                  disabled={!otpVerified || resetSuccess || resetLoading}
                  autoFocus={otpVerified}
                />
                <button
                  type="button"
                  className="admin-toggle-pw"
                  onClick={() => setShowNew(!showNew)}
                  tabIndex={-1}
                  disabled={!otpVerified}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && (
                <span className="admin-error-text">{errors.newPassword}</span>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div className={`admin-form-group ${!otpVerified ? 'fp-disabled-group' : ''}`}>
              <label htmlFor="rpConfirmPassword">Confirm Password</label>
              <div className="admin-input-wrap">
                <Lock size={16} className="admin-input-icon" />
                <input
                  id="rpConfirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'admin-error' : ''}
                  disabled={!otpVerified || resetSuccess || resetLoading}
                />
                <button
                  type="button"
                  className="admin-toggle-pw"
                  onClick={() => setShowConfirm(!showConfirm)}
                  tabIndex={-1}
                  disabled={!otpVerified}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="admin-error-text">{errors.confirmPassword}</span>
              )}
            </div>

            {/* ── Reset Button ── */}
            <button
              type="submit"
              className="admin-submit-btn admin-submit-btn--compact"
              disabled={!otpVerified || resetLoading || resetSuccess}
              style={{ marginTop: '4px' }}
            >
              {resetLoading ? (
                <span className="admin-btn-inner">
                  <span className="admin-spinner" />
                  Resetting…
                </span>
              ) : 'Reset Password'}
            </button>

            <div className="admin-form-footer" style={{ display: 'block', marginTop: '14px' }}>
              <Link to="/admin/forgot-password">← Back to Forgot Password</Link>
            </div>
          </form>
        </div>

        {/* ── RIGHT: Blue Panel ── */}
        <div className="admin-panel-side">
          <div className="admin-panel-content">
            <h2 className="admin-panel-heading">Secure.<br />Access.</h2>
            <p className="admin-panel-sub">
              Set a strong new password to protect your InfyCode admin account.
            </p>
            <Link to="/admin/login" className="admin-panel-btn">
              Back to Login
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;
