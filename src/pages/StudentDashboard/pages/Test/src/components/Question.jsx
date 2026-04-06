import React from 'react';

const Question = ({ 
  question, 
  selectedOption, 
  onOptionSelect, 
  onPrevious, 
  onSaveNext, 
  isFirst, 
  isLast 
}) => {
  if (!question) return null;

  return (
    <div className="question-container fade-in">
      <div className="question-header">
        <span className="section-badge">{question.section}</span>
        <h2 className="question-text">
          <span className="q-num">Q{question.id}.</span> {question.text}
        </h2>
      </div>

      <div className="options-container">
        {question.options.map((option, index) => {
          const char = String.fromCharCode(65 + index); // A, B, C, D
          const isSelected = selectedOption === option;
          return (
            <div 
              key={index}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onOptionSelect(option)}
            >
              <div className="option-char">{char}</div>
              <div className="option-text">{option}</div>
            </div>
          );
        })}
      </div>

      <div className="action-buttons">
        <button 
          className="btn btn-prev" 
          onClick={onPrevious} 
          disabled={isFirst}
        >
          Previous
        </button>
        <button 
          className="btn btn-save" 
          onClick={onSaveNext}
        >
          {isLast ? 'Save' : 'Save & Next'}
        </button>
      </div>
    </div>
  );
};

export default Question;
