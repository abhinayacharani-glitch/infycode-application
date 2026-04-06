import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Package, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './VideoCourses.css';

const courseTitles = {
  java: "Java Full Stack Mastery",
  python: "Python Data Science Pro",
  cybersecurity: "Ethical Hacking & Cyber Ops"
};

const VideoPaymentPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    upi: ''
  });

  const standardizedId = courseId?.toLowerCase() || 'java';
  const title = courseTitles[standardizedId] || "Technical Training";

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const startPayment = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate gateway processing
    setTimeout(() => {
        setLoading(false);
        setShowSuccess(true);
    }, 2500);
  };

  const finalizeUnlock = () => {
    // GLOBAL UNLOCK LOGIC: Setting a single flag that VideoModulesPage checks for all courses
    localStorage.setItem('video_all_unlocked', 'true');
    localStorage.setItem('isPaid', 'true'); // General fallback flag
    
    // Also maintaining the list for individual tracking if needed in future
    const unlockedCoursesStr = localStorage.getItem('unlocked_video_courses');
    const unlockedCourses = unlockedCoursesStr ? JSON.parse(unlockedCoursesStr) : [];
    if (!unlockedCourses.includes(standardizedId)) {
        unlockedCourses.push(standardizedId);
        localStorage.setItem('unlocked_video_courses', JSON.stringify(unlockedCourses));
    }
    
    navigate(`/video-courses/${standardizedId}`);
  };

  return (
    <div className="vc-payment-viewport" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: '#f8fafc',
        padding: '20px'
    }}>
      <motion.button 
        className="ct-back-btn" 
        onClick={() => navigate(-1)}
        style={{ position: 'fixed', top: '30px', left: '30px', zIndex: 100 }}
        whileHover={{ x: -5 }}
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      <motion.div 
        className="vc-payment-card" 
        style={{ 
            maxWidth: '480px', 
            width: '100%',
            background: 'white',
            borderRadius: '28px',
            padding: '40px',
            boxShadow: '0 25px 60px rgba(15, 23, 42, 0.08)',
            border: '1px solid #eef2f6',
            position: 'relative'
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ background: '#eff6ff', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                <CreditCard size={32} color="#2563eb" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Course Enrollment</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>
                Unlock full access to **{title}** and all video series.
            </p>
        </div>

        <form onSubmit={startPayment}>
            <div className="vc-payment-form-group">
                <label className="vc-payment-label">Full Name</label>
                <input 
                    type="text" 
                    name="name"
                    className="vc-payment-input" 
                    placeholder="Enter your name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div className="vc-payment-form-group">
                    <label className="vc-payment-label">Email Address</label>
                    <input 
                        type="email" 
                        name="email"
                        className="vc-payment-input" 
                        placeholder="email@example.com" 
                        required 
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="vc-payment-form-group">
                    <label className="vc-payment-label">Phone Number</label>
                    <input 
                        type="tel" 
                        name="phone"
                        className="vc-payment-input" 
                        placeholder="+91 12345 67890" 
                        required 
                        value={formData.phone}
                        onChange={handleInputChange}
                    />
                </div>
            </div>

            <div className="vc-payment-form-group" style={{ marginTop: '5px' }}>
                <label className="vc-payment-label">Unified Payments (UPI)</label>
                <input 
                    type="text" 
                    name="upi"
                    className="vc-payment-input" 
                    placeholder="yourname@upi" 
                    required 
                    value={formData.upi}
                    onChange={handleInputChange}
                />
            </div>

            <div style={{ 
                background: '#f8fafc', 
                borderRadius: '16px', 
                padding: '16px',
                textAlign: 'left',
                margin: '20px 0',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Full Mastery Bundle</span>
                    <span style={{ fontWeight: 700 }}>₹1,499</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                    <span>Amount Payable</span>
                    <span style={{ color: '#2563eb' }}>₹1,499</span>
                </div>
            </div>

            <button 
                type="submit"
                className="btn-primary vc-payment-btn" 
                disabled={loading}
                style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800, fontSize: '16px' }}
            >
                {loading ? "Securely Processing..." : `Complete Enrollment`}
            </button>
        </form>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px' }}>
            <ShieldCheck size={16} /> Secure Payment Processing (256-bit SSL)
        </div>
      </motion.div>

      <AnimatePresence>
      {showSuccess && (
        <div className="vc-success-overlay">
            <motion.div 
                className="vc-success-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ maxWidth: '400px', width: '90%', borderRadius: '32px' }}
            >
                <div style={{ background: '#10b98115', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <CheckCircle color="#10b981" size={48} />
                </div>
                <h2 style={{ fontWeight: 800, fontSize: '24px', color: '#1e293b' }}>Payment Successful!</h2>
                <p style={{ color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
                    All chapters for **{title}** and related courses are now unlocked. Welcome to the learning journey!
                </p>
                <button 
                    className="btn-primary" 
                    onClick={finalizeUnlock}
                    style={{ width: '100%', padding: '18px', borderRadius: '16px' }}
                >
                    Start Learning
                </button>
            </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPaymentPage;
