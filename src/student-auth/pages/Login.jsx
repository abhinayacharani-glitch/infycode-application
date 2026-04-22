import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, RefreshCw, CheckCircle, ArrowLeft } from "lucide-react";
import { validateEmail, validatePassword, validateFullName, validatePhone } from "../utils/validation";
import { studentLogin, studentRegister, studentVerifyRegistrationOTP, resendRegistrationOTP } from "../../services/api";
import logoIcon from "../../assets/infycode-final-logo4-1.png";
import logoText from "../../assets/color-logo-3.jpeg";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(location.pathname.includes("signup"));

  React.useEffect(() => { setIsActive(location.pathname.includes("signup")); }, [location.pathname]);

  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signInErrors, setSignInErrors] = useState({});
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [signInApiError, setSignInApiError] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const [signUpForm, setSignUpForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [signUpErrors, setSignUpErrors] = useState({});
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [signUpApiError, setSignUpApiError] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    return name.slice(0, 3) + "***" + name.slice(-2) + "@" + domain;
  };
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const getTimerColor = (s) => s > 30 ? "#10b981" : s > 10 ? "#f59e0b" : "#ef4444";

  React.useEffect(() => {
    let interval;
    if (showOTP && otpTimer > 0) { interval = setInterval(() => setOtpTimer(p => p - 1), 1000); }
    else if (otpTimer === 0) setOtpExpired(true);
    return () => clearInterval(interval);
  }, [showOTP, otpTimer]);

  React.useEffect(() => {
    if (location.state?.fromRegister || location.state?.fromReset) {
      const msg = location.state.fromRegister ? "Account created! Please sign in." : "Password reset! Please sign in.";
      setSuccessMessage(msg);
      const t = setTimeout(() => setSuccessMessage(""), 5000);
      window.history.replaceState({}, document.title);
      return () => clearTimeout(t);
    }
  }, [location.state]);

  const handleSignInChange = (e) => { const { name, value } = e.target; setSignInForm(p => ({ ...p, [name]: value })); if (signInErrors[name]) setSignInErrors(p => ({ ...p, [name]: "" })); setSignInApiError(""); };
  const handleSignUpChange = (e) => { const { name, value } = e.target; setSignUpForm(p => ({ ...p, [name]: value })); if (signUpErrors[name]) setSignUpErrors(p => ({ ...p, [name]: "" })); setSignUpApiError(""); };

  const toggleMode = () => {
    navigate(isActive ? "/student/login" : "/student/signup", { state: { fromOpposite: true } });
    setSignInErrors({}); setSignUpErrors({}); setSignInApiError(""); setSignUpApiError("");
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!signInForm.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(signInForm.email)) errors.email = "Invalid email";
    if (!signInForm.password) errors.password = "Password is required";
    if (Object.keys(errors).length > 0) { setSignInErrors(errors); return; }
    setIsSignInLoading(true);
    try {
      const data = await studentLogin(signInForm.email.trim(), signInForm.password);
      localStorage.setItem("user", JSON.stringify({ token: data.token, fullname: data.fullname || data.fullName, email: data.email, role: data.role || "student" }));
      navigate("/student-dashboard");
    } catch (err) { setSignInApiError(err.message); }
    finally { setIsSignInLoading(false); }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!validateFullName(signUpForm.fullName)) errors.fullName = "Full name must be at least 3 characters";
    if (!signUpForm.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(signUpForm.email)) errors.email = "Invalid email";
    if (!validatePhone(signUpForm.phone)) errors.phone = "Invalid phone number (10 digits)";
    if (!validatePassword(signUpForm.password).isValid) errors.password = "Min 8 chars, 1 uppercase, 1 number & 1 symbol";
    if (signUpForm.password !== signUpForm.confirmPassword) errors.confirmPassword = "Passwords do not match";
    if (Object.keys(errors).length > 0) { setSignUpErrors(errors); return; }
    setIsSignUpLoading(true);
    try {
      await studentRegister(signUpForm.fullName.trim(), signUpForm.email.trim(), signUpForm.phone.trim(), signUpForm.password, signUpForm.confirmPassword);
      setShowOTP(true); setOtpTimer(60); setOtpExpired(false); setOtpMsg({ type: "", text: "" });
    } catch (err) { setSignUpApiError(err.message); }
    finally { setIsSignUpLoading(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setOtpMsg({ type: "", text: "" });
    try {
      await studentVerifyRegistrationOTP(signUpForm.email, otp);
      setShowSuccess(true);
      setTimeout(() => { setShowOTP(false); setIsActive(false); setShowSuccess(false); navigate("/student/login", { state: { fromRegister: true }, replace: true }); }, 2500);
    } catch (err) { setOtpMsg({ type: "error", text: err.message || "Invalid OTP." }); }
  };

  const handleResendOTP = async () => {
    setOtpTimer(60); setOtpExpired(false); setOtp(""); setOtpMsg({ type: "", text: "" });
    try { await resendRegistrationOTP({ email: signUpForm.email, role: "student" }); setOtpMsg({ type: "success", text: "OTP resent!" }); }
    catch (err) { setOtpMsg({ type: "error", text: err.message }); }
  };

  return (
    <div className="lp-root">
      {/* ── ANIMATED BACKGROUND ── */}
      <div className="lp-bg">
        <div className="lp-grad" />
        {/* Particles */}
        {[...Array(40)].map((_, i) => (
          <div 
            key={i} 
            className={`lp-particle lp-particle-${['sm','md','lg'][i % 3]}`} 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              '--del': `${Math.random() * 10}s`,
              '--dur': `${10 + Math.random() * 10}s`
            }} 
          />
        ))}
        {/* Floating geometric shapes */}
        {[...Array(18)].map((_, i) => (
          <div key={i} className={`lp-shape lp-shape-${(i % 4) + 1}`} style={{ '--i': i }} />
        ))}
        {/* Floating orbs */}
        <div className="lp-orb lp-orb-a" />
        <div className="lp-orb lp-orb-b" />
        <div className="lp-orb lp-orb-c" />
      </div>

      {/* ── OTP POPUP ── */}
      {showOTP && (
        <div className="lp-otp-overlay">
          <div className="lp-otp-card">
            <button className="lp-otp-close" onClick={() => setShowOTP(false)}>✕</button>
            <div className="lp-otp-icon"><Mail size={26} /></div>
            <h2>Verify Your <span>Email</span></h2>
            <p>OTP sent to <strong>{maskEmail(signUpForm.email)}</strong></p>
            {otpMsg.text && <div className={`lp-otp-msg ${otpMsg.type}`}>{otpMsg.text}</div>}
            <form onSubmit={handleVerifyOTP}>
              <input
                type="text" maxLength={6} placeholder="0  0  0  0  0  0"
                value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="lp-otp-input" required
              />
              <div className="lp-otp-timer">
                {otpExpired
                  ? <span className="expired">OTP Expired</span>
                  : <span style={{ color: getTimerColor(otpTimer) }}>{formatTime(otpTimer)}</span>}
              </div>
              {showSuccess
                ? <div className="lp-otp-success">Registration successful! Redirecting...</div>
                : <button type="submit" className="lp-btn" disabled={otpExpired}>Verify Now →</button>}
            </form>
            <button className="lp-otp-resend" onClick={handleResendOTP}>
              {(otpExpired || otpMsg.type === "error") && <RefreshCw size={13} />} Resend OTP
            </button>
          </div>
        </div>
      )}

      {/* ── LAYOUT ── */}
      <div className="lp-layout">

        {/* LEFT — Logo only */}
        <div className="lp-left">
          <div className="lp-logo-block">
            {/* Icon */}
            <img src={logoIcon} alt="InfyCode" className="lp-logo-icon" />
            {/* Colored text logo */}
            <img src={logoText} alt="InfyCode" className="lp-logo-text" />
            <p className="lp-logo-sub">Your Career Starts Here</p>
          </div>
          <div className="lp-left-switch">
            <p>{isActive ? "Already have an account?" : "New to InfyCode?"}</p>
            <button onClick={toggleMode} className="lp-switch-btn">
              {isActive ? "Sign In" : "Create Account"} →
            </button>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="lp-right">
          <div className="lp-card">

            {/* SIGN IN */}
            {!isActive && (
              <>
                <div className="lp-card-header">
                  <h1>Welcome Back</h1>
                  <p>Sign in to continue your journey</p>
                </div>
                {successMessage && <div className="lp-alert lp-alert-success"><CheckCircle size={15} />{successMessage}</div>}
                {signInApiError && <div className="lp-alert lp-alert-error">⚠ {signInApiError}</div>}
                <form onSubmit={handleSignInSubmit} noValidate className="lp-form">
                  <div className="lp-field">
                    <label>Email Address</label>
                    <div className="lp-input-wrap">
                      <Mail size={15} className="lp-icon" />
                      <input type="email" name="email" placeholder="you@example.com"
                        value={signInForm.email} onChange={handleSignInChange}
                        className={`lp-input${signInErrors.email ? " err" : ""}`} autoComplete="email" />
                    </div>
                    {signInErrors.email && <span className="lp-err">{signInErrors.email}</span>}
                  </div>
                  <div className="lp-field">
                    <label>Password</label>
                    <div className="lp-input-wrap">
                      <Lock size={15} className="lp-icon" />
                      <input type={showSignInPassword ? "text" : "password"} name="password" placeholder="••••••••"
                        value={signInForm.password} onChange={handleSignInChange}
                        className={`lp-input${signInErrors.password ? " err" : ""}`} autoComplete="current-password" />
                      <button type="button" className="lp-eye" onClick={() => setShowSignInPassword(p => !p)}>
                        {showSignInPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {signInErrors.password && <span className="lp-err">{signInErrors.password}</span>}
                  </div>
                  <div className="lp-forgot-row">
                    <Link to="/student/forgot-password" className="lp-forgot">Forgot Password?</Link>
                  </div>
                  <button type="submit" className="lp-btn" disabled={isSignInLoading}>
                    {isSignInLoading ? <><span className="lp-spinner" />Signing in...</> : "Sign In →"}
                  </button>
                </form>
                <div className="lp-card-footer">
                  <Link to="/" className="lp-back"><ArrowLeft size={14} /> Back to Home</Link>
                </div>
              </>
            )}

            {/* SIGN UP */}
            {isActive && (
              <>
                <div className="lp-card-header">
                  <h1>Create Account</h1>
                  <p>Join 10,000+ students transforming their careers</p>
                </div>
                {signUpApiError && <div className="lp-alert lp-alert-error">⚠ {signUpApiError}</div>}
                <form onSubmit={handleSignUpSubmit} noValidate className="lp-form">
                  <div className="lp-field">
                    <label>Full Name</label>
                    <div className="lp-input-wrap">
                      <User size={15} className="lp-icon" />
                      <input type="text" name="fullName" placeholder="Your full name"
                        value={signUpForm.fullName} onChange={handleSignUpChange}
                        className={`lp-input${signUpErrors.fullName ? " err" : ""}`} />
                    </div>
                    {signUpErrors.fullName && <span className="lp-err">{signUpErrors.fullName}</span>}
                  </div>
                  <div className="lp-field">
                    <label>Email Address</label>
                    <div className="lp-input-wrap">
                      <Mail size={15} className="lp-icon" />
                      <input type="email" name="email" placeholder="you@example.com"
                        value={signUpForm.email} onChange={handleSignUpChange}
                        className={`lp-input${signUpErrors.email ? " err" : ""}`} autoComplete="email" />
                    </div>
                    {signUpErrors.email && <span className="lp-err">{signUpErrors.email}</span>}
                  </div>
                  <div className="lp-field">
                    <label>Phone Number</label>
                    <div className="lp-input-wrap">
                      <Phone size={15} className="lp-icon" />
                      <input type="tel" name="phone" placeholder="10-digit mobile number"
                        value={signUpForm.phone} onChange={handleSignUpChange} maxLength={10}
                        className={`lp-input${signUpErrors.phone ? " err" : ""}`} />
                    </div>
                    {signUpErrors.phone && <span className="lp-err">{signUpErrors.phone}</span>}
                  </div>
                  <div className="lp-row">
                    <div className="lp-field">
                      <label>Password</label>
                      <div className="lp-input-wrap">
                        <Lock size={15} className="lp-icon" />
                        <input type={showSignUpPassword ? "text" : "password"} name="password" placeholder="Min 8 chars"
                          value={signUpForm.password} onChange={handleSignUpChange}
                          className={`lp-input${signUpErrors.password ? " err" : ""}`} />
                        <button type="button" className="lp-eye" onClick={() => setShowSignUpPassword(p => !p)}>
                          {showSignUpPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {signUpErrors.password && <span className="lp-err">{signUpErrors.password}</span>}
                    </div>
                    <div className="lp-field">
                      <label>Confirm Password</label>
                      <div className="lp-input-wrap">
                        <Lock size={15} className="lp-icon" />
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Re-enter"
                          value={signUpForm.confirmPassword} onChange={handleSignUpChange}
                          className={`lp-input${signUpErrors.confirmPassword ? " err" : ""}`} />
                        <button type="button" className="lp-eye" onClick={() => setShowConfirmPassword(p => !p)}>
                          {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {signUpErrors.confirmPassword && <span className="lp-err">{signUpErrors.confirmPassword}</span>}
                    </div>
                  </div>
                  <button type="submit" className="lp-btn" disabled={isSignUpLoading}>
                    {isSignUpLoading ? <><span className="lp-spinner" />Creating Account...</> : "Create Account →"}
                  </button>
                </form>
                <div className="lp-card-footer">
                  <Link to="/" className="lp-back"><ArrowLeft size={14} /> Back to Home</Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;