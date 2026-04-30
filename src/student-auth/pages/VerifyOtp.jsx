import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation }                        from 'react-router-dom';
import { ShieldCheck, RefreshCw }                          from 'lucide-react';

import AuthLayout   from '../components/AuthLayout';
import AuthFormCard from '../components/AuthFormCard';
import PageWrapper  from '../components/PageWrapper';
import "../styles/Login.css";
import { studentVerifyRegistrationOTP, studentVerifyResetOTP, studentForgotPassword } from '../../services/api';
import logoIcon from "../../assets/infycode-final-logo4-1.png";
import logoText from "../../assets/color-logo-3.jpeg";
import LoginBackground from "../components/LoginBackground";

const OTP_DIGITS    = 6;
const TIMER_SECONDS = 60;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = '', type = 'registration' } = location.state || {}; // type can be 'registration' or 'password-reset'


  const [otp,       setOtp      ] = useState(Array(OTP_DIGITS).fill(''));
  const [timeLeft,  setTimeLeft ] = useState(TIMER_SECONDS);
  const [expired,   setExpired  ] = useState(false);
  const [loading,   setLoading  ] = useState(false);
  const [resending, setResending] = useState(false);
  const [error,     setError    ] = useState('');
  const [successMsg,setSuccessMsg] = useState(location.state?.message || '');
  const inputRefs = useRef([]);

  /* Timer */
  useEffect(() => {
    if (timeLeft <= 0) { setExpired(true); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  /* Auto-redirect on Expiry */
  useEffect(() => {
    if (expired) {
      const timeout = setTimeout(() => {
        navigate('/student/login', { replace: true });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [expired, navigate]);

  /* Back-button guard */
  useEffect(() => {
    const guard = () => {
      window.history.pushState(null, '', window.location.href);
      window.location.replace('/student/login');
    };
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', guard);
    return () => window.removeEventListener('popstate', guard);
  }, []);

  /* Auto-dismiss success banner */
  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(''), 5000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const getTimerColor = (s) =>
    s > 30 ? '#10b981' : s > 10 ? '#f59e0b' : '#ef4444';

  /* OTP input handlers */
  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next); setError('');
    if (val && i < OTP_DIGITS - 1) inputRefs.current[i + 1]?.focus();
  };
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft'  && i > 0)            inputRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < OTP_DIGITS-1) inputRefs.current[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, OTP_DIGITS);
    const next = [...otp];
    [...pasted].forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_DIGITS - 1)]?.focus();
  };

  /* Verify OTP — uses studentVerifyOTP from api.js */
  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_DIGITS) { setError('Please enter the complete 6-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      if (type === 'password-reset') {
        const data = await studentVerifyResetOTP(email, code);
        navigate('/student/reset-password', {
          state: { otpVerified: true, email, resetToken: data.token },
        });
      } else {
        // Default to registration
        await studentVerifyRegistrationOTP(email, code);
        alert('Registration successful! Please login.');
        navigate('/student/login', { replace: true });
      }
    } catch (err) {

      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* Resend OTP — uses studentForgotPassword (same endpoint, re-generates OTP) */
  const handleResend = useCallback(async () => {
    if (resending || loading) return;
    setResending(true); setError(''); setSuccessMsg('');
    setOtp(Array(OTP_DIGITS).fill(''));
    try {
      await studentForgotPassword(email);
      setTimeLeft(TIMER_SECONDS); setExpired(false);
      setSuccessMsg('OTP resent successfully');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  }, [email, resending, loading]);

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
            <p>Back to login?</p>
            <button onClick={() => navigate('/student/login')} className="lp-switch-btn">
              Back to Sign In →
            </button>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="lp-right">
          <div className="lp-card">
            <div className="lp-card-header">
              <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,rgba(124,58,237,0.25),rgba(139,92,246,0.15))', border: '1px solid rgba(167,139,250,0.3)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: '#a78bfa' }}>
                <ShieldCheck size={28} />
              </div>
              <h1>Verify OTP</h1>
              <p>{email ? `6-digit code sent to ${email}` : 'Enter the 6-digit OTP sent to your email'}</p>
            </div>

            {successMsg && !error && <div className="lp-alert lp-alert-success">✓ {successMsg}</div>}
            {expired && <div className="lp-alert lp-alert-error">⚠ OTP has expired. Please request a new one.</div>}
            {error && <div className="lp-alert lp-alert-error">⚠ {error}</div>}

            <form onSubmit={(e) => e.preventDefault()} className="lp-form">
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i} ref={(el) => (inputRefs.current[i] = el)}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e)  => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    style={{ width: '45px', height: '55px', fontSize: '24px', textAlign: 'center', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#1e293b', transition: 'all 0.3s' }}
                    className={digit ? 'filled' : ''}
                    disabled={loading || expired}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
                {expired ? 'OTP has expired' : <>Expires in <span style={{ color: getTimerColor(timeLeft), fontWeight: 'bold' }}>{formatTime(timeLeft)}</span></>}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={handleVerify} disabled={loading || expired} className="lp-btn" style={{ flex: 1 }}>
                  {loading ? <><span className="lp-spinner" /> VERIFYING...</> : 'Verify OTP'}
                </button>
                <button type="button" onClick={handleResend} disabled={!expired || resending || loading} className="lp-btn" style={{ flex: 1, background: expired ? '#f1f5f9' : '#f8fafc', color: expired ? '#3b82f6' : '#94a3b8', border: expired ? '1px solid #bfdbfe' : '1px solid #e2e8f0', boxShadow: 'none' }}>
                  {resending ? <><span className="lp-spinner" style={{ borderColor: '#3b82f6', borderTopColor: 'transparent' }} /> RESENDING...</> : <><RefreshCw size={15} style={{ marginRight: 6 }} /> Resend OTP</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
