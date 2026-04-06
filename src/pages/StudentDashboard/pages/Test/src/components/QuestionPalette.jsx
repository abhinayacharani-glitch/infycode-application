import React from 'react';

const QuestionPalette = ({ 
  totalQuestions, 
  answers, 
  currentIndex, 
  onNavigate, 
  onSubmit 
}) => {
  // Generate array of 1..15
  const questionsList = Array.from({ length: totalQuestions }, (_, i) => i + 1);

  const getStatusClass = (index) => {
    // index is 0-based
    if (index === currentIndex) return 'status-current'; // Blue
    if (answers[index + 1]) return 'status-answered'; // Green
    return 'status-unanswered'; // Orange
  };

  return (
    <div className="palette-container">
      <h3 className="palette-title">Question Palette</h3>
      
      <div className="palette-legend">
        <div className="legend-item"><span className="box status-answered"></span> Answered</div>
        <div className="legend-item"><span className="box status-unanswered"></span> Unanswered</div>
        <div className="legend-item"><span className="box status-current"></span> Current</div>
      </div>

      <div className="palette-grid">
        {questionsList.map((qNum, index) => (
          <div 
            key={qNum} 
            className={`grid-box ${getStatusClass(index)}`}
            onClick={() => onNavigate(index)}
          >
            {qNum}
          </div>
        ))}
      </div>

      <div className="palette-footer">
        <button className="btn btn-submit" onClick={onSubmit}>
          Final Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionPalette;
