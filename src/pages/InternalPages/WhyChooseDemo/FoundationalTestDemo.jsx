import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckSquare, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import "./FoundationalTestDemo.css";

const questions = [
  { id: 1, category: "Aptitude", q: "If a project takes 4 developers 12 days, how many days will 6 developers take?", options: ["6 days", "8 days", "9 days", "10 days"] },
  { id: 2, category: "Reasoning", q: "Identify the pattern: 2, 6, 12, 20, 30, ?", options: ["40", "42", "44", "46"] },
  { id: 3, category: "Communication", q: "Which response is most professional for a missed deadline?", options: ["I didn't have time.", "The task was too hard.", "Apologies, I missed the deadline due to X, here is the new plan.", "It wasn't my fault."] }
];

export default function FoundationalTestDemo() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 mins
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setCompleted(true);
    }
  };

  return (
    <div className="test-demo-container">
      <div className="test-v4-card">
        <header className="test-header-v4">
          <div className="test-info">
            <span className="test-tag">Live Demo Assessment</span>
            <h2>Foundational Skills</h2>
          </div>
          <div className="test-timer">
            <FiClock /> {formatTime(timeLeft)}
          </div>
        </header>

        <div className="test-progress-v4">
          <div className="progress-bar-v4">
            <motion.div 
              className="progress-fill-v4"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span>Question {currentIdx + 1} of {questions.length}</span>
        </div>

        <main className="test-main-v4">
          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div 
                key={currentIdx}
                className="q-container-v4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <span className="q-category">{questions[currentIdx].category}</span>
                <p className="q-text">{questions[currentIdx].q}</p>
                <div className="options-grid-v4">
                  {questions[currentIdx].options.map((opt, i) => (
                    <button key={i} className="opt-btn-v4" onClick={handleNext}>
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="test-completed-v4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="success-icon-v4"><FiCheckCircle /></div>
                <h3>Assessment Completed!</h3>
                <p>Your foundational responses have been recorded.</p>
                <button className="cta-next-v4" onClick={() => navigate("/skill-test/evaluation")}>
                  Proceed to AI Evaluation <FiArrowRight />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Back Button */}
      <button className="global-back-btn-v4" onClick={() => navigate(-1)}>
        <FiArrowRight style={{ transform: "rotate(180deg)" }} /> Back
      </button>
    </div>
  );
}
