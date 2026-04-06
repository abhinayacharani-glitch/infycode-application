import React from 'react';
import './QuestionNavigation.css';

const QuestionNavigation = ({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  onQuestionSelect,
  onSubmit
}) => {
  const questionsList = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div className="nav-panel">
      <h3 className="nav-title">Question Palette</h3>
      
      <div className="nav-grid">
        {questionsList.map((qIndex) => {
          const isCurrent = qIndex === currentQuestionIndex;
          const isAnswered = answeredQuestions.has(qIndex);
          
          let statusClass = 'nav-item-unanswered';
          if (isCurrent) statusClass = 'nav-item-current';
          else if (isAnswered) statusClass = 'nav-item-answered';
          
          return (
            <button
              key={qIndex}
              className={`nav-item ${statusClass}`}
              onClick={() => onQuestionSelect(qIndex)}
            >
              {qIndex + 1}
            </button>
          );
        })}
      </div>
      
      <div className="nav-legend">
        <div className="legend-item">
          <span className="legend-box nav-item-current"></span> Current
        </div>
        <div className="legend-item">
          <span className="legend-box nav-item-answered"></span> Answered
        </div>
        <div className="legend-item">
          <span className="legend-box nav-item-unanswered"></span> Unanswered
        </div>
      </div>
      
      <div className="nav-footer">
        <button className="btn-final-submit" onClick={onSubmit}>
          Final Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionNavigation;
