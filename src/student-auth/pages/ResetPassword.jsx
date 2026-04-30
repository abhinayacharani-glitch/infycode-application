import React, { useState }                from 'react';
import { useNavigate, useLocation, Link }  from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

import AuthLayout   from '../components/AuthLayout';
import AuthFormCard from '../components/AuthFormCard';
import PageWrapper  from '../components/PageWrapper';
import "../styles/Login.css";
import { validatePassword }    from '../utils/validation';
import { studentResetPassword } from '../../services/api';
import logoIcon from "../../assets/infycode-final-logo4-1.png";
import logoText from "../../assets/color-logo-3.jpeg";
import LoginBackground from "../components/LoginBackground";
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
    <div className="lp-root">
      {/* Animated BG */}
      <LoginBackground />

      <div className="lp-layout">
        {/* LEFT — Logo only */}
        <div className="lp-left">
          <div className="lp-logo-block">
            <img src={logoIcon} alt="InfyCode" className="lp-logo-icon" />
            <img src={logoText} alt="InfyCode" className="lp-logo-text" />
            <p className="lp-logo-sub">Your Career Starts Here</p>
          </div>
          <div className="lp-left-switch">
            <p>Back to login?</p>
            <button onClick={() => navigate('/student/login')} className="lp-switch-btn">
              Back to Sign In →
            </button>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="lp-right">
          <div className="lp-card">
            <div className="lp-card-header">
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(139,92,246,0.15))', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#a78bfa' }}>
                <Lock size={28} />
              </div>
              <h1>Reset Password</h1>
              <p>Enter and confirm your new password below.</p>
            </div>

            {!otpVerified && !success && (
              <div className="lp-alert lp-alert-error">
                <AlertCircle size={14} style={{marginRight: 6}} /> Access denied. Please verify your OTP first.
              </div>
            )}
            {errors.api && (
              <div className="lp-alert lp-alert-error">
                <AlertCircle size={14} style={{marginRight: 6}} /> {errors.api}
              </div>
            )}
            {errors.general && (
              <div className="lp-alert lp-alert-error">
                <AlertCircle size={14} style={{marginRight: 6}} /> {errors.general}
              </div>
            )}
            {success && (
              <div className="lp-alert lp-alert-success">
                <CheckCircle size={14} style={{marginRight: 6}} /> Password changed successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="lp-form">
              {/* New Password */}
              <div className="lp-field">
                <label>New Password</label>
                <div className="lp-input-wrap">
                  <Lock size={15} className="lp-icon" />
                  <input
                    id="rp-password" type={showPw ? 'text' : 'password'}
                    name="password" placeholder="Min 8 chars, uppercase, number & symbol"
                    value={formData.password} onChange={handleChange}
                    className={`lp-input${errors.password ? ' err' : ''}`}
                    disabled={!otpVerified || success || loading}
                    autoComplete="new-password" autoFocus={otpVerified}
                  />
                  <button type="button" className="lp-eye-btn" onClick={() => setShowPw(!showPw)} disabled={!otpVerified} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                
                {/* Strength bar */}
                {formData.password && (
                  <div style={{ width:'100%', height:4, background:'#e2e8f0', borderRadius:4, marginTop: 8 }}>
                    <div style={{ width:`${strength.pct}%`, height:'100%', background:strength.color, borderRadius:4, transition:'all 0.3s ease' }} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  {errors.password ? <span className="lp-err">{errors.password}</span> : <span />}
                  {strength.label && formData.password && (
                    <span style={{ fontSize:11, color:strength.color }}>{strength.label}</span>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="lp-field">
                <label>Confirm Password</label>
                <div className="lp-input-wrap">
                  <Lock size={15} className="lp-icon" />
                  <input
                    id="rp-confirm" type={showCfm ? 'text' : 'password'}
                    name="confirmPassword" placeholder="Re-enter your new password"
                    value={formData.confirmPassword} onChange={handleChange}
                    className={`lp-input${errors.confirmPassword ? ' err' : ''}`}
                    disabled={!otpVerified || success || loading}
                    autoComplete="new-password"
                  />
                  <button type="button" className="lp-eye-btn" onClick={() => setShowCfm(!showCfm)} disabled={!otpVerified} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    {showCfm ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                {errors.confirmPassword && <span className="lp-err">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="lp-btn" disabled={!otpVerified || loading || success}>
                {loading
                  ? <><span className="lp-spinner"/>Resetting…</>
                  : success ? 'Password Reset ✓' : 'Reset Password →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
