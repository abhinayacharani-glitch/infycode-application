import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { adminRegister } from '../../services/api';
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
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
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
      await adminRegister(
        formData.fullName,
        formData.email,
        formData.phone,
        formData.password,
        formData.confirmPassword
      );
      navigate('/admin/login', { state: { message: 'Account created! Please sign in.' } });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-wrapper">
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
                  placeholder="John Doe"
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
              {errors.email && <span className="admin-error-text">{errors.email}</span>}
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
              <div className="admin-input-wrap">
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
                />
                <button
                  type="button"
                  className="admin-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="admin-error-text">{errors.password}</span>}
            </div>

            <div className="admin-form-group">
              <label htmlFor="adminConfirmPassword">Confirm Password</label>
              <div className="admin-input-wrap">
                <Lock size={16} className="admin-input-icon" />
                <input
                  id="adminConfirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'admin-error' : ''}
                  disabled={isLoading}
                />
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
            <h2 className="admin-panel-heading">Welcome<br/>Back!</h2>
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
