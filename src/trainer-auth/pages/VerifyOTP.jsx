import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { verifyOTP, sendOTP } from '../../services/api';
import '../styles/login.css';
import '../styles/trainerForgot.css';
import '../styles/trainerVerifyOTP.css';

const OTP_DIGITS = 6;
const TIMER_SECONDS = 60; // 1 minute

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = '' } = location.state || {};

  const [otp, setOtp] = useState(Array(OTP_DIGITS).fill(''));
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.message || '');

  const inputRefs = useRef([]);

  /* ── Timer ─────────────────────────────────── */
  useEffect(() => {
    if (timeLeft <= 0) {
      setExpired(true);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  /* ── Auto-redirect on Expiry ───────────────── */
  useEffect(() => {
    if (expired) {
      const timeout = setTimeout(() => {
        navigate('/trainer/login', { replace: true });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [expired, navigate]);

  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
      window.location.replace("/trainer/login");
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds > 30) return "#10b981"; // Green
    if (seconds > 10) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  /* ── OTP input handling ─────────────────────── */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError('');
    if (value && index < OTP_DIGITS - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < OTP_DIGITS - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_DIGITS);
    const next = [...otp];
    [...pasted].forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_DIGITS - 1)]?.focus();
  };

  /* ── Verify OTP (real API call) ─────────────── */
  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_DIGITS) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await verifyOTP(email, code, 'trainer');
      // data.token is the short-lived reset token (15 min) from backend
      navigate('/trainer/reset-password', {
        state: { otpVerified: true, email, resetToken: data.token },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP (real API call) ─────────────── */
  const handleResend = useCallback(async () => {
    if (resending || loading) return;

    setResending(true);
    setError('');
    setSuccessMsg('');
    setOtp(Array(OTP_DIGITS).fill(''));

    try {
      await sendOTP(email, 'trainer');
      setTimeLeft(TIMER_SECONDS);
      setExpired(false);
      setSuccessMsg('OTP resent successfully');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  }, [email, resending, loading]);

  const isTimerWarning = timeLeft <= 30 && !expired;

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* ── LEFT: Branded Visual ── */}
        <div className="auth-image-section">
          <img src="/mnt/data/a2b9b7ca-6bdc-4eb8-96f3-d8165e900f1f.png" alt="" className="auth-image" />
          <div className="auth-image-overlay" />
          <div className="auth-image-content">
            <h2 className="auth-tagline">
              One Step<br />
              <span>Closer</span>
            </h2>
            <p className="auth-tagline-sub">
              Enter the OTP sent to your email to verify your identity and reset your password.
            </p>
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div className="auth-form-section">
          <div className="auth-header">
            <h1>Verify OTP</h1>
            <p>
              {email
                ? <>6-digit code sent to <strong>{email}</strong></>
                : 'Enter the 6-digit OTP sent to your email'}
            </p>
          </div>

          {/* ── Success Banner ── */}
          {successMsg && !error && (
            <div className="trainer-otp-success-banner">
              <ShieldCheck size={16} />
              {successMsg}
            </div>
          )}

          {/* ── Expired Banner ── */}
          {expired && (
            <div className="trainer-otp-expired-banner">
              OTP expired. Redirecting to login…
            </div>
          )}

          {/* OTP Input Row */}
          <div className="trainer-otp-inputs-wrap">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`trainer-otp-digit${error ? ' trainer-otp-digit--error' : ''}${digit ? ' trainer-otp-digit--filled' : ''}`}
                disabled={loading || expired}
                autoFocus={i === 0}
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>

          {error && (
            <span className="error-text" style={{ textAlign: 'center', display: 'block', marginBottom: '4px' }}>
              {error}
            </span>
          )}

          {/* Timer */}
          <div className={`trainer-otp-timer${isTimerWarning ? ' trainer-otp-timer--warning' : ''}`}>
            {expired
              ? 'OTP has expired'
              : <>Expires in <span className="trainer-otp-timer__count" style={{ color: getTimerColor(timeLeft) }}>{formatTime(timeLeft)}</span></>}
          </div>

          {/* ── Button Row: Verify OTP + Resend OTP ── */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              type="button"
              className="submit-btn"
              onClick={handleVerify}
              disabled={loading || expired}
              style={{ flex: 1 }}
            >
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>

            <button
              type="button"
              className="submit-btn"
              onClick={handleResend}
              disabled={resending || loading}
              style={{ flex: 1 }}
            >
              {resending ? (
                <><RefreshCw size={14} className="trainer-otp-resend-icon spinning" style={{ marginRight: 6 }} />Resending…</>
              ) : (
                <><RefreshCw size={14} className="trainer-otp-resend-icon" style={{ marginRight: 6 }} />Resend OTP</>
              )}
            </button>
          </div>

          <div className="auth-footer">
            <button 
              onClick={() => navigate("/trainer/login", { replace: true })} 
              className="back-link" 
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}
            >
              ← Back to login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyOTP;
