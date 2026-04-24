import React, { useState } from 'react';
import Header from './Header';
import Timer from './Timer';
import Question from './Question';
import QuestionPalette from './QuestionPalette';
import { questions } from '../data/questions';
import { saveStudentTestResults } from '../../../../../../services/api';

const Assessment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: 'selected option' }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

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

  const calculateScores = () => {
    const scores = { aptitude: 0, reasoning: 0, communication: 0 };
    questions.forEach(q => {
      if (answers[q.id]) {
        if (q.section === 'Aptitude') scores.aptitude += 1;
        else if (q.section === 'Reasoning') scores.reasoning += 1;
        else if (q.section === 'Communication') scores.communication += 1;
      }
    });
    return scores;
  };

  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to completely submit the assessment?')) {
      try {
        setSaving(true);
        const scores = calculateScores();
        await saveStudentTestResults('foundational', scores);
        setIsSubmitted(true);
        localStorage.setItem('foundationalTestCompleted', 'true');
      } catch (err) {
        console.error("Foundational Test Submit Error:", err);
        alert("Failed to save results: " + err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  const handleTimeUp = async () => {
    alert('Time is up! Your assessment will be auto-submitted.');
    try {
      setSaving(true);
      const scores = calculateScores();
      await saveStudentTestResults('foundational', scores);
      setIsSubmitted(true);
      localStorage.setItem('foundationalTestCompleted', 'true');
    } catch (err) {
      console.error("Auto-submit failed", err);
      setIsSubmitted(true);
      localStorage.setItem('foundationalTestCompleted', 'true');
    } finally {
      setSaving(false);
    }
  };

  if (isSubmitted) {
    const scores = calculateScores();
    const totalAttempted = Object.keys(answers).length;

    return (
      <>
        <Header currentSection={currentSection} onSectionChange={handleSectionChange} />
        <div className="main-layout" style={{ justifyContent: 'center', alignItems: 'center', padding: '60px 20px' }}>
          <div className="card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
            <h2 style={{ fontSize: '28px', color: '#1f2937', marginBottom: '10px' }}>Assessment Submitted!</h2>
            <p style={{ color: '#6b7280', marginBottom: '30px' }}>Thank you for completing the foundational assessment. Here are your results:</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '30px' }}>
              <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '5px' }}>Aptitude</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{scores.aptitude}</div>
              </div>
              <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '5px' }}>Reasoning</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{scores.reasoning}</div>
              </div>
              <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '12px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', marginBottom: '5px' }}>Comm.</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>{scores.communication}</div>
              </div>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Overall Phase 1 Score</div>
              <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{scores.aptitude + scores.reasoning + scores.communication}</div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '16px' }}
              onClick={() => window.location.href = '/student-dashboard'}
            >
              Back to Dashboard
            </button>
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
