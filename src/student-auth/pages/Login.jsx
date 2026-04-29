import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, RefreshCw, CheckCircle, ArrowLeft } from "lucide-react";
import { validateEmail, validatePassword, validateFullName, validatePhone } from "../utils/validation";
import { studentLogin, studentRegister, studentVerifyRegistrationOTP, resendRegistrationOTP } from "../../services/api";
import logoIcon from "../../assets/infycode-final-logo4-1.png";
import ModernAuthLayout from "../components/ModernAuthLayout";
import "../styles/ModernAuth.css";

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
      localStorage.setItem("user", JSON.stringify({
        token:    data.token,
        fullName: data.fullName || data.fullname,
        email:    data.email,
        role:     data.role
      }));
      if (data.role === 'admin')        navigate("/admin-dashboard");
      else if (data.role === 'trainer') navigate("/trainer-dashboard");
      else                              navigate("/student-dashboard");
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
    <ModernAuthLayout 
      title={isActive ? "Create Account" : "Welcome Back"}
      subtitle={isActive ? "Join 10,000+ students transforming their careers" : "Sign in to continue your journey"}
    >
      {/* ── OTP POPUP ── */}
      {showOTP && (
        <div className="lp-otp-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(15px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="auth-form-card" style={{ maxWidth: '400px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
            <button style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px', opacity: 0.7 }} onClick={() => setShowOTP(false)}>✕</button>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#3b82f6' }}>
              <Mail size={30} />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '10px' }}>Verify Your Email</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>OTP sent to <strong>{maskEmail(signUpForm.email)}</strong></p>
            
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
                ? <div className="auth-alert auth-alert-success">Registration successful! Redirecting...</div>
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

      {/* SIGN IN FORM */}
      {!isActive && (
        <>
          {successMessage && <div className="auth-alert auth-alert-success"><CheckCircle size={15} />{successMessage}</div>}
          {signInApiError && <div className="auth-alert auth-alert-error">⚠ {signInApiError}</div>}
          <form onSubmit={handleSignInSubmit} noValidate>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-container">
                <Mail size={17} className="input-icon" />
                <input type="email" name="email" placeholder="you@example.com"
                  value={signInForm.email} onChange={handleSignInChange}
                  className="auth-input" autoComplete="email" />
              </div>
              {signInErrors.email && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{signInErrors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-container">
                <Lock size={17} className="input-icon" />
                <input type={showSignInPassword ? "text" : "password"} name="password" placeholder="••••••••"
                  value={signInForm.password} onChange={handleSignInChange}
                  className="auth-input" autoComplete="current-password" />
                <button type="button" className="eye-button" onClick={() => setShowSignInPassword(p => !p)}>
                  {showSignInPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {signInErrors.password && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{signInErrors.password}</span>}
            </div>

            <Link to="/student/forgot-password" netlify-link="true" className="forgot-password-link">Forgot Password?</Link>

            <button type="submit" className="submit-button" disabled={isSignInLoading}>
              {isSignInLoading ? <><span className="spinner" /> Signing in...</> : "Sign In →"}
            </button>
          </form>
          
          <div className="form-footer">
            New to InfyCode? <Link to="/student/signup" onClick={toggleMode}>Create Account</Link>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Link to="/" className="back-home"><ArrowLeft size={14} /> Back to Home</Link>
          </div>
        </>
      )}

      {/* SIGN UP FORM */}
      {isActive && (
        <>
          {signUpApiError && <div className="auth-alert auth-alert-error">⚠ {signUpApiError}</div>}
          <form onSubmit={handleSignUpSubmit} noValidate>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-container">
                <User size={17} className="input-icon" />
                <input type="text" name="fullName" placeholder="Your full name"
                  value={signUpForm.fullName} onChange={handleSignUpChange}
                  className="auth-input" />
              </div>
              {signUpErrors.fullName && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{signUpErrors.fullName}</span>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-container">
                <Mail size={17} className="input-icon" />
                <input type="email" name="email" placeholder="you@example.com"
                  value={signUpForm.email} onChange={handleSignUpChange}
                  className="auth-input" autoComplete="email" />
              </div>
              {signUpErrors.email && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{signUpErrors.email}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <div className="input-container">
                <Phone size={17} className="input-icon" />
                <input type="tel" name="phone" placeholder="10-digit mobile number"
                  value={signUpForm.phone} onChange={handleSignUpChange} maxLength={10}
                  className="auth-input" />
              </div>
              {signUpErrors.phone && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{signUpErrors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-container">
                <Lock size={17} className="input-icon" />
                <input type={showSignUpPassword ? "text" : "password"} name="password" placeholder="Min 8 chars"
                  value={signUpForm.password} onChange={handleSignUpChange}
                  className="auth-input" />
                <button type="button" className="eye-button" onClick={() => setShowSignUpPassword(p => !p)}>
                  {showSignUpPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {signUpErrors.password && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{signUpErrors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-container">
                <Lock size={17} className="input-icon" />
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Re-enter password"
                  value={signUpForm.confirmPassword} onChange={handleSignUpChange}
                  className="auth-input" />
                <button type="button" className="eye-button" onClick={() => setShowConfirmPassword(p => !p)}>
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {signUpErrors.confirmPassword && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{signUpErrors.confirmPassword}</span>}
            </div>

            <button type="submit" className="submit-button" disabled={isSignUpLoading}>
              {isSignUpLoading ? <><span className="spinner" /> Creating Account...</> : "Create Account →"}
            </button>
          </form>

          <div className="form-footer">
            Already have an account? <Link to="/student/login" onClick={toggleMode}>Sign In</Link>
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/" className="back-home"><ArrowLeft size={14} /> Back to Home</Link>
          </div>
        </>
      )}
    </ModernAuthLayout>
  );
}

export default Login;