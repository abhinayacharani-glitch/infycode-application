import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCpu, FiSearch, FiDatabase, FiLayers, FiActivity } from "react-icons/fi";
import "./EvaluationStatus.css";

export default function EvaluationStatus() {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  const logMessages = [
    "Analyzing complexity of nested loops...",
    "Verifying algorithmic efficiency (Big O)...",
    "Checking memory management patterns...",
    "Validating secure coding practices...",
    "Evaluating API design consistency...",
    "Synthesizing final talent profile..."
  ];

  const statuses = [
    { p: 10, t: "Fetching foundational responses..." },
    { p: 30, t: "Analyzing logic patterns..." },
    { p: 50, t: "Benchmarking against industry standards..." },
    { p: 75, t: "Synthesizing career trajectory..." },
    { p: 95, t: "Generating skill profile..." },
    { p: 100, t: "Analysis Complete." }
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < statuses.length) {
        setProgress(statuses[currentStep].p);
        setStatusText(statuses[currentStep].t);
        if (logMessages[currentStep]) {
          setLogs(prev => [...prev, logMessages[currentStep]].slice(-3));
        }
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => navigate("/skill-test/result"), 1000);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="eval-container">
      <div className="eval-card">
        <div className="ai-scanner">
          <motion.div 
            className="scanner-circle"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <FiCpu className="cpu-icon" />
          </motion.div>
          <motion.div 
            className="scanner-line"
            animate={{ y: [0, 200, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <h2 className="eval-title">Processing Results</h2>
        <p className="eval-subtitle">Our AI is analyzing your performance across 40+ parameters.</p>

        {/* AI Logs Output */}
        <div className="ai-logs-container-v4">
          {logs.map((log, i) => (
            <motion.div 
              key={i} 
              className="log-line-v4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="log-arrow">&gt;</span> {log}
            </motion.div>
          ))}
        </div>

        <div className="eval-stats-grid">
          <div className="stat-item-v4">
            <FiSearch />
            <span>Logic Depth</span>
          </div>
          <div className="stat-item-v4">
            <FiLayers />
            <span>Syntax Quality</span>
          </div>
          <div className="stat-item-v4">
            <FiDatabase />
            <span>Data Management</span>
          </div>
          <div className="stat-item-v4">
            <FiActivity />
            <span>Optimization</span>
          </div>
        </div>

        <div className="eval-progress-box">
          <div className="eval-progress-bar">
            <motion.div 
              className="eval-progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="status-text-v4">{statusText}</p>
        </div>
      </div>

      {/* Back Button */}
      <button className="global-back-btn-v4" onClick={() => navigate(-1)}>
        <FiArrowRight style={{ transform: "rotate(180deg)" }} /> Back
      </button>
    </div>
  );
}
