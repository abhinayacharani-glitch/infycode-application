import React from 'react';
import './Question.css';

const Question = ({ 
  question, 
  questionNumber,
  selectedAnswer, 
  onAnswerSelect, 
  onPrevious, 
  onSaveAndNext,
  isFirst,
  isLast
}) => {
  return (
    <div className="question-container">
      <div className="question-header">
        <h2>Question {questionNumber}</h2>
      </div>
      
      <div className="question-body">
        <p className="question-text">{question.text}</p>
        
        <div className="options-container">
          {question.options.map((option, index) => {
            const labels = ['A', 'B', 'C', 'D'];
            const isSelected = selectedAnswer === option.id;
            
            return (
              <div 
                key={option.id} 
                className={`option-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onAnswerSelect(option.id)}
              >
                <div className="option-label">{labels[index]}</div>
                <div className="option-text">{option.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="question-footer">
        <button 
          className="btn-previous" 
          onClick={onPrevious} 
          disabled={isFirst}
        >
          Previous
        </button>
        <button 
          className="btn-save-next" 
          onClick={onSaveAndNext}
        >
          {isLast ? 'Save Answer' : 'Save & Next'}
        </button>
      </div>
    </div>
  );
};

export default Question;
