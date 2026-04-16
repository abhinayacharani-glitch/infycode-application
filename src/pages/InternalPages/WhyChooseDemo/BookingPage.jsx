import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, User, Mail, MessageSquare, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './BookingPage.css';

const BookingPage = () => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const slots = [
        "10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"
    ];

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep(4); // Success step
    };

    return (
        <div className="booking-page">
            <div className="booking-container">
                <motion.div 
                    className="booking-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Progress Bar */}
                    <div className="booking-progress">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`progress-dot ${step >= s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                                {step > s ? <CheckCircle2 size={16} /> : s}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="step-content"
                            >
                                <h2>Select a Date</h2>
                                <p>Choose a day that works best for your 1-on-1 career consultation.</p>
                                <div className="calendar-grid-mock">
                                    {/* Simplified Calendar Mock for professional look */}
                                    {Array.from({ length: 14 }).map((_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + i + 1);
                                        const isSelected = selectedDate === i;
                                        return (
                                            <button 
                                                key={i} 
                                                className={`calendar-day ${isSelected ? 'selected' : ''}`}
                                                onClick={() => setSelectedDate(i)}
                                            >
                                                <span className="day-name">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                <span className="day-num">{date.getDate()}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="step-actions">
                                    <button 
                                        className="next-btn" 
                                        disabled={selectedDate === null}
                                        onClick={handleNext}
                                    >
                                        Next: Choose Time <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="step-content"
                            >
                                <h2>Available Time Slots</h2>
                                <p>Our experts are available during these hours for personalized guidance.</p>
                                <div className="slots-grid">
                                    {slots.map((slot, i) => (
                                        <button 
                                            key={i} 
                                            className={`slot-btn ${selectedSlot === i ? 'selected' : ''}`}
                                            onClick={() => setSelectedSlot(i)}
                                        >
                                            <Clock size={16} />
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                                <div className="step-actions">
                                    <button className="back-btn" onClick={handleBack}>Back</button>
                                    <button 
                                        className="next-btn" 
                                        disabled={selectedSlot === null}
                                        onClick={handleNext}
                                    >
                                        Next: Your Details <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div 
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="step-content"
                            >
                                <h2>Confirm Your Details</h2>
                                <p>Provide your information so our expert can prepare for the session.</p>
                                <form onSubmit={handleSubmit} className="booking-form">
                                    <div className="input-group">
                                        <label><User size={16} /> Full Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Enter your name" 
                                            required 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label><Mail size={16} /> Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="Enter your email" 
                                            required 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label><MessageSquare size={16} /> What would you like to discuss?</label>
                                        <textarea 
                                            placeholder="Tell us about your career goals or doubts..." 
                                            rows="4"
                                            value={formData.message}
                                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        ></textarea>
                                    </div>
                                    <div className="step-actions">
                                        <button type="button" className="back-btn" onClick={handleBack}>Back</button>
                                        <button type="submit" className="confirm-btn">
                                            Confirm Booking
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div 
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="success-content"
                            >
                                <div className="success-icon">
                                    <CheckCircle2 size={64} />
                                </div>
                                <h2>Booking Confirmed!</h2>
                                <p>Thank you, <strong>{formData.name}</strong>. Your session is scheduled for 10:00 AM tomorrow.</p>
                                <p className="sub-text">A confirmation email with the Zoom link has been sent to {formData.email}.</p>
                                <button className="home-btn" onClick={() => window.location.href = '/'}>
                                    Return Home
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingPage;
