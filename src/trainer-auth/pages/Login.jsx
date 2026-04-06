import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { trainerLogin } from '../../services/api';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
      window.location.replace("/login");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors]     = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [apiError, setApiError]         = useState('');

  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.email)                       errs.email    = 'Email is required';
    else if (!validateEmail(formData.email))   errs.email    = 'Invalid email address';
    if (!formData.password)                    errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setApiError('');

    try {
      const data = await trainerLogin(formData.email, formData.password);
      localStorage.setItem('user', JSON.stringify({
        token: data.token,
        role: data.role,
        fullName: data.fullName,
        email: data.email
      }));
      navigate('/trainer-dashboard');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* ── LEFT: Branded Visual (centered) ── */}
        <div className="auth-image-section">
          <img src="/mnt/data/a2b9b7ca-6bdc-4eb8-96f3-d8165e900f1f.png" alt="" className="auth-image" />
          <div className="auth-image-overlay" />

          <div className="auth-image-content">
            <h2 className="auth-tagline">
              Empowering Trainers.
              <span>Building Futures.</span>
            </h2>
            <p className="auth-tagline-sub">
              Your all-in-one professional training management platform.
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

        {/* ── RIGHT: Form ── */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Welcome back!</h1>
            <p>Please login to continue your session.</p>
          </div>

          {/* Success banner (after password reset) */}
          {successMsg && (
            <div className="success-banner" style={{ marginBottom: '12px' }}>
              {successMsg}
            </div>
          )}

          {/* API error banner */}
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

          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={17} className="input-icon" />
                <input
                  id="login-email"
                  type="email" name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="input-wrapper" style={{ position: 'relative', width: '100%' }}>
                <Lock size={17} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  autoComplete="current-password"
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

            <Link to="/trainer/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?
            <Link to="/trainer/signup">Create Account</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;