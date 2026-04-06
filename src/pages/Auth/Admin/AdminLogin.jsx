import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '../../../services/api';
import './adminAuth.css';

const validateAdminEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Required';
    else if (!validateAdminEmail(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError('');

    try {
      const data = await adminLogin(formData.email, formData.password);
      // Store auth data in standardized 'user' object
      localStorage.setItem('user', JSON.stringify({
        token: data.token,
        role: data.role,
        email: data.email,
        fullName: data.fullName
      }));
      navigate('/admin-dashboard');
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="admin-wrapper">
      <div className="admin-card">

        {/* ── LEFT: Form ── */}
        <div className="admin-form-side">
          <div className="admin-form-header">
            <h1 className="admin-form-heading">Admin Sign In</h1>
            <p className="admin-form-sub">Access InfyCode Admin Dashboard</p>
          </div>

          {successMsg && (
            <div className="fp-banner fp-banner--success" style={{ marginBottom: '12px' }}>
              <span>{successMsg}</span>
            </div>
          )}

          {apiError && (
            <div className="fp-banner fp-banner--error" style={{ marginBottom: '12px' }}>
              <span>{apiError}</span>
            </div>
          )}

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="adminEmail">Email</label>
              <div className="admin-input-wrap">
                <Mail size={18} className="admin-input-icon" />
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
              {errors.email && <span className="admin-error-text">{errors.email}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="adminPassword">Password</label>
              <div className="admin-input-wrap" style={{ position: 'relative' }}>
                <Lock size={18} className="admin-input-icon" />
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
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="admin-error-text">{errors.password}</span>}
            </div>

            <Link to="/admin/forgot-password" className="admin-forgot">
              Forgot Password?
            </Link>

            <button type="submit" className="admin-submit-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="admin-btn-inner">
                  <span className="admin-spinner" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="admin-form-footer" style={{ display: 'none' }}>
            Don't have an account?
            <Link to="/admin/signup">Sign Up</Link>
          </div>
        </div>

        {/* ── RIGHT: Blue Panel ── */}
        <div className="admin-panel-side">
          <div className="admin-panel-content">
            <h2 className="admin-panel-heading">Secure.<br/>Powerful.</h2>
            <p className="admin-panel-sub">
              Manage Trainers, Courses, and System Growth from a centralized command center.
            </p>
            <Link to="/admin/signup" className="admin-panel-btn">
              Create Account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;
