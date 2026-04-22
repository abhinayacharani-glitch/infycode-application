import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone, RefreshCw } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validation';
import { trainerRegister, verifyRegistrationOTP, resendRegistrationOTP } from '../../services/api';
import '../styles/login.css';
import '../styles/signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors]     = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);
  const [isLoading, setIsLoading]       = useState(false);
  const [apiError, setApiError]         = useState('');
  const [emailError, setEmailError]     = useState('');

  // ── OTP POPUP STATE ──
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpMsg, setOtpMsg] = useState({ type: '', text: '' });

  const maskEmail = (email) => {
    const name = email.split("@")[0];
    if (name.length <= 6) return name[0] + "***" + name[name.length - 1];
    return name.slice(0, 3) + "***" + name.slice(-3);
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds > 30) return "#10b981"; // Green
    if (seconds > 10) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const handleClose = React.useCallback(() => {
    setShowOTP(false);
    navigate("/trainer/signup", {
      state: { formData }
    });
  }, [navigate, formData]);

  React.useEffect(() => {
    let interval;
    if (showOTP && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0 && showOTP) {
      setOtpExpired(true);
      setOtpMsg({ type: 'error', text: 'OTP expired. Returning to signup form...' });
      
      const timeout = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [showOTP, otpTimer, handleClose]);

  // Remove back button interception that might interfere with navigation

  const handleResendOTP = async () => {
    setOtpTimer(60);
    setOtpExpired(false);
    setOtp('');
    setOtpMsg({ type: '', text: '' });
    
    try {
      await resendRegistrationOTP(formData.email, 'trainer');
      setOtpMsg({ type: 'success', text: 'OTP resent successfully' });
    } catch (err) {
      setOtpMsg({ type: 'error', text: err.message });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpMsg({ type: '', text: '' });

    try {
      await verifyRegistrationOTP(formData.email, otp, 'trainer');
      setOtpVerified(true);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowOTP(false);
        navigate('/trainer/login', { state: { message: 'Account created successfully. Please login.' } });
      }, 1500);
    } catch (err) {
      setOtpMsg({ type: 'error', text: err.message || 'Invalid OTP. Please try again.' });
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (apiError) setApiError('');
    if (name === 'email') setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.fullName.trim())                        errs.fullName        = 'Full name is required';
    if (!validateEmail(formData.email))                   errs.email           = 'Invalid email address';
    if (!/^[0-9]{10}$/.test(formData.phone))              errs.phone           = 'Phone must be exactly 10 digits';
    if (!validatePassword(formData.password).isValid)     errs.password        = 'Min 8 chars, include a number & symbol';
    if (formData.password !== formData.confirmPassword)   errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await trainerRegister(
        formData.fullName,
        formData.email,
        formData.phone,
        formData.password,
        formData.confirmPassword
      );

      if (!response.success && response.message === "User already exists") {
        setEmailError("User already exists. Try with another email.");
        return;
      }

      if (response && response.error === 'EMAIL_ALREADY_EXISTS') {
        setEmailError("Email already exists. Try with another mail.");
        return;
      }

      // ── NEW BACKEND: Show OTP popup (Bypassable) ──
      setShowOTP(true);
      setOtpTimer(60);
      setOtpExpired(false);
    } catch (err) {
      if (err.message === "User already exists" || err.message === 'EMAIL_ALREADY_EXISTS' || err.message.toLowerCase().includes('exist')) {
        setEmailError("User already exists. Try with another email.");
      } else {
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="auth-wrapper" style={{ position: 'relative' }}>
      {/* ── OTP POPUP ── */}
      {showOTP && (
        <div className="otp-popup-overlay" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 1000, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)',
          borderRadius: '24px', animation: 'fadeInScale 0.3s ease-out'
        }}>
          <div style={{
            background: 'white', padding: '32px', borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0',
            textAlign: 'center', width: '90%', maxWidth: '380px', position: 'relative'
          }}>
            <button
              onClick={handleClose}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', fontSize: '20px',
                cursor: 'pointer', color: '#64748b', transition: 'color 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '50%',
              }}
              onMouseEnter={(e) => e.target.style.color = '#ef4444'}
              onMouseLeave={(e) => e.target.style.color = '#64748b'}
            >
              ✕
            </button>
            <div style={{
              width: '56px', height: '56px', background: '#eff6ff', color: '#2563eb',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Mail size={28} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
              Verify Your <span style={{ color: '#2563eb' }}>Email</span>
            </h2>
            <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
              Enter the OTP sent to <br /><strong style={{ color: '#0f172a' }}>{maskEmail(formData.email)}</strong>
            </p>

            {otpMsg.text && (
              <div style={{
                marginBottom: '16px',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: otpMsg.type === 'error' ? '#fef2f2' : '#f0fdf4',
                color: otpMsg.type === 'error' ? '#ef4444' : '#10b981',
                border: `1px solid ${otpMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
              }}>
                {otpMsg.text}
              </div>
            )}

            <form onSubmit={handleVerifyOTP}>
              <input
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%', padding: '14px', borderRadius: '10px',
                  border: '2px solid #e2e8f0', fontSize: '22px', textAlign: 'center',
                  letterSpacing: '8px', marginBottom: '20px', outline: 'none',
                  color: '#1e293b', fontWeight: '600', transition: 'border-color 0.2s'
                }}
                className="otp-input-focus"
              />

              <div style={{ marginBottom: '24px' }}>
                {otpExpired ? (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', background: '#fff1f2', color: '#e11d48',
                    borderRadius: '20px', fontSize: '13px', fontWeight: '600'
                  }}>
                    <span>OTP expired</span>
                  </div>
                ) : (
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '6px 12px', background: '#f8fafc', color: '#64748b',
                    borderRadius: '20px', fontSize: '13px', fontWeight: '500'
                  }}>
                    <span style={{ color: getTimerColor(otpTimer) }}>
                      {formatTime(otpTimer)}
                    </span>
                  </div>
                )}
              </div>

              {showSuccess ? (
                <div style={{
                  padding: '12px', background: '#f0fdf4', color: '#16a34a',
                  borderRadius: '10px', fontWeight: '600', marginBottom: '16px'
                }}>
                  Account created successfully!
                </div>
              ) : (
                <button
                  type="submit"
                  className="submit-btn"
                  style={{
                    marginBottom: '16px', padding: '14px', fontSize: '16px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                  }}
                  disabled={otpExpired}
                >
                  Verify Now →
                </button>
              )}
            </form>

            <button
              onClick={handleResendOTP}
              type="button"
              style={{
                background: 'none', border: 'none', color: '#2563eb',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                margin: '0 auto', transition: 'color 0.2s'
              }}
            >
              {otpExpired && <RefreshCw size={14} />}
              Resend OTP
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .otp-input-focus:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
      <div className="auth-card">

        {/* ── LEFT: Branded Visual (centered) ── */}
        <div className="auth-image-section">
          <img src="../assets/training-image.png" alt="" className="auth-image" />
          <div className="auth-image-overlay" />

          <div className="auth-image-content">
            <h2 className="auth-tagline">
              Empowering Trainers.
              <span>Building Futures.</span>
            </h2>
            <p className="auth-tagline-sub">
              Join thousands of professional trainers shaping the next generation.
            </p>

            <div className="auth-stats">
              <div className="stat-pill">
                <strong>12K+</strong>
                <span>Trainers</span>
              </div>
              <div className="stat-pill">
                <strong>98%</strong>
                <span>Satisfaction</span>
              </div>
              <div className="stat-pill">
                <strong>50+</strong>
                <span>Courses</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Signup Form ── */}
        <div className="auth-form-section signup-form-section">
          <div className="auth-header">
            <h1>Create Account</h1>
            <p>Join as a professional trainer today.</p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="error-text" style={{
              padding: '10px 14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              marginBottom: '12px',
              textAlign: 'center',
            }}>
              {apiError}
            </div>
          )}

          <form className="auth-form signup-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="su-name">Full Name</label>
              <div className="input-wrapper">
                <User size={17} className="input-icon" />
                <input
                  id="su-name" type="text" name="fullName"
                  placeholder="charani"
                  value={formData.fullName} onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="su-email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon" />
                <input
                  id="su-email" type="email" name="email"
                  placeholder="name@example.com"
                  value={formData.email} onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {emailError ? (
                <span id="msg1" className="error-text" style={{ color: '#ef4444', marginTop: '4px' }}>{emailError}</span>
              ) : errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="su-phone">Phone Number</label>
              <div className="input-wrapper">
                <Phone size={17} className="input-icon" />
                <input
                  id="su-phone" type="tel" name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone} onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  maxLength={10}
                  autoComplete="tel"
                  disabled={isLoading}
                />
              </div>
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="su-password">Password</label>
              <div className="input-wrapper" style={{ position: 'relative', width: '100%' }}>
                <Lock size={17} className="input-icon" />
                <input
                  id="su-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Min 8 chars, include number & symbol"
                  value={formData.password} onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  autoComplete="new-password"
                  disabled={isLoading}
                  style={{ paddingRight: '48px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="su-confirm">Confirm Password</label>
              <div className="input-wrapper" style={{ position: 'relative', width: '100%' }}>
                <Lock size={17} className="input-icon" />
                <input
                  id="su-confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword} onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  autoComplete="new-password"
                  disabled={isLoading}
                  style={{ paddingRight: '48px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?
            <Link 
              to="/trainer/login" 
              state={{ fromSignup: true }}
              onClick={(e) => {
                if (location.state?.fromLogin) {
                  e.preventDefault();
                  navigate(-1);
                }
              }}
            >
              Login here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;