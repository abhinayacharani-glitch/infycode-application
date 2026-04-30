import React, { useState, useEffect } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getStudentMyResults } from '../../../services/api';
import './SkillTest.css';

const SkillTest = () => {
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const checkCompletion = async () => {
      try {
        setLoading(true);
        const data = await getStudentMyResults();
        if (data.success && data.testResults?.foundationalCompleted) {
          setIsUnlocked(true);
        } else {
          setIsUnlocked(false);
        }
      } catch (err) {
        console.error("Error checking test status:", err);
        setError(err.message || "Unable to sync test status with server. Showing local status.");
        // Fallback to localStorage if API fails
        if (localStorage.getItem("foundationalTestCompleted") === "true") {
          setIsUnlocked(true);
        }
      } finally {

        setLoading(false);
      }
    };

    checkCompletion();
  }, []);

  return (
    <div className="page-container">
      <header className="page-header-centered">
        <h2>Skill Based Test</h2>
        <p>Evaluate your strengths and get categorized into the right learning path.</p>
      </header>

      {error && <div className="error-alert-banner" style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', border: '1px solid #fecaca' }}>{error}</div>}


      <div className="special-note-box">
        <p>
          ⚠️Mandatory Step:Students must first complete
          Aptitude, Reasoning, and Communication tests before attempting the
          Core Technical Test.
        </p>
      </div>

      <div className="skill-content-flow">
        <div className="skill-card modern">
          <div className="card-badge">Step 01</div>
          <div className="skill-image-box">
            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800" alt="Foundational Test" />
          </div>
          <div className="skill-info">
            <h3>Aptitude, Reasoning & Communication</h3>
            <p>Master the basics that are crucial for any job role and clear initial filtering rounds.</p>
            <button className="start-btn-modern" onClick={() => navigate("/student/test")}>Start Test</button>
          </div>
        </div>

        <div className="flow-indicator">
          <FaArrowRight className="flow-arrow" />
        </div>

        <div className={`skill-card modern ${!isUnlocked ? "locked-card" : ""}`}>
          <div className="card-badge secondary">Step 02</div>
          <div className="skill-image-box">
            <img src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800" alt="Technical Test" />
          </div>
          <div className="skill-info">
            <h3>Core Technical Test</h3>
            <p>Deep dive into DSA, System Design, and niche technologies to prove your technical expertise.</p>
            <button
              className={`start-btn-modern ${!isUnlocked || loading ? "locked" : ""}`}
              onClick={() => !loading && isUnlocked && navigate("/student/core-test")}
              disabled={loading || !isUnlocked}
            >
              {loading ? "Checking..." : isUnlocked ? "Start Core Test" : "Complete Step 1 to Unlock"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTest;