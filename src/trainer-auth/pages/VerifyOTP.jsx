import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { verifyOTP, sendOTP } from '../../services/api';
import ModernAuthLayout from '../../student-auth/components/ModernAuthLayout';
import "../../student-auth/styles/ModernAuth.css";

const OTP_DIGITS = 6;
const TIMER_SECONDS = 60;

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

  /* Timer */
  useEffect(() => {
    if (timeLeft <= 0) { setExpired(true); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getTimerColor = (seconds) => {
    if (seconds > 30) return "#10b981";
    if (seconds > 10) return "#f59e0b";
    return "#ef4444";
  };

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

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < OTP_DIGITS) { setError('Please enter the complete 6-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      const data = await verifyOTP(email, code, 'trainer');
      navigate('/trainer/reset-password', {
        state: { otpVerified: true, email, resetToken: data.token },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    if (resending || loading) return;
    setResending(true); setError(''); setSuccessMsg('');
    setOtp(Array(OTP_DIGITS).fill(''));
    try {
      await sendOTP(email, 'trainer');
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
    <ModernAuthLayout 
      title="Verify OTP"
      subtitle={email ? <>6-digit code sent to <strong>{email}</strong></> : 'Enter the 6-digit OTP sent to your email'}
    >
      {successMsg && !error && (
        <div className="auth-alert auth-alert-success">
          <ShieldCheck size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="auth-alert auth-alert-error">
          <span>{error}</span>
        </div>
      )}

      {expired && (
        <div className="auth-alert auth-alert-error">
          <span>OTP has expired. Please request a new one.</span>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="otp-inputs-row">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text" inputMode="numeric" maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="otp-input"
              disabled={loading || expired}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px', fontSize: '14px' }}>
          {expired
            ? <span style={{ color: '#ef4444' }}>OTP has expired</span>
            : <>Expires in <span style={{ color: getTimerColor(timeLeft), fontWeight: 700 }}>{formatTime(timeLeft)}</span></>}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="submit-button"
            style={{ flex: 1 }}
            onClick={handleVerify}
            disabled={loading || expired}
          >
            {loading ? <><span className="spinner" /> Verifying...</> : 'Verify OTP'}
          </button>
          
          <button
            type="button"
            className="submit-button"
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={handleResend}
            disabled={resending || loading}
          >
            {resending ? <RefreshCw size={17} className="spinner" /> : <><RefreshCw size={17} /> Resend</>}
          </button>
        </div>
      </form>

      <div style={{ textAlign: 'center' }}>
        <Link to="/trainer/login" className="back-home">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </ModernAuthLayout>
  );
};

export default VerifyOTP;
