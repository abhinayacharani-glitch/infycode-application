import React, { useState }                from 'react';
import { useNavigate, useLocation, Link }  from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

import AuthLayout   from '../components/AuthLayout';
import AuthFormCard from '../components/AuthFormCard';
import PageWrapper  from '../components/PageWrapper';
import { validatePassword }    from '../utils/validation';
import { studentResetPassword } from '../../services/api';

/* Password strength bar helper — mirrors trainer-auth */
const getStrength = (pw) => {
  if (!pw) return { pct: 0, color: '#e2e8f0', label: '' };
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[!@#$%^&*]/.test(pw))   score++;
  const map = [
    { pct: 0,   color: '#e2e8f0', label: '' },
    { pct: 25,  color: '#ef4444', label: 'Weak' },
    { pct: 50,  color: '#f97316', label: 'Fair' },
    { pct: 75,  color: '#eab308', label: 'Good' },
    { pct: 100, color: '#22c55e', label: 'Strong' },
  ];
  return map[score];
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { otpVerified = false, email = '', resetToken = '' } = location.state || {};

  const [formData,  setFormData ] = useState({ password: '', confirmPassword: '' });
  const [errors,    setErrors   ] = useState({});
  const [showPw,    setShowPw   ] = useState(false);
  const [showCfm,   setShowCfm  ] = useState(false);
  const [loading,   setLoading  ] = useState(false);
  const [success,   setSuccess  ] = useState(false);

  const strength = getStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (errors.api)   setErrors(p => ({ ...p, api: '' }));
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
    <PageWrapper>
      <AuthLayout
        panelHeading="Reset Password"
      panelText="Set a new password for your account"
    >
      <AuthFormCard>
        <h1 className="sa-form-heading">Reset Password</h1>
        <p  className="sa-form-sub">Enter and confirm your new password below.</p>

        {/* Access denied */}
        {!otpVerified && !success && (
          <div className="sa-banner sa-banner--error" style={{ marginBottom:10 }}>
            <AlertCircle size={14} />
            <span>Access denied. Please verify your OTP first.</span>
          </div>
        )}
        {/* API error */}
        {errors.api && (
          <div className="sa-banner sa-banner--error" style={{ marginBottom:10 }}>
            <AlertCircle size={14} /><span>{errors.api}</span>
          </div>
        )}
        {/* General error */}
        {errors.general && (
          <div className="sa-banner sa-banner--error" style={{ marginBottom:10 }}>
            <AlertCircle size={14} /><span>{errors.general}</span>
          </div>
        )}
        {/* Success */}
        {success && (
          <div className="sa-banner sa-banner--success" style={{ marginBottom:10 }}>
            <CheckCircle size={14} /><span>Password changed successfully</span>
          </div>

        )}

        <form className="sa-form" onSubmit={handleSubmit} noValidate>

          {/* New Password */}
          <div className={`sa-input-wrap${!otpVerified ? ' sa-disabled-group':''}`}>
            <Lock size={15} className="sa-input-icon" />
            <input
              id="rp-password" type={showPw ? 'text' : 'password'}
              name="password" placeholder="Min 8 chars, uppercase, number & symbol"
              value={formData.password} onChange={handleChange}
              className={`sa-input${errors.password ? ' sa-input--error':''}`}
              disabled={!otpVerified || success || loading}
              autoComplete="new-password" autoFocus={otpVerified}
            />
            <button type="button" className="sa-eye-btn"
              onClick={() => setShowPw(!showPw)} tabIndex={-1} disabled={!otpVerified}>
              {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>

          {/* Strength bar */}
          {formData.password && (
            <div style={{ width:'100%', height:4, background:'#e2e8f0', borderRadius:4, marginTop:-6 }}>
              <div style={{ width:`${strength.pct}%`, height:'100%', background:strength.color, borderRadius:4, transition:'all 0.3s ease' }} />
            </div>
          )}
          {strength.label && formData.password && (
            <span style={{ fontSize:11, color:strength.color, alignSelf:'flex-start' }}>{strength.label}</span>
          )}
          {errors.password && <span className="sa-error-text">{errors.password}</span>}

          {/* Confirm Password */}
          <div className={`sa-input-wrap${!otpVerified ? ' sa-disabled-group':''}`}>
            <Lock size={15} className="sa-input-icon" />
            <input
              id="rp-confirm" type={showCfm ? 'text' : 'password'}
              name="confirmPassword" placeholder="Re-enter your new password"
              value={formData.confirmPassword} onChange={handleChange}
              className={`sa-input${errors.confirmPassword ? ' sa-input--error':''}`}
              disabled={!otpVerified || success || loading}
              autoComplete="new-password"
            />
            <button type="button" className="sa-eye-btn"
              onClick={() => setShowCfm(!showCfm)} tabIndex={-1} disabled={!otpVerified}>
              {showCfm ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>
          {errors.confirmPassword && <span className="sa-error-text">{errors.confirmPassword}</span>}

          <button
            type="submit" className="sa-submit-btn"
            disabled={!otpVerified || loading || success}
          >
            {loading
              ? <span className="sa-btn-inner"><span className="sa-spinner"/>Resetting…</span>
              : success ? 'Password Reset ✓' : 'Reset Password →'}
          </button>
        </form>

        <p className="sa-form-footer">
          <Link to="/student/login" className="sa-link">← Back to Login</Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
    </PageWrapper>
  );
};

export default ResetPassword;
