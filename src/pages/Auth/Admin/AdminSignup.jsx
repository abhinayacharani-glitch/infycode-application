import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { adminRegister, verifyRegistrationOTP, resendRegistrationOTP } from '../../../services/api';
import './adminAuth.css';
import './ForgotPassword.css';

const validateAdminEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

const validatePassword = (password) => ({
  isValid: password.length >= 8 && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password),
});

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    }
  }, [location.state]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [emailError, setEmailError] = useState('');

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
    navigate("/admin/signup", {
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

  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
      window.location.replace("/admin/login");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const handleResendOTP = async () => {
    setOtpTimer(60);
    setOtpExpired(false);
    setOtp('');
    setOtpMsg({ type: '', text: '' });
    
    try {
      await resendRegistrationOTP(formData.email, 'admin');
      setOtpMsg({ type: 'success', text: 'OTP resent successfully' });
    } catch (err) {
      setOtpMsg({ type: 'error', text: err.message });
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpMsg({ type: '', text: '' });

    try {
      await verifyRegistrationOTP(formData.email, otp, 'admin');
      setOtpVerified(true);

      setShowSuccess(true);
      setTimeout(() => {
        setShowOTP(false);
        navigate('/admin/login', { state: { message: 'Account created successfully. Please login.' } });
      }, 1500);
    } catch (err) {
      setOtpMsg({ type: 'error', text: err.message || 'Invalid OTP. Please try again.' });
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
    if (name === 'email') setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!validateAdminEmail(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone) newErrors.phone = 'Required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Must be exactly 10 digits';
    if (!validatePassword(formData.password).isValid)
      newErrors.password = 'Min 8 chars, 1 number, 1 symbol';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords mismatch';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const response = await adminRegister(
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
        setEmailError("User already exists. Try with another email.");
        return;
      }

      setShowOTP(true);
      setOtpTimer(60);
      setOtpExpired(false);
    } catch (err) {
      if (err.message === "User already exists" || err.message === "EMAIL_ALREADY_EXISTS" || err.message.toLowerCase().includes('exist')) {
        setEmailError("User already exists. Try with another email.");
      } else {
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="admin-wrapper" style={{ position: 'relative' }}>
      {/* ── OTP POPUP ── */}
      {showOTP && (
        <div className="otp-popup-overlay" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          zIndex: 1000, width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)',
          borderRadius: '24px', animation: 'fadeInScaleAdmin 0.3s ease-out'
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
                className="otp-input-admin-focus"
                required
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
                  className="admin-submit-btn"
                  style={{
                    marginBottom: '16px', padding: '14px', fontSize: '16px',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', width: '100%',
                    marginTop: 0
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
        @keyframes fadeInScaleAdmin {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .otp-input-admin-focus:focus {
          border-color: #2563eb !important;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
      <div className="admin-card admin-card--compact">

        {/* ── LEFT: Form ── */}
        <div className="admin-form-side admin-form-side--compact">
          <div className="admin-form-header">
            <h1 className="admin-form-heading">Create Admin Account</h1>
            <p className="admin-form-sub" style={{ marginBottom: '20px' }}>
              Manage and monitor InfyCode platform
            </p>
          </div>

          {apiError && (
            <div className="fp-banner fp-banner--error" style={{ marginBottom: '12px' }}>
              <span>{apiError}</span>
            </div>
          )}

          <form className="admin-form admin-form--compact" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="adminName">Full Name</label>
              <div className="admin-input-wrap">
                <User size={16} className="admin-input-icon" />
                <input
                  id="adminName"
                  type="text"
                  name="fullName"
                  placeholder="charani"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'admin-error' : ''}
                  disabled={isLoading}
                />
              </div>
              {errors.fullName && <span className="admin-error-text">{errors.fullName}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="adminEmail">Email</label>
              <div className="admin-input-wrap">
                <Mail size={16} className="admin-input-icon" />
                <input
                  id="adminEmail"
                  type="email"
                  name="email"
                  placeholder="admin@infycode.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'admin-error' : ''}
                  disabled={isLoading}
                />
              </div>
              {emailError ? (
                <span id="msg1" className="admin-error-text" style={{ color: '#ef4444', marginTop: '4px' }}>{emailError}</span>
              ) : errors.email && (
                <span className="admin-error-text">{errors.email}</span>
              )}
            </div>

            <div className="admin-form-group">
              <label htmlFor="adminPhone">Phone Number</label>
              <div className="admin-input-wrap">
                <Phone size={16} className="admin-input-icon" />
                <input
                  id="adminPhone"
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'admin-error' : ''}
                  disabled={isLoading}
                />
              </div>
              {errors.phone && <span className="admin-error-text">{errors.phone}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="adminPassword">Password</label>
              <div className="admin-input-wrap" style={{ position: 'relative' }}>
                <Lock size={16} className="admin-input-icon" />
                <input
                  id="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'admin-error' : ''}
                  disabled={isLoading}
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  className="admin-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="admin-error-text">{errors.password}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="adminConfirmPassword">Confirm Password</label>
              <div className="admin-input-wrap" style={{ position: 'relative' }}>
                <Lock size={16} className="admin-input-icon" />
                <input
                  id="adminConfirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'admin-error' : ''}
                  disabled={isLoading}
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  className="admin-toggle-pw"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="admin-error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <button
              type="submit"
              className="admin-submit-btn admin-submit-btn--compact"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="admin-btn-inner">
                  <span className="admin-spinner" />
                  Creating...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        {/* ── RIGHT: Blue Panel ── */}
        <div className="admin-panel-side">
          <div className="admin-panel-content">
            <h2 className="admin-panel-heading">Welcome<br />Back!</h2>
            <p className="admin-panel-sub">
              Access the command center to oversee your platform's entire ecosystem.
            </p>
            <Link to="/admin/login" className="admin-panel-btn">
              Sign In
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSignup;
