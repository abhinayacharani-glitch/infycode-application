import React, { useState } from 'react';
import Header from './Header';
import Timer from './Timer';
import Question from './Question';
import QuestionPalette from './QuestionPalette';
import { questions } from '../data/questions';

const Assessment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'selected option' }
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const currentSection = currentQuestion?.section;
  
  const handleSectionChange = (sectionName) => {
    const index = questions.findIndex(q => q.section === sectionName);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  };

  const handleOptionSelect = (option) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: option
    }));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSaveNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleNavigate = (index) => {
    setCurrentIndex(index);
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to completely submit the assessment?')) {
      setIsSubmitted(true);
      localStorage.setItem('foundationalTestCompleted', 'true');
    }
  };

  const handleTimeUp = () => {
    alert('Time is up! Your assessment will be auto-submitted.');
    setIsSubmitted(true);
    localStorage.setItem('foundationalTestCompleted', 'true');
  };

  if (isSubmitted) {
    const score = Object.keys(answers).length;
    return (
      <>
        <Header currentSection={currentSection} onSectionChange={() => {}} />
        <div className="main-layout" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div className="left-section" style={{ flex: 'none', width: '500px', textAlign: 'center' }}>
            <h2>Assessment Submitted!</h2>
            <p style={{ marginTop: '20px', fontSize: '1.2rem' }}>
              You attempted {score} out of {totalQuestions} questions.
            </p>
            <div style={{ marginTop: '30px', color: 'var(--success-green)' }}>
              Thank you for completing the Assessment.
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header currentSection={currentSection} onSectionChange={handleSectionChange} />
      <div className="main-layout">
        {/* Left Section - Main Content */}
        <div className="left-section">
          <div className="section-header-wrapper">
            <h2 className="section-title">Section: {currentQuestion.section}</h2>
            <Timer onTimeUp={handleTimeUp} />
          </div>
          
          <Question 
            question={currentQuestion}
            selectedOption={answers[currentQuestion.id]}
            onOptionSelect={handleOptionSelect}
            onPrevious={handlePrevious}
            onSaveNext={handleSaveNext}
            isFirst={currentIndex === 0}
            isLast={currentIndex === totalQuestions - 1}
          />
        </div>

        {/* Right Section - Question Palette */}
        <div className="right-section">
          <QuestionPalette 
            totalQuestions={totalQuestions}
            answers={answers}
            currentIndex={currentIndex}
            onNavigate={handleNavigate}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
};

export default Assessment;
