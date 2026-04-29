import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { validatePassword } from '../utils/validation';
import { studentResetPassword } from '../../services/api';
import ModernAuthLayout from '../components/ModernAuthLayout';
import "../styles/ModernAuth.css";

/* Password strength bar helper */
const getStrength = (pw) => {
  if (!pw) return { pct: 0, color: 'rgba(255,255,255,0.1)', label: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*]/.test(pw)) score++;
  const map = [
    { pct: 0, color: 'rgba(255,255,255,0.1)', label: '' },
    { pct: 25, color: '#ef4444', label: 'Weak' },
    { pct: 50, color: '#f97316', label: 'Fair' },
    { pct: 75, color: '#eab308', label: 'Good' },
    { pct: 100, color: '#22c55e', label: 'Strong' },
  ];
  return map[score];
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { otpVerified = false, email = '', resetToken = '' } = location.state || {};

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(formData.password);

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
    } else {
      if (!validatePassword(formData.password).isValid)
        errs.password = 'Min 8 chars, 1 uppercase, 1 number & 1 symbol';
      if (!formData.confirmPassword)
        errs.confirmPassword = 'Required';
      else if (formData.password !== formData.confirmPassword)
        errs.confirmPassword = 'Passwords do not match';
    }
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await studentResetPassword(resetToken, formData.password, formData.confirmPassword);
      setSuccess(true);
      setTimeout(() =>
        navigate('/student/login', { state: { fromReset: true } }),
        2500
      );

    } catch (err) {
      setErrors({ api: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernAuthLayout 
      title="Create New Password"
      subtitle="Set a strong password to secure your account."
    >
      {/* Access denied */}
      {!otpVerified && !success && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={15} />
          <span>Access denied. Please verify your OTP first.</span>
        </div>
      )}
      
      {/* API error */}
      {errors.api && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={15} /><span>{errors.api}</span>
        </div>
      )}
      
      {/* General error */}
      {errors.general && (
        <div className="auth-alert auth-alert-error">
          <AlertCircle size={15} /><span>{errors.general}</span>
        </div>
      )}
      
      {/* Success */}
      {success && (
        <div className="auth-alert auth-alert-success">
          <CheckCircle size={15} /><span>Password changed successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* New Password */}
        <div className="form-group">
          <label>New Password</label>
          <div className="input-container">
            <Lock size={17} className="input-icon" />
            <input
              type={showPw ? 'text' : 'password'}
              name="password" placeholder="Min 8 chars, uppercase, number & symbol"
              value={formData.password} onChange={handleChange}
              className="auth-input"
              disabled={!otpVerified || success || loading}
              autoComplete="new-password" autoFocus={otpVerified}
            />
            <button type="button" className="eye-button"
              onClick={() => setShowPw(!showPw)} tabIndex={-1} disabled={!otpVerified}>
              {showPw ? <EyeOff size={17}/> : <Eye size={17}/>}
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

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>
          <div className="input-container">
            <Lock size={17} className="input-icon" />
            <input
              type={showCfm ? 'text' : 'password'}
              name="confirmPassword" placeholder="Re-enter your new password"
              value={formData.confirmPassword} onChange={handleChange}
              className="auth-input"
              disabled={!otpVerified || success || loading}
              autoComplete="new-password"
            />
            <button type="button" className="eye-button"
              onClick={() => setShowCfm(!showCfm)} tabIndex={-1} disabled={!otpVerified}>
              {showCfm ? <EyeOff size={17}/> : <Eye size={17}/>}
            </button>
          </div>
          {errors.confirmPassword && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.confirmPassword}</span>}
        </div>

        <button
          type="submit" className="submit-button"
          disabled={!otpVerified || loading || success}
        >
          {loading
            ? <><span className="spinner"/> Resetting…</>
            : success ? 'Password Reset ✓' : 'Reset Password →'}
        </button>
      </form>
      
      <div style={{ textAlign: 'center' }}>
        <Link to="/student/login" className="back-home">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </ModernAuthLayout>
  );
};

export default ResetPassword;
