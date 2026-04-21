import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Timer from './components/Timer';
import Question from './components/Question';
import QuestionNavigation from './components/QuestionNavigation';

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

  const handleSubmit = () => {
    if (window.confirm("Submit your Core Test?")) {
      setIsSubmitted(true);
    }
  };

  const handleTimeUp = () => {
    alert("Time is up! Core test auto-submitted.");
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div style={{ padding: '20px', fontFamily: '"Open Sans", sans-serif' }}>
        <Header />
        <div style={{ textAlign: 'center', marginTop: '120px' }}>
          <h2 style={{ fontSize: '2rem', color: '#0A3D91', marginBottom: '15px' }}>Core Test Submitted Successfully!</h2>
          <p style={{ fontSize: '1.2rem', color: '#333' }}>You attempted {Object.keys(answers).length} out of {totalQuestions} questions.</p>
          <button 
            onClick={() => navigate('/student-dashboard/skill-test')}
            style={{ 
              marginTop: '30px', 
              padding: '12px 25px', 
              background: '#0A3D91', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            Return to Dashboard
          </button>
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
