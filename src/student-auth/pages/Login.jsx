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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const networkRef = React.useRef(null);

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

  // ── TECH BACKGROUND LOGIC ──
  React.useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  React.useEffect(() => {
    const canvas = document.getElementById('networkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const particleCount = 80;

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; /* Brighter for visibility */
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Add a subtle glow to particles
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0; // Reset shadow for lines
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();
        
        // Connect to others
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 180) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        const mdx = p.x - mousePos.x;
        const mdy = p.y - mousePos.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 250) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * (1 - mdist / 250)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mousePos.x, mousePos.y);
          ctx.stroke();
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);


  return (
    <div className="lp-root">
      {/* ── EXACT CLONE TECH BACKGROUND ── */}
      <div className="lp-bg">
        {/* Perspective Grid */}
        <div className="lp-tech-grid" />

        {/* Particle Network Canvas */}
        <canvas id="networkCanvas" className="lp-network-canvas" />

        {/* Cursor Glow */}
        <div className="lp-cursor-glow" style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />

        {/* Left Code Column */}
        <div className="lp-code-col lp-code-col-left">
          <pre>{`01 import pandas as pd
02 import numpy as np
03 from sklearn.model_selection
04 import train_test_split
05
06 def train_model():
07   data = pd.read_csv('data.csv')
08   X = data.drop('target', axis=1)
09   y = data['target']
10
11 model.fit(X_train, y_train)
12 return model
13
14 class DataScience:
15   def __init__(self):
16     self.data = None
17
18 def analyze(self):
19   print('Analyzing Data...')
20
21 System.out.println("Learn");
22
23 AI thinking....
24 Loading knowledge graph...
25 Connection established..
26 data_flow = True
27 while learning:
28   grow()
29   improve()
30   repeat().`}</pre>
        </div>

        {/* Right Code Column */}
        <div className="lp-code-col lp-code-col-right">
          <pre>{`# Initialize system
system = AI_System()
system.activate()

for node in network.nodes:
  node.connect()
  node.learn()
  node.evolve()

print('Skills Unlocked')

def enhance_learning():
  skills = ['AI', 'ML', 'DS']
  for s in skills:
    mastery(s)

10101111101010101101
01001000000011101011
10101000101001201101
01001000101110110101`}</pre>
        </div>

        {/* Technical Icons & Labels */}
        <div className="lp-tech-icon-wrap" style={{ top: '10%', left: '20%' }}><span>AI</span></div>
        <div className="lp-tech-icon-wrap" style={{ top: '5%', left: '50%' }}><span>{`</>`}</span></div>
        <div className="lp-tech-icon-wrap" style={{ top: '10%', right: '20%' }}><span>ML</span></div>
        <div className="lp-tech-icon-wrap" style={{ top: '5%', right: '40%' }}><span>{`{}`}</span></div>
        
        <div className="lp-tech-icon-wrap" style={{ top: '35%', left: '15%' }}>
          <i className="python-icon">🐍</i>
          <span>Python</span>
        </div>
        
        <div className="lp-tech-icon-wrap" style={{ top: '35%', right: '15%' }}>
          <i className="java-icon">☕</i>
          <span>Java</span>
        </div>

        <div className="lp-tech-icon-wrap" style={{ top: '60%', left: '18%' }}><span>Data</span></div>
        <div className="lp-tech-icon-wrap" style={{ top: '60%', right: '12%' }}><span>API</span></div>
        <div className="lp-tech-icon-wrap" style={{ top: '78%', right: '8%' }}><span>Cloud</span></div>

        {/* Learning Path SVG & Nodes */}
        <svg className="lp-path-svg" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path 
            className="lp-path-line" 
            d="M 100 350 Q 300 380 500 350 T 900 200" 
          />
        </svg>

        {/* Path Labeled Nodes */}
        <div className="lp-path-node" style={{ left: '10%', bottom: '12%' }}><span className="lp-path-label">Beginner</span></div>
        <div className="lp-path-node" style={{ left: '32%', bottom: '8%' }}><span className="lp-path-label">Foundations</span></div>
        <div className="lp-path-node" style={{ left: '50%', bottom: '12%' }}><span className="lp-path-label">Data Science</span></div>
        <div className="lp-path-node" style={{ left: '68%', bottom: '25%' }}><span className="lp-path-label">Web Dev</span></div>
        <div className="lp-path-node" style={{ left: '90%', bottom: '50%' }}><span className="lp-path-label">AI Mastery</span></div>
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

        {/* LEFT — Brand Card (Clickable to Toggle) */}
        <div className="lp-left">
          <div className="lp-logo-block" onClick={toggleMode} title="Click to Switch Mode">
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

        {/* RIGHT — Auth Card (3D Flip) */}
        <div className="lp-right">
          <div className={`lp-flip-card ${isActive ? "flipped" : ""}`}>
            
            {/* FRONT: SIGN IN */}
            <div className="lp-card-front">
              <div className="lp-card">
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
                        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
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
                        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
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
              </div>
            </div>

            {/* BACK: SIGN UP */}
            <div className="lp-card-back">
              <div className="lp-card">
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
                        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
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
                        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
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
                        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
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
                          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
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
                          onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                          className={`lp-input${signUpErrors.confirmPassword ? " err" : ""}`} />
                        <button type="button" className="lp-eye" onClick={() => setShowConfirmPassword(p => !p)}>
                          {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {signUpErrors.confirmPassword && <span className="lp-err">{signUpErrors.confirmPassword}</span>}
                    </div>
                  </div>
                  <button type="submit" className="lp-btn" disabled={isSignUpLoading}>
                    {isSignUpLoading ? <><span className="lp-spinner" />Creating...</> : "Create Account →"}
                  </button>
                </form>
                <div className="lp-card-footer">
                  <Link to="/" className="lp-back"><ArrowLeft size={14} /> Back to Home</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default Login;