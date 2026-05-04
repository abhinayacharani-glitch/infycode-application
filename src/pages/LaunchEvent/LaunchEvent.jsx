import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Zap, Award, Rocket, CheckCircle, Sparkles, Globe, BrainCircuit, Instagram, Linkedin, ExternalLink, ArrowLeft } from 'lucide-react';
import LoginBackground from '../../student-auth/components/LoginBackground';
import './LaunchEvent.css';

const LaunchEvent = ({ onEnterSite }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const [isSubmitted, setIsSubmitted] = useState(false);

    // Set specific target date: May 15, 2026, 4:00 PM
    const targetDate = new Date('2026-05-15T16:00:00').getTime();

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleRSVP = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        // After showing success for a bit, enter the site
        setTimeout(() => {
            onEnterSite();
        }, 3000);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="launch-root fullscreen-launch">
            {/* Background from Login Page */}
            <div className="launch-bg-wrapper">
                <LoginBackground />
            </div>

            {/* Hero Section */}
            <header className="launch-hero">
                <motion.button 
                    className="launch-badge-btn"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    onClick={() => onEnterSite('/')}
                >
                    INFYCODE
                </motion.button>
                
                <motion.h1 
                    className="launch-title"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    INFYCODE
                </motion.h1>

                <motion.p 
                    className="launch-tagline"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                >
                    PRODUCT BY CHARANI INFOTECH PVT LTD
                </motion.p>

                <motion.p 
                    className="launch-subtitle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    Experience a revolutionary platform designed to empower the next generation of tech leaders. <strong>INFYCODE</strong> is your gateway to mastery.
                </motion.p>

                {/* Countdown */}
                <motion.div 
                    className="countdown-container"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 1 }}
                >
                    <div className="countdown-item">
                        <span className="countdown-val">{timeLeft.days}</span>
                        <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-val">{timeLeft.hours}</span>
                        <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-val">{timeLeft.minutes}</span>
                        <span className="countdown-label">Mins</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-val">{timeLeft.seconds}</span>
                        <span className="countdown-label">Secs</span>
                    </div>
                </motion.div>

                <motion.div 
                    className="launch-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <a href="#rsvp" className="btn-launch-primary">Reserve Your Spot</a>
                    <button 
                        onClick={() => onEnterSite('/')} 
                        className="btn-launch-primary"
                    >
                        Explore Courses
                    </button>
                </motion.div>
            </header>

            {/* Details and Vision sections removed as requested */}

            {/* RSVP Section */}
            <section id="rsvp" className="launch-rsvp">
                <div className="rsvp-container">
                    {isSubmitted ? (
                        <motion.div 
                            className="rsvp-success"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{ color: '#10b981', marginBottom: '20px' }}>
                                <CheckCircle size={80} style={{ margin: '0 auto' }} />
                            </div>
                            <h2>You're on the list!</h2>
                            <p style={{ color: '#94a3b8', fontSize: '18px' }}>
                                We've sent a confirmation email to your inbox. Get ready for an unforgettable experience.
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            <h2>Get Your Invitation</h2>
                            <form className="rsvp-form" onSubmit={handleRSVP}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" className="form-control" placeholder="John Doe" required />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" className="form-control" placeholder="john@example.com" required />
                                </div>
                                <button type="submit" className="rsvp-submit">Get Invitation Link</button>
                            </form>
                            <div className="rsvp-social-connect">
                                <p>Follow our journey</p>
                                <div className="social-icons">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                        <Instagram size={20} />
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn">
                                        <Linkedin size={20} />
                                    </a>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Footer remains */}

            <footer style={{ padding: '60px 20px', textAlign: 'center', borderTop: '1px solid var(--launch-glass-border)' }}>
                <p style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700', textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' }}>
                    &copy; 2026 INFYCODE. All Rights Reserved.
                </p>
                <p style={{ color: '#ffffff', fontSize: '12px', marginTop: '12px', letterSpacing: '2px', fontWeight: '800', opacity: 0.9, textShadow: '0 0 8px rgba(255, 255, 255, 0.2)' }}>
                    PRODUCT BY CHARANI INFOTECH PVT LTD
                </p>
            </footer>
        </div>
    );
};

export default LaunchEvent;
