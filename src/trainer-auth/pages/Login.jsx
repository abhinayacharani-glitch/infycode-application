import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { trainerLogin } from '../../services/api';
import ModernAuthLayout from '../../student-auth/components/ModernAuthLayout';
import "../../student-auth/styles/ModernAuth.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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
    if (!formData.email) errs.email = 'Email is required';
    else if (!validateEmail(formData.email)) errs.email = 'Invalid email address';
    if (!formData.password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsLoading(true);
    setApiError('');

    try {
      const data = await trainerLogin(formData.email, formData.password);
      localStorage.setItem('user', JSON.stringify({
        token: data.token,
        role: data.role,
        fullName: data.fullName || data.fullname,
        email: data.email
      }));
      if (data.role === 'admin') navigate("/admin-dashboard");
      else if (data.role === 'trainer') navigate("/trainer-dashboard");
      else navigate("/student-dashboard");
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernAuthLayout 
      title="Trainer Login"
      subtitle="Please login to continue your session."
    >
      {successMsg && (
        <div className="auth-alert auth-alert-success">
          {successMsg}
        </div>
      )}

      {apiError && (
        <div className="auth-alert auth-alert-error">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email Address</label>
          <div className="input-container">
            <Mail size={17} className="input-icon" />
            <input
              id="login-email"
              type="email" name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          {errors.email && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <div className="input-container">
            <Lock size={17} className="input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="eye-button"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <span className="auth-alert-error" style={{ background: 'none', border: 'none', padding: '4px 0', fontSize: '12px' }}>{errors.password}</span>}
        </div>

        <Link to="/trainer/forgot-password" netlify-link="true" className="forgot-password-link">
          Forgot Password?
        </Link>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? <><span className="spinner" /> Signing in...</> : 'Sign in →'}
        </button>
      </form>

      <div className="form-footer">
        Don't have an account?
        <Link 
          to="/trainer/signup" 
          state={{ fromLogin: true }}
          onClick={(e) => {
            if (location.state?.fromSignup) {
              e.preventDefault();
              navigate(-1);
            }
          }}
        >
          Create Account
        </Link>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <Link to="/" className="back-home"><ArrowLeft size={14} /> Back to Home</Link>
      </div>
    </ModernAuthLayout>
  );
};

export default Login;