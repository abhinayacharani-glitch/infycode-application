import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { verifyOTP, sendOTP } from '../../../services/api';
import './adminAuth.css';
import './ForgotPassword.css';
import './VerifyOTP.css';

const OTP_DIGITS = 6;
const TIMER_SECONDS = 60; // 1 minute

const AdminVerifyOTP = () => {
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
        navigate('/admin/login', { replace: true });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [expired, navigate]);

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
      const data = await verifyOTP(email, code, 'admin');
      // data.token is the short-lived reset token (15 min) from backend
      navigate('/admin/reset-password', {
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
      await sendOTP(email, 'admin');
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
    <div className="admin-wrapper">
      <div className="admin-card admin-card--compact">

        {/* ── LEFT: Form ── */}
        <div className="admin-form-side admin-form-side--compact">
          <div className="admin-form-header">
            <h1 className="admin-form-heading">Verify OTP</h1>
            <p className="admin-form-sub" style={{ marginBottom: '20px' }}>
              {email
                ? <>Enter the 6-digit code sent to <strong>{email}</strong></>
                : 'Enter the 6-digit OTP sent to your email'}
            </p>
          </div>

          <div className="admin-form admin-form--compact">

            {/* ── Success Banner ── */}
            {successMsg && !error && (
              <div className="fp-banner fp-banner--success" style={{ marginBottom: '4px' }}>
                <ShieldCheck size={14} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* ── Expired Banner ── */}
            {expired && (
              <div className="fp-banner fp-banner--error">
                <span>OTP expired. Redirecting to login…</span>
              </div>
            )}

            {/* ── OTP Digit Inputs ── */}
            <div className="otp-inputs-wrap">
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
                  className={`otp-digit${error ? ' otp-digit--error' : ''}${digit ? ' otp-digit--filled' : ''}`}
                  disabled={loading || expired}
                  autoFocus={i === 0}
                  aria-label={`OTP digit ${i + 1}`}
                />
              ))}
            </div>

            {/* ── Error ── */}
            {error && (
              <span className="admin-error-text" style={{ textAlign: 'center' }}>
                {error}
              </span>
            )}

            {/* ── Timer ── */}
            <div className={`otp-timer${isTimerWarning ? ' otp-timer--warning' : ''}`}>
              {expired
                ? 'OTP has expired'
                : <>Code expires in <span className="otp-timer__count" style={{ color: getTimerColor(timeLeft) }}>{formatTime(timeLeft)}</span></>}
            </div>

            {/* ── Button Row: Verify OTP + Resend OTP ── */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                className="admin-submit-btn admin-submit-btn--compact"
                onClick={handleVerify}
                disabled={loading || expired}
                style={{ flex: 1, marginTop: 0 }}
              >
                {loading ? (
                  <span className="admin-btn-inner">
                    <span className="admin-spinner" />
                    Verifying…
                  </span>
                ) : 'Verify OTP'}
              </button>

              <button
                type="button"
                className="admin-submit-btn admin-submit-btn--compact"
                onClick={handleResend}
                disabled={resending || loading}
                style={{ flex: 1, marginTop: 0 }}
              >
                {resending ? (
                  <span className="admin-btn-inner">
                    <RefreshCw size={14} className="otp-resend-icon spinning" style={{ marginRight: 6 }} />
                    Resending…
                  </span>
                ) : (
                  <span className="admin-btn-inner">
                    <RefreshCw size={14} className="otp-resend-icon" style={{ marginRight: 6 }} />
                    Resend OTP
                  </span>
                )}
              </button>
            </div>

            <div className="admin-form-footer" style={{ display: 'block', marginTop: '8px' }}>
              <button 
                onClick={() => navigate("/admin/login", { replace: true })} 
                className="back-link" 
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}
              >
                ← Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Blue Panel ── */}
        <div className="admin-panel-side">
          <div className="admin-panel-content">
            <h2 className="admin-panel-heading">Verify.<br />Access.</h2>
            <p className="admin-panel-sub">
              Enter the OTP sent to your email to securely access your InfyCode admin account.
            </p>
            <button 
              onClick={() => navigate("/admin/login", { replace: true })} 
              className="admin-panel-btn"
              style={{ background: 'white', color: '#2563eb', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer', textAlign: 'center', width: 'fit-content' }}
            >
              Back to Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
export default AdminVerifyOTP;
