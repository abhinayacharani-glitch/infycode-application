import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { studentVerifyRegistrationOTP, studentVerifyResetOTP, studentForgotPassword } from '../../services/api';
import ModernAuthLayout from '../components/ModernAuthLayout';
import "../styles/ModernAuth.css";

const OTP_DIGITS = 6;
const TIMER_SECONDS = 60;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email = '', type = 'registration' } = location.state || {};

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
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);

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

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp]; next[i] = val; setOtp(next); setError('');
    if (val && i < OTP_DIGITS - 1) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) inputRefs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < OTP_DIGITS - 1) inputRefs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g,'').slice(0, OTP_DIGITS);
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
      if (type === 'password-reset') {
        const data = await studentVerifyResetOTP(email, code);
        navigate('/student/reset-password', {
          state: { otpVerified: true, email, resetToken: data.token },
        });
      } else {
        await studentVerifyRegistrationOTP(email, code);
        navigate('/student/login', { state: { fromRegister: true }, replace: true });
      }
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
    <ModernAuthLayout 
      title="Verify OTP"
      subtitle={email ? <>6-digit code sent to <strong>{email}</strong></> : 'Enter the 6-digit OTP sent to your email'}
    >
      {/* Success banner */}
      {successMsg && !error && (
        <div className="auth-alert auth-alert-success">
          <ShieldCheck size={15} /><span>{successMsg}</span>
        </div>
      )}
      
      {/* Error banner */}
      {error && (
        <div className="auth-alert auth-alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Expired banner */}
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
        <Link to="/student/login" className="back-home">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
      </div>
    </ModernAuthLayout>
  );
};

export default VerifyOtp;
