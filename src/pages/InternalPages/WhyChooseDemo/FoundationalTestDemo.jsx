import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './FoundationalTestDemo.css';

const QUESTIONS = [
    {
        id: 1,
        category: "Aptitude",
        question: "A train moves with a speed of 108 km/hr. Its speed in meters per second is?",
        options: ["25 m/sec", "30 m/sec", "35 m/sec", "40 m/sec"],
        correct: 1
    },
    {
        id: 2,
        category: "Reasoning",
        question: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
        options: ["His own", "His son's", "His father's", "His nephew's"],
        correct: 1
    },
    {
        id: 3,
        category: "Communication",
        question: "Choose the correct antonym for the word 'AMBIGUOUS'.",
        options: ["Vague", "Clear", "Uncertain", "Obscure"],
        correct: 1
    }
];

const FoundationalTestDemo = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
    const [isFinished, setIsFinished] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (timeLeft > 0 && !isFinished) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, isFinished]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
        } else {
            setIsFinished(true);
        }
    };

    if (isFinished) {
        return (
            <div className="test-demo-page">
                <motion.div 
                    className="test-success-card"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="success-icon"><CheckCircle2 size={64} /></div>
                    <h2>Section Completed!</h2>
                    <p>Your Foundational Test responses have been recorded successfully.</p>
                    <div className="stat-row">
                        <span>Time Taken: {formatTime(300 - timeLeft)}</span>
                        <span>Questions: 3/3</span>
                    </div>
                    <button 
                        className="prime-btn"
                        onClick={() => navigate('/skill-test/evaluation')}
                    >
                        Proceed to Evaluation <ChevronRight size={18} />
                    </button>
                </motion.div>
            </div>
        );
    }

    const currentQ = QUESTIONS[currentIndex];

    return (
        <div className="test-demo-page">
            <header className="test-nav">
                <div className="test-brand"><BarChart3 size={24} /> Foundational Assessment</div>
                <div className="test-timer">
                    <Clock size={18} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </header>

            <main className="test-content">
                <div className="test-progress">
                    <div className="progress-bar">
                        <motion.div 
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
                        />
                    </div>
                    <span className="q-count">Question {currentIndex + 1} of {QUESTIONS.length}</span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={currentIndex}
                        className="question-card"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                    >
                        <span className="q-cat">{currentQ.category}</span>
                        <h3>{currentQ.question}</h3>

                        <div className="options-grid">
                            {currentQ.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    className={`option-btn ${selectedOption === idx ? 'selected' : ''}`}
                                    onClick={() => setSelectedOption(idx)}
                                >
                                    <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="test-footer">
                    <div className="warning-pill">
                        <AlertCircle size={14} />
                        Auto-submits when time expires
                    </div>
                    <button 
                        className="next-btn"
                        disabled={selectedOption === null}
                        onClick={handleNext}
                    >
                        {currentIndex === QUESTIONS.length - 1 ? 'Finish Section' : 'Save & Next'}
                        <ChevronRight size={18} />
                    </button>
                </div>
            </main>
        </div>
    );
};

export default FoundationalTestDemo;
