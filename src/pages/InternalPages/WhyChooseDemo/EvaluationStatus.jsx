import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cpu, Search, CheckCircle, Database, ChevronRight, Sparkles } from 'lucide-react';
import './EvaluationStatus.css';

const EvaluationStatus = () => {
    const [progress, setProgress] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);
    const navigate = useNavigate();

    const stages = [
        { icon: <Search size={20} />, text: "Analyzing foundational responses..." },
        { icon: <Database size={20} />, text: "Checking performance metadata..." },
        { icon: <Cpu size={20} />, text: "Running cross-category analytics..." },
        { icon: <Sparkles size={20} />, text: "Finalizing skill level categorization..." }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress > 25 && progress <= 50) setStatusIndex(1);
        if (progress > 50 && progress <= 75) setStatusIndex(2);
        if (progress > 75) setStatusIndex(3);
    }, [progress]);

    return (
        <div className="eval-page">
            <motion.div 
                className="eval-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="eval-ai-badge">
                    <div className="pulse-dot"></div>
                    AI Evaluation Engine Active
                </div>

                <div className="eval-main">
                    <div className="scanner-container">
                        <div className="scanner-circle">
                            <motion.div 
                                className="scan-line"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                            <div className="inner-icon">
                                <Cpu size={48} className="cpu-vibrate" />
                            </div>
                        </div>
                    </div>

                    <div className="eval-content">
                        <h2>Processing Results</h2>
                        <p>InfyCode AI is analyzing your Aptitude, Reasoning, and Communication scores to determine your professional track.</p>

                        <div className="progress-container">
                            <div className="progress-meta">
                                <span>Status: {stages[statusIndex].text}</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="progress-bar">
                                <motion.div 
                                    className="progress-fill"
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <ul className="status-checklist">
                            {stages.map((stage, idx) => (
                                <li key={idx} className={progress > (idx * 25) + 10 ? 'active' : ''}>
                                    <div className="check-dot">
                                        {progress > (idx + 1) * 25 ? <CheckCircle size={14} /> : stage.icon}
                                    </div>
                                    <span>{stage.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {progress === 100 && (
                    <motion.div 
                        className="eval-footer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <button 
                            className="view-results-btn"
                            onClick={() => navigate('/skill-test/result')}
                        >
                            View Skill Level Report
                            <ChevronRight size={20} />
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default EvaluationStatus;
