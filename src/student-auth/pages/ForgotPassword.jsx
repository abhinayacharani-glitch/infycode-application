import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, Send, RefreshCw } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { studentForgotPassword } from '../../services/api';
import logoIcon from "../../assets/infycode-final-logo4-1.png";
import logoText from "../../assets/color-logo-3.jpeg";
import LoginBackground from "../components/LoginBackground";
import "../styles/Login.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!validateEmail(email)) { setError('Enter a valid email address'); return; }
    setError(''); setLoading(true);
    try {
      await studentForgotPassword(email.trim());
      setSent(true);
      setTimeout(() => navigate('/student/verify-otp', {
        state: { email: email.trim(), message: 'OTP sent to your registered email', type: 'password-reset' }
      }), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp-root">
      {/* Animated BG */}
      <LoginBackground />

      <div className="lp-layout">
        {/* LEFT — Logo only */}
        <div className="lp-left">
          <div className="lp-logo-block">
            <img src={logoIcon} alt="InfyCode" className="lp-logo-icon" />
            <img src={logoText} alt="InfyCode" className="lp-logo-text" />
            <p className="lp-logo-sub">Your Career Starts Here</p>
          </div>
          <div className="lp-left-switch">
            <p>Remember your password?</p>
            <button onClick={() => navigate('/student/login')} className="lp-switch-btn">
              Back to Sign In →
            </button>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="lp-right">
          <div className="lp-card">
            {!sent ? (
              <>
                <div className="lp-card-header">
                  <div style={{
                    width: 60, height: 60,
                    background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(139,92,246,0.15))',
                    border: '1px solid rgba(167,139,250,0.3)',
                    borderRadius: 16, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginBottom: 20, color: '#a78bfa'
                  }}>
                    <ShieldCheck size={28} />
                  </div>
                  <h1>Reset Password</h1>
                  <p>Enter your registered email — we'll send an OTP to get you back in.</p>
                </div>

                {error && <div className="lp-alert lp-alert-error">⚠ {error}</div>}

                <form onSubmit={handleSubmit} noValidate className="lp-form">
                  <div className="lp-field">
                    <label>Email Address</label>
                    <div className="lp-input-wrap">
                      <Mail size={15} className="lp-icon" />
                      <input
                        ref={emailRef} type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        className={`lp-input${error ? ' err' : ''}`}
                        autoComplete="email" disabled={loading}
                      />
                    </div>
                    {error && <span className="lp-err">{error}</span>}
                  </div>

                  <button type="submit" className="lp-btn" disabled={loading}>
                    {loading
                      ? <><span className="lp-spinner" />Sending OTP...</>
                      : <><Send size={15} />Send OTP →</>}
                  </button>
                </form>

                <div className="lp-card-footer">
                  <Link to="/student/login" className="lp-back">
                    <ArrowLeft size={14} /> Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              /* Success state */
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px',
                  background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(52,211,153,0.1))',
                  border: '1px solid rgba(52,211,153,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#34d399', animation: 'scaleIn 0.4s ease-out'
                }}>
                  <Mail size={36} />
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>OTP Sent!</h1>
                <p style={{ color: 'rgba(148,163,184,0.8)', lineHeight: 1.6, marginBottom: 8 }}>
                  We've sent a verification code to
                </p>
                <p style={{ color: '#a78bfa', fontWeight: 700, fontSize: 16, marginBottom: 24 }}>{email}</p>
                <p style={{ color: 'rgba(100,116,139,0.7)', fontSize: 13 }}>Redirecting to OTP verification...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
