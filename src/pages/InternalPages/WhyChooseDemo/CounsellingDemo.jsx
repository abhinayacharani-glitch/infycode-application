import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Clock, CheckCircle, Info, Calendar, ChevronDown, ChevronUp, Users, Star } from 'lucide-react';
import './CounsellingDemo.css';

const CounsellingDemo = () => {
    const [openCardId, setOpenCardId] = useState(null);
    const [activeCountdowns, setActiveCountdowns] = useState({});
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeSlots = [
        { label: '10:00 AM - 11:00 AM', startHour: 10, endHour: 11, status: 'upcoming' },
        { label: '11:00 AM - 12:00 PM', startHour: 11, endHour: 12, status: 'upcoming' },
        { label: '02:00 PM - 03:00 PM', startHour: 14, endHour: 15, status: 'live' },
        { label: '03:00 PM - 04:00 PM', startHour: 15, endHour: 16, status: 'upcoming' },
    ];

    const currentHour = currentTime.getHours();

    const handleSlotClick = (cardIndex, slot) => {
        if (currentHour >= slot.startHour && currentHour < slot.endHour) {
            window.open('https://meet.google.com/wxs-wifp-tti', '_blank', 'noopener,noreferrer');
        } else if (currentHour < slot.startHour) {
            setActiveCountdowns(prev => ({
                ...prev,
                [cardIndex]: { targetHour: slot.startHour, label: slot.label }
            }));
        }
    };

    const getCountdownString = (targetHour) => {
        const targetTime = new Date(currentTime);
        targetTime.setHours(targetHour, 0, 0, 0);
        const diff = targetTime - currentTime;
        if (diff <= 0) return "Starting...";
        
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const cards = [
        {
            title: '1-1 Career Counselling',
            description: 'Get personalized guidance from experts to shape your career path. This is a private dedicated session for you.',
            imageUrl: 'https://medavas.com/wp-content/uploads/2023/12/career-counselling-online-1024x683.jpg',
            hasMeetButton: true,
            rating: 4.9,
            attendees: '12k+',
            features: ['Private Session', 'Personalized Roadmap', 'Resume Review']
        },
        {
            title: '1-Many Counselling',
            description: 'Collaborate with peers and learn industry insights together in our interactive group sessions.',
            imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
            hasMeetButton: true,
            rating: 4.8,
            attendees: '8k+',
            features: ['Peer Learning', 'Q&A with Experts', 'Industry Trends']
        }
    ];

    return (
        <div className="demo-page">
            <header className="demo-header">
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="demo-badge"
                >
                    Exclusive Mentorship
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    Professional Counselling Sessions
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Unlock your potential with real-time industry guidance and interactive sessions.
                </motion.p>
            </header>

            <div className="demo-grid">
                {cards.map((card, index) => (
                    <motion.div 
                        key={index} 
                        className={`demo-card ${openCardId === index ? 'expanded' : ''}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="card-media">
                            <img src={card.imageUrl} alt={card.title} />
                            <div className="card-floating-info">
                                <span className="stat"><Star size={14} fill="currentColor"/> {card.rating}</span>
                                <span className="stat"><Users size={14} /> {card.attendees}</span>
                            </div>
                            <div className="card-status-pill">
                                <div className="live-dot"></div> LIVE NOW
                            </div>
                        </div>
                        <div className="card-body">
                            <h3>{card.title}</h3>
                            <p>{card.description}</p>
                            
                            <ul className="feature-list">
                                {card.features.map((f, i) => (
                                    <li key={i}><CheckCircle size={14} /> {f}</li>
                                ))}
                            </ul>

                            <div className="card-footer-prime">
                                {card.hasMeetButton && (
                                    <div className="meeting-engine-v2">
                                        {activeCountdowns[index] ? (
                                            <motion.div 
                                                className="countdown-panel"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="countdown-header">
                                                    <Clock size={16} />
                                                    <span>Session Starting Soon</span>
                                                </div>
                                                <div className="countdown-time">{getCountdownString(activeCountdowns[index].targetHour)}</div>
                                                <button className="reset-link" onClick={() => setActiveCountdowns({})}>Select different slot</button>
                                            </motion.div>
                                        ) : (
                                            <div className="slots-wrapper-prime">
                                                <button 
                                                    className={`action-trigger-btn ${openCardId === index ? 'active' : ''}`}
                                                    onClick={() => setOpenCardId(openCardId === index ? null : index)}
                                                >
                                                    <div className="btn-content">
                                                        <Video size={18} />
                                                        <span>Join Live Session</span>
                                                    </div>
                                                    {openCardId === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {openCardId === index && (
                                                        <motion.div 
                                                            className="slots-reveal-box"
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                        >
                                                            <div className="reveal-header">Available Today</div>
                                                            <div className="slots-flex-grid">
                                                                {timeSlots.map((slot, sIdx) => {
                                                                    const isPast = currentHour >= slot.endHour;
                                                                    const isLive = currentHour >= slot.startHour && currentHour < slot.endHour;
                                                                    return (
                                                                        <button
                                                                            key={sIdx}
                                                                            className={`slot-ticket ${isPast ? 'past' : ''} ${isLive ? 'live' : ''}`}
                                                                            onClick={() => !isPast && handleSlotClick(index, slot)}
                                                                            disabled={isPast}
                                                                        >
                                                                            <div className="ticket-time">{slot.label}</div>
                                                                            <div className="ticket-action">
                                                                                {isLive ? 'Attend Now' : isPast ? 'Ended' : 'View Meta'}
                                                                            </div>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="demo-info-section">
                <div className="info-card-v2">
                    <Calendar size={32} />
                    <h4>Daily Academic Slots</h4>
                    <p>New sessions open every weekday. Guaranteed slot for every premium member.</p>
                </div>
                <div className="info-card-v2">
                    <Info size={32} />
                    <h4>Resource Ready</h4>
                    <p>Each session includes digital resources and a recorded copy for your archives.</p>
                </div>
            </div>
        </div>
    );
};

export default CounsellingDemo;
