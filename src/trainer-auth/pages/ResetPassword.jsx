import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { validatePassword } from '../utils/validation';
import { resetPassword as resetPasswordAPI } from '../../services/api';
import ModernAuthLayout from '../../student-auth/components/ModernAuthLayout';
import "../../student-auth/styles/ModernAuth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { otpVerified = false, email = '', resetToken = '' } = location.state || {};

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = (() => {
    const p = formData.password;
    if (!p) return { pct: 0, color: 'rgba(255,255,255,0.1)', label: '' };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[!@#$%^&*]/.test(p)) score++;
    const map = [
      { pct: 0,   color: 'rgba(255,255,255,0.1)', label: '' },
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
    <ModernAuthLayout 
      title="Create Password"
      subtitle="Enter and confirm your new password below."
    >
      {/* Access denied */}
      {!otpVerified && !success && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={16} />
          <span>Access denied. Please verify your OTP first.</span>
        </div>
      )}

      {/* API Error */}
      {errors.api && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={16} />
          <span>{errors.api}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="auth-alert auth-alert-success">
          <CheckCircle size={18} />
          <span>Password reset successfully!</span>
        </div>
      )}

      {errors.general && <div className="auth-alert auth-alert-error">{errors.general}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rp-password">New Password</label>
          <div className="input-container">
            <Lock size={17} className="input-icon" />
            <input
              id="rp-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Min 8 chars, uppercase, number & symbol"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              autoComplete="new-password"
              disabled={!otpVerified || success || isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPassword)}
              className="eye-button"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {/* Strength bar */}
          {formData.password && (
            <div style={{ width:'100%', height:4, background:'rgba(255,255,255,0.1)', borderRadius:4, marginTop:8 }}>
              <div style={{ width:`${strength.pct}%`, height:'100%', background:strength.color, borderRadius:4, transition:'all 0.3s ease' }} />
            </div>
          )}
          {strength.label && formData.password && (
            <span style={{ fontSize:11, color:strength.color, marginTop:4, display:'block' }}>{strength.label}</span>
          )}
          {errors.password && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="rp-confirm">Confirm Password</label>
          <div className="input-container">
            <Lock size={17} className="input-icon" />
            <input
              id="rp-confirm"
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="auth-input"
              autoComplete="new-password"
              disabled={!otpVerified || success || isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="eye-button"
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.confirmPassword}</span>}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!otpVerified || isLoading || success}
        >
          {isLoading ? <><span className="spinner" /> Resetting…</> : success ? 'Password Reset ✓' : 'Reset Password →'}
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

export default ResetPassword;
