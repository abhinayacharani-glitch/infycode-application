import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation }                        from 'react-router-dom';
import { ShieldCheck, RefreshCw }                          from 'lucide-react';

import AuthLayout   from '../components/AuthLayout';
import AuthFormCard from '../components/AuthFormCard';
import PageWrapper  from '../components/PageWrapper';
import { studentVerifyRegistrationOTP, studentVerifyResetOTP, studentForgotPassword } from '../../services/api';


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
    <PageWrapper>
      <AuthLayout
        panelHeading="Verify OTP"
      panelText="Enter the OTP sent to your email to continue"
    >
      <AuthFormCard>
        <h1 className="sa-form-heading">Verify OTP</h1>
        <p  className="sa-form-sub">
          {email
            ? <>6-digit code sent to <strong>{email}</strong></>
            : 'Enter the 6-digit OTP sent to your email'}
        </p>

        <div className="sa-form">
          {/* Success banner */}
          {successMsg && !error && (
            <div className="sa-banner sa-banner--success">
              <ShieldCheck size={14} /><span>{successMsg}</span>
            </div>
          )}
          {/* Expired banner */}
          {expired && (
            <div className="sa-banner sa-banner--error">
              <span>OTP has expired. Please request a new one.</span>
            </div>
          )}

          {/* OTP digit inputs */}
          <div className="sa-otp-wrap">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                type="text" inputMode="numeric" maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e)  => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className={`sa-otp-digit${error ? ' sa-otp-digit--error':''}${digit ? ' sa-otp-digit--filled':''}`}
                disabled={loading || expired}
                autoFocus={i === 0}
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>

          {error && (
            <span className="sa-error-text" style={{ textAlign:'center', display:'block' }}>
              {error}
            </span>
          )}

          {/* Timer */}
          <div className="sa-otp-timer">
            {expired
              ? 'OTP has expired'
              : <>Expires in <span className="sa-otp-timer__count" style={{ color: getTimerColor(timeLeft) }}>{formatTime(timeLeft)}</span></>}
          </div>

          {/* Verify + Resend buttons */}
          <div style={{ display:'flex', gap:'10px', width:'100%' }}>
            <button
              type="button" className="sa-submit-btn" style={{ margin:0 }}
              onClick={handleVerify} disabled={loading || expired}
            >
              {loading
                ? <span className="sa-btn-inner"><span className="sa-spinner"/>Verifying…</span>
                : 'Verify OTP'}
            </button>
            <button
              type="button" className="sa-submit-btn" style={{ margin:0 }}
              onClick={handleResend} disabled={resending || loading}
            >
              {resending
                ? <span className="sa-btn-inner"><RefreshCw size={13} style={{ marginRight:4, animation:'saSpin 0.7s linear infinite' }}/>Resending…</span>
                : <span className="sa-btn-inner"><RefreshCw size={13} style={{ marginRight:4 }}/>Resend OTP</span>}
            </button>
          </div>
        </div>

        <p className="sa-form-footer">
          <button
            onClick={() => navigate('/student/login', { replace: true })}
            style={{ background:'none', border:'none', color:'#1E90FF', cursor:'pointer', fontSize:'13px', fontWeight:600, fontFamily:'Urbanist,sans-serif' }}
          >← Back to Login</button>
        </p>
      </AuthFormCard>
    </AuthLayout>
    </PageWrapper>
  );
};

export default VerifyOtp;
