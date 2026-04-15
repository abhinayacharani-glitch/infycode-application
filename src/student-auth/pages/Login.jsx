import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, RefreshCw, CheckCircle } from "lucide-react";
import { validateEmail, validatePassword, validateFullName, validatePhone } from "../utils/validation";
import { studentLogin, studentRegister, studentVerifyRegistrationOTP, resendRegistrationOTP } from "../../services/api";


import AuthLayout from '../components/AuthLayout';
import AuthFormCard from '../components/AuthFormCard';
import PageWrapper from '../components/PageWrapper';
import "../styles/authComponents.css"; // Use standardized styles
import "../styles/Login.css"; // Include sliding panel animations

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // Initialize isActive based on URL
  const [isActive, setIsActive] = useState(location.pathname.includes("signup"));

  // Sync isActive with URL changes
  React.useEffect(() => {
    setIsActive(location.pathname.includes("signup"));
  }, [location.pathname]);

  // --- SIGN IN STATE ---
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signInErrors, setSignInErrors] = useState({});
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [signInApiError, setSignInApiError] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // --- SIGN UP STATE ---
  const [signUpForm, setSignUpForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [signUpErrors, setSignUpErrors] = useState({});
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [signUpApiError, setSignUpApiError] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- OTP POPUP STATE ---
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpExpired, setOtpExpired] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpMsg, setOtpMsg] = useState({ type: "", text: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    if (name.length <= 6) return name[0] + "***" + name[name.length - 1] + "@" + domain;
    return name.slice(0, 3) + "***" + name.slice(-3) + "@" + domain;
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds > 30) return "#10b981"; // Green
    if (seconds > 10) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  React.useEffect(() => {
    let interval;
    if (showOTP && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setOtpExpired(true);
    }
    return () => clearInterval(interval);
  }, [showOTP, otpTimer]);

  // --- SUCCESS MESSAGE TIMER ---
  React.useEffect(() => {
    if (location.state?.fromRegister || location.state?.fromReset) {
      const msg = location.state.fromRegister
        ? "Account created successfully, please sign in"
        : "Password reset successful, please sign in";
      setSuccessMessage(msg);

      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      // Clear navigation state to prevent re-display on reload
      window.history.replaceState({}, document.title);

      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // --- HANDLERS ---
  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInForm(prev => ({ ...prev, [name]: value }));
    if (signInErrors[name]) setSignInErrors(prev => ({ ...prev, [name]: "" }));
    setSignInApiError("");
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm(prev => ({ ...prev, [name]: value }));
    if (signUpErrors[name]) setSignUpErrors(prev => ({ ...prev, [name]: "" }));
    setSignUpApiError("");
  };

  const toggleMode = () => {
    navigate(isActive ? "/student/login" : "/student/signup");
    setSignInErrors({});
    setSignUpErrors({});
    setSignInApiError("");
    setSignUpApiError("");
  };

  // --- SUBMIT ---
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!signInForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(signInForm.email)) {
      errors.email = "Invalid email address";
    }
    if (!signInForm.password) errors.password = "Password is required";

    if (Object.keys(errors).length > 0) {
      setSignInErrors(errors);
      return;
    }

    setIsSignInLoading(true);
    try {
      const data = await studentLogin(signInForm.email.trim(), signInForm.password);

      localStorage.setItem("token", data.token); // Add this line for App.jsx compatibility
      localStorage.setItem("user", JSON.stringify({
        token: data.token,
        fullname: data.fullname || data.fullName,
        email: data.email,
        role: data.role || "student"
      }));
      navigate("/student-dashboard");
    } catch (err) {

      setSignInApiError(err.message);
    } finally {
      setIsSignInLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!validateFullName(signUpForm.fullName)) errors.fullName = "Full name must be at least 3 characters";
    if (!signUpForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(signUpForm.email)) {
      errors.email = "Invalid email address";
    }
    if (!validatePhone(signUpForm.phone)) errors.phone = "Invalid phone number (10 digits)";

    const pwValidation = validatePassword(signUpForm.password);
    if (!pwValidation.isValid) errors.password = "Min 8 chars, 1 uppercase, 1 number & 1 symbol";
    if (signUpForm.password !== signUpForm.confirmPassword) errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setSignUpErrors(errors);
      return;
    }

    setIsSignUpLoading(true);
    try {
      await studentRegister(
        signUpForm.fullName.trim(),
        signUpForm.email.trim(),
        signUpForm.phone.trim(),
        signUpForm.password,
        signUpForm.confirmPassword
      );

      // Show OTP popup instead of switching mode
      setShowOTP(true);
      setOtpTimer(60);
      setOtpExpired(false);
      setOtpMsg({ type: "", text: "" });
    } catch (err) {

      setSignUpApiError(err.message);
    } finally {
      setIsSignUpLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpMsg({ type: "", text: "" });

    try {
      await studentVerifyRegistrationOTP(signUpForm.email, otp);
      setOtpMsg({ type: "success", text: "Registration successfully" });
      setShowSuccess(true);



      setTimeout(() => {
        setShowOTP(false);
        setIsActive(false); // Switch to login
        setShowSuccess(false);
        // Navigate to login with state to trigger the success message
        navigate('/student/login', { state: { fromRegister: true }, replace: true });
      }, 2500);

    } catch (err) {
      setOtpMsg({ type: "error", text: err.message || "Invalid OTP. Please try again." });
    }
  };

  const handleResendOTP = async () => {
    setOtpTimer(60);
    setOtpExpired(false);
    setOtp("");
    setOtpMsg({ type: "", text: "" });

    try {
      await resendRegistrationOTP({ email: signUpForm.email, role: "student" });
      setOtpMsg({ type: "success", text: "OTP resent successfully" });
    } catch (err) {
      setOtpMsg({ type: "error", text: err.message });
    }
  };

  const handleClose = () => {
    setShowOTP(false);
  };

  return (
    <PageWrapper>
      <div className="studentLogin-wrapper">
        {/* ── OTP POPUP ── */}
        {showOTP && (
          <div className="otp-popup-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(4px)',
            animation: 'fadeInScale 0.3s ease-out'
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

              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#1e293b', fontFamily: 'Urbanist, sans-serif' }}>
                Verify Your <span style={{ color: '#1E90FF' }}>Email</span>
              </h2>
              <p style={{ fontSize: '14.5px', color: '#64748b', marginBottom: '24px', lineHeight: '1.5', fontFamily: 'Urbanist, sans-serif' }}>
                Enter the OTP sent to <br /><strong style={{ color: '#0f172a' }}>{maskEmail(signUpForm.email)}</strong>
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
                  fontFamily: 'Urbanist, sans-serif'
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
                    color: '#1e293b', fontWeight: '600', transition: 'border-color 0.2s',
                    fontFamily: 'Urbanist, sans-serif'
                  }}
                  className="sa-otp-input-popup"
                  required
                />

                <div style={{ marginBottom: '24px' }}>
                  {otpExpired ? (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', background: '#fff1f2', color: '#e11d48',
                      borderRadius: '20px', fontSize: '13px', fontWeight: '600',
                      fontFamily: 'Urbanist, sans-serif'
                    }}>
                      <span>OTP expired</span>
                    </div>
                  ) : (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '6px 12px', background: '#f8fafc', color: '#64748b',
                      borderRadius: '20px', fontSize: '13px', fontWeight: '500',
                      fontFamily: 'Urbanist, sans-serif'
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
                    borderRadius: '10px', fontWeight: '600', marginBottom: '16px',
                    fontFamily: 'Urbanist, sans-serif'
                  }}>
                    Registration successfully
                  </div>

                ) : (
                  <button
                    type="submit"
                    className="sa-submit-btn"
                    style={{
                      marginBottom: '16px', padding: '14px', fontSize: '16px',
                      boxShadow: '0 4px 12px rgba(30, 144, 255, 0.2)',
                      width: '100%', margin: '0 0 16px 0'
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
                  background: 'none', border: 'none', color: '#1E90FF',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  margin: '0 auto', transition: 'color 0.2s',
                  fontFamily: 'Urbanist, sans-serif'
                }}
              >
                {(otpExpired || otpMsg.type === 'error') && <RefreshCw size={14} />}
                Resend OTP
              </button>
            </div>
          </div>
        )}

        <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .sa-otp-input-popup:focus {
          border-color: #1E90FF !important;
          box-shadow: 0 0 0 4px rgba(30, 144, 255, 0.1);
        }
      `}</style>

        <div className={`studentLogin-container ${isActive ? "studentLogin-active" : ""}`} id="container">
          
          {/* SIGN UP FORM */}
          <div className="studentLogin-form-container studentLogin-sign-up">
            <form className="sa-form" onSubmit={handleSignUpSubmit} noValidate>
              <h1 className="sa-form-heading">Create Account</h1>
              <p className="sa-form-sub">Join us to start your learning journey</p>

              {signUpApiError && <p className="sa-api-error">{signUpApiError}</p>}

              <div className="sa-input-wrap">
                <User size={15} className="sa-input-icon" />
                <input
                  type="text" name="fullName" placeholder="Full Name"
                  value={signUpForm.fullName} onChange={handleSignUpChange}
                  className={`sa-input${signUpErrors.fullName ? ' sa-input--error' : ''}`}
                />
              </div>
              {signUpErrors.fullName && <span className="sa-error-text">{signUpErrors.fullName}</span>}

              <div className="sa-input-wrap">
                <Mail size={15} className="sa-input-icon" />
                <input
                  type="email" name="email" placeholder="Email Address"
                  value={signUpForm.email} onChange={handleSignUpChange}
                  className={`sa-input${signUpErrors.email ? ' sa-input--error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {signUpErrors.email && <span className="sa-error-text">{signUpErrors.email}</span>}

              <div className="sa-input-wrap">
                <Phone size={15} className="sa-input-icon" />
                <input
                  type="tel" name="phone" placeholder="Phone Number"
                  value={signUpForm.phone} onChange={handleSignUpChange}
                  maxLength={10}
                  className={`sa-input${signUpErrors.phone ? ' sa-input--error' : ''}`}
                />
              </div>
              {signUpErrors.phone && <span className="sa-error-text">{signUpErrors.phone}</span>}

              <div className="sa-input-wrap">
                <Lock size={15} className="sa-input-icon" />
                <input
                  type={showSignUpPassword ? "text" : "password"} name="password" placeholder="Password"
                  value={signUpForm.password} onChange={handleSignUpChange}
                  className={`sa-input${signUpErrors.password ? ' sa-input--error' : ''}`}
                />
                <button
                  type="button" onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="sa-eye-btn"
                >
                  {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {signUpErrors.password && <span className="sa-error-text">{signUpErrors.password}</span>}

              <div className="sa-input-wrap">
                <Lock size={15} className="sa-input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password"
                  value={signUpForm.confirmPassword} onChange={handleSignUpChange}
                  className={`sa-input${signUpErrors.confirmPassword ? ' sa-input--error' : ''}`}
                />
                <button
                  type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="sa-eye-btn"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {signUpErrors.confirmPassword && <span className="sa-error-text">{signUpErrors.confirmPassword}</span>}

              <button type="submit" className="sa-submit-btn" disabled={isSignUpLoading}>
                {isSignUpLoading ? "Creating..." : "Sign Up"}
              </button>
            </form>
          </div>

          {/* SIGN IN FORM */}
          <div className="studentLogin-form-container studentLogin-sign-in">
            <form className="sa-form" onSubmit={handleSignInSubmit} noValidate>
              <h1 className="sa-form-heading">Sign In</h1>
              <p className="sa-form-sub">Glad to see you again!</p>

              {successMessage && (
                <div className="sa-banner sa-banner--success">
                  <CheckCircle size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              {signInApiError && <p className="sa-api-error">{signInApiError}</p>}

              <div className="sa-input-wrap">
                <Mail size={15} className="sa-input-icon" />
                <input
                  type="email" name="email" placeholder="Email Address"
                  value={signInForm.email} onChange={handleSignInChange}
                  className={`sa-input${signInErrors.email ? ' sa-input--error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {signInErrors.email && <span className="sa-error-text">{signInErrors.email}</span>}

              <div className="sa-input-wrap">
                <Lock size={15} className="sa-input-icon" />
                <input
                  type={showSignInPassword ? "text" : "password"} name="password" placeholder="Password"
                  value={signInForm.password} onChange={handleSignInChange}
                  className={`sa-input${signInErrors.password ? ' sa-input--error' : ''}`}
                  autoComplete="current-password"
                />
                <button
                  type="button" onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="sa-eye-btn"
                >
                  {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {signInErrors.password && <span className="sa-error-text">{signInErrors.password}</span>}

              <div className="sa-forgot-wrap" style={{ margin: "10px 0" }}>
                <Link to="/student/forgot-password" data-id="forgot-link" className="sa-forgot-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="sa-submit-btn" disabled={isSignInLoading}>
                {isSignInLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* TOGGLE PANELS */}
          <div className="studentLogin-toggle-container">
            <div className="studentLogin-toggle">
              <div className="studentLogin-toggle-panel studentLogin-toggle-left">
                <h1>Welcome Back!</h1>
                <p>Enter your personal details to use all site features</p>
                <button className="studentLogin-hidden" onClick={toggleMode} type="button">Sign In</button>
              </div>
              <div className="studentLogin-toggle-panel studentLogin-toggle-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button className="studentLogin-hidden" onClick={toggleMode} type="button">Sign Up</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}

export default Login;