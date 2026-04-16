import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp, Zap, Target, BookOpen, Share2, ArrowRight } from 'lucide-react';
import './SkillLevelResult.css';

const SkillLevelResult = () => {
    // Demo data for the result
    const result = {
        level: "Advanced",
        percentile: "92nd",
        role: "Full-Stack Specialist",
        strengths: ["Problem Solving", "Logical Reasoning", "Technical Communication"],
        nextSteps: [
            "Enroll in the MERN Stack Mastery track",
            "Participate in the upcoming Hackathon",
            "Book a 1-1 session for Resume Review"
        ]
    };

    return (
        <div className="result-page">
            <header className="result-header">
                <motion.div 
                    className="result-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                >
                    <Award size={32} />
                </motion.div>
                <h1>Assessment Complete</h1>
                <p>Based on your performance, you have been categorized as:</p>
            </header>

            <main className="result-main">
                <motion.div 
                    className="level-card-premium"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="level-highlight">
                        <span className="level-label">{result.level}</span>
                        <div className="level-glow"></div>
                    </div>
                    <div className="level-details">
                        <h3>{result.role}</h3>
                        <p>You are in the top <strong>{result.percentile} percentile</strong> of candidates who took this assessment.</p>
                    </div>
                    
                    <div className="metrics-grid">
                        <div className="metric">
                            <Zap size={20} />
                            <span>Quick Thinking</span>
                            <div className="m-bar"><div className="m-fill" style={{width: '88%'}}></div></div>
                        </div>
                        <div className="metric">
                            <Target size={20} />
                            <span>Precision</span>
                            <div className="m-bar"><div className="m-fill" style={{width: '94%'}}></div></div>
                        </div>
                    </div>
                </motion.div>

                <div className="result-sections">
                    <motion.div 
                        className="strengths-box"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4><TrendingUp size={20} /> Core Strengths</h4>
                        <ul>
                            {result.strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div 
                        className="next-steps-box"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4><BookOpen size={20} /> Recommended Path</h4>
                        <div className="track-card">
                            <span>High-Intensity Career Track</span>
                            <p>Optimized for rapid growth into senior roles.</p>
                            <button className="track-btn">Explore Track <ArrowRight size={16} /></button>
                        </div>
                    </motion.div>
                </div>
            </main>

            <footer className="result-footer">
                <button className="share-btn"><Share2 size={18} /> Share Report</button>
                <button className="dashboard-btn" onClick={() => window.location.href = '/student-dashboard'}>
                    Go to Dashboard
                </button>
            </footer>
        </div>
    );
};

export default SkillLevelResult;
