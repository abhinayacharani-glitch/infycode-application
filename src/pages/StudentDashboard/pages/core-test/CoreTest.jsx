import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Timer from './components/Timer';
import Question from './components/Question';
import QuestionNavigation from './components/QuestionNavigation';
import { saveStudentTestResults } from '../../../../services/api';

const coreQuestions = [
  {
    id: 1,
    text: "Which of the following closely describes a 'Full Stack' developer?",
    options: [
      { id: 'A', text: "Develops only backend applications." },
      { id: 'B', text: "Develops frontend functionality and backend APIs seamlessly." },
      { id: 'C', text: "Writes test scripts." },
      { id: 'D', text: "Manages network deployments exclusively." }
    ]
  },
  {
    id: 2,
    text: "What does JVM stand for in the Java ecosystem?",
    options: [
      { id: 'A', text: "Java Virtual Machine" },
      { id: 'B', text: "Java Vendor Machine" },
      { id: 'C', text: "Just Virtual Method" },
      { id: 'D', text: "None of the above" }
    ]
  },
  {
    id: 3,
    text: "Which of these is a prominent framework for building Enterprise Java backend apps?",
    options: [
      { id: 'A', text: "React" },
      { id: 'B', text: "Spring Boot" },
      { id: 'C', text: "Express JS" },
      { id: 'D', text: "Django" }
    ]
  },
  {
    id: 4,
    text: "Which property is used in CSS to change the background color?",
    options: [
      { id: 'A', text: "color" },
      { id: 'B', text: "background-color" },
      { id: 'C', text: "bgcolor" },
      { id: 'D', text: "canvas-color" }
    ]
  },
  {
    id: 5,
    text: "In React, what is the purpose of 'useState'?",
    options: [
      { id: 'A', text: "To manage side effects." },
      { id: 'B', text: "To handle routing." },
      { id: 'C', text: "To declare and manage state variables in functional components." },
      { id: 'D', text: "To access direct DOM nodes." }
    ]
  }
];

const CoreTest = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentQuestion = coreQuestions[currentIndex];
  const totalQuestions = coreQuestions.length;

  const handleAnswerSelect = (optionId) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSaveAndNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentIndex(index);
  };

  const handleSubmit = async () => {
    if (window.confirm("Submit your Core Test?")) {
      try {
        setSaving(true);
        const score = Object.keys(answers).length;
        await saveStudentTestResults('core', { coreTechnical: score });
        setIsSubmitted(true);
      } catch (err) {
        console.error("Core Test Submit Error:", err);
        alert("Failed to save results: " + err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleTimeUp = async () => {
    alert("Time is up! Core test auto-submitted.");
    try {
      setSaving(true);
      const score = Object.keys(answers).length;
      await saveStudentTestResults('core', { coreTechnical: score });
      setIsSubmitted(true);
    } catch (err) {
      console.error("Auto-submit failed", err);
      setIsSubmitted(true);
    } finally {
      setSaving(false);
    }
  };

  if (isSubmitted) {
    const score = Object.keys(answers).length;
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: '"Open Sans", sans-serif' }}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 20px' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎯</div>
            <h2 style={{ fontSize: '28px', color: '#1f2937', marginBottom: '10px' }}>Core Test Submitted!</h2>
            <p style={{ color: '#6b7280', marginBottom: '30px' }}>Your technical assessment is complete. Here is your performance summary:</p>
            
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '30px', borderRadius: '16px', marginBottom: '30px' }}>
              <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '8px' }}>Core Technical Score</div>
              <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{score} <span style={{ fontSize: '20px', opacity: 0.8 }}>/ {totalQuestions}</span></div>
            </div>

            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '30px' }}>
              Attempted: <b>{score}</b> questions | Total: <b>{totalQuestions}</b>
            </p>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '16px', background: '#0A3D91' }}
              onClick={() => navigate('/student-dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Set for question navigation
  const answeredSet = new Set();
  coreQuestions.forEach((q, idx) => {
    if (answers[q.id]) answeredSet.add(idx);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f4f7fb', fontFamily: '"Open Sans", sans-serif', boxSizing: 'border-box' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', marginTop: '80px', maxHeight: 'calc(100vh - 80px)' }}>
        
        {/* Main Content Area */}
        <div style={{ flex: 3, background: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '25px', alignItems: 'center' }}>
             <h2 style={{ color: '#0A3D91', margin: 0, fontSize: '1.5rem' }}>Technical Section</h2>
             <Timer onTimeUp={handleTimeUp} />
          </div>
          <Question 
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswerSelect={handleAnswerSelect}
            onPrevious={handlePrevious}
            onSaveAndNext={handleSaveAndNext}
            isFirst={currentIndex === 0}
            isLast={currentIndex === totalQuestions - 1}
          />
        </div>

        {/* Side Panel Area */}
        <div style={{ flex: 1, background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', minWidth: '280px', overflowY: 'auto' }}>
          <QuestionNavigation 
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentIndex}
            answeredQuestions={answeredSet}
            onQuestionSelect={handleQuestionSelect}
            onSubmit={handleSubmit}
          />
        </div>

      </div>
    </div>
  );
};

export default CoreTest;
