import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Phone, RefreshCw, ArrowLeft } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validation';
import { trainerRegister, verifyRegistrationOTP, resendRegistrationOTP } from '../../services/api';
import ModernAuthLayout from '../../student-auth/components/ModernAuthLayout';
import "../../student-auth/styles/ModernAuth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
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
  const [otpExpired, setOtpExpired] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpMsg, setOtpMsg] = useState({ type: '', text: '' });

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    return name.slice(0, 3) + "***" + name.slice(-2) + "@" + domain;
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const getTimerColor = (s) => s > 30 ? "#10b981" : s > 10 ? "#f59e0b" : "#ef4444";

  const handleClose = React.useCallback(() => {
    setShowOTP(false);
    navigate("/trainer/signup", { state: { formData } });
  }, [navigate, formData]);

  useEffect(() => {
    let interval;
    if (showOTP && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    } else if (otpTimer === 0 && showOTP) {
      setOtpExpired(true);
      setOtpMsg({ type: 'error', text: 'OTP expired. Please resend.' });
    }
    return () => clearInterval(interval);
  }, [showOTP, otpTimer]);

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
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!validateEmail(formData.email)) errs.email = 'Invalid email address';
    if (!/^[0-9]{10}$/.test(formData.phone)) errs.phone = 'Phone must be exactly 10 digits';
    if (!validatePassword(formData.password).isValid) errs.password = 'Min 8 chars, include a number & symbol';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
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
      setShowOTP(true);
      setOtpTimer(60);
      setOtpExpired(false);
    } catch (err) {
      if (err.message === "User already exists" || err.message.toLowerCase().includes('exist')) {
        setEmailError("User already exists. Try with another email.");
      } else {
        setApiError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernAuthLayout 
      title="Create Account"
      subtitle="Join as a professional trainer today."
    >
      {/* ── OTP POPUP ── */}
      {showOTP && (
        <div className="lp-otp-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(15px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="auth-form-card" style={{ maxWidth: '400px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <button style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px', opacity: 0.7 }} onClick={handleClose}>✕</button>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#3b82f6' }}>
              <Mail size={30} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px' }}>Verify Your Email</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>OTP sent to <strong>{maskEmail(formData.email)}</strong></p>
            
            {otpMsg.text && (
              <div className={`auth-alert auth-alert-${otpMsg.type === 'error' ? 'error' : 'success'}`}>
                {otpMsg.text}
              </div>
            )}

            <form onSubmit={handleVerifyOTP}>
              <div className="form-group">
                <input
                  type="text" maxLength={6} placeholder="0 0 0 0 0 0"
                  value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="auth-input" style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '8px', paddingLeft: '16px' }} required
                />
              </div>
              <div style={{ marginBottom: '20px', fontSize: '14px' }}>
                {otpExpired
                  ? <span style={{ color: '#ef4444' }}>OTP Expired</span>
                  : <span style={{ color: getTimerColor(otpTimer) }}>Expires in: {formatTime(otpTimer)}</span>}
              </div>
              {showSuccess
                ? <div className="auth-alert auth-alert-success">Account created! Redirecting...</div>
                : <button type="submit" className="submit-button" disabled={otpExpired}>
                    Verify Now →
                  </button>}
            </form>
            <button className="back-home" onClick={handleResendOTP} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              <RefreshCw size={14} /> Resend OTP
            </button>
          </div>
        </div>
      )}

      {apiError && <div className="auth-alert auth-alert-error">⚠ {apiError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Full Name</label>
          <div className="input-container">
            <User size={17} className="input-icon" />
            <input type="text" name="fullName" placeholder="Your full name"
              value={formData.fullName} onChange={handleChange}
              className="auth-input" />
          </div>
          {errors.fullName && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <div className="input-container">
            <Mail size={17} className="input-icon" />
            <input type="email" name="email" placeholder="you@example.com"
              value={formData.email} onChange={handleChange}
              className="auth-input" autoComplete="email" />
          </div>
          {emailError ? (
            <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{emailError}</span>
          ) : errors.email && (
            <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <div className="input-container">
            <Phone size={17} className="input-icon" />
            <input type="tel" name="phone" placeholder="10-digit mobile number"
              value={formData.phone} onChange={handleChange} maxLength={10}
              className="auth-input" />
          </div>
          {errors.phone && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <div className="input-container">
            <Lock size={17} className="input-icon" />
            <input type={showPassword ? "text" : "password"} name="password" placeholder="Min 8 chars"
              value={formData.password} onChange={handleChange}
              className="auth-input" />
            <button type="button" className="eye-button" onClick={() => setShowPassword(p => !p)}>
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <div className="input-container">
            <Lock size={17} className="input-icon" />
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Re-enter password"
              value={formData.confirmPassword} onChange={handleChange}
              className="auth-input" />
            <button type="button" className="eye-button" onClick={() => setShowConfirmPassword(p => !p)}>
              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirmPassword && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? <><span className="spinner" /> Creating Account...</> : "Create Account →"}
        </button>
      </form>

      <div className="form-footer">
        Already have an account? <Link to="/trainer/login">Sign In</Link>
      </div>

      <div style={{ textAlign: 'center' }}>
        <Link to="/" className="back-home"><ArrowLeft size={14} /> Back to Home</Link>
      </div>
    </ModernAuthLayout>
  );
};

export default Signup;