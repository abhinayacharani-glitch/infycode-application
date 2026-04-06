import React from 'react';

const BookOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const Header = ({ currentSection, onSectionChange }) => {
  const sections = ['Aptitude', 'Reasoning', 'Communication'];

  return (
    <header className="assessment-header">
      <div className="header-sections">
        {sections.map(sec => (
          <button 
            key={sec}
            className={`section-tab-btn ${currentSection === sec ? 'active' : ''}`}
            onClick={() => onSectionChange(sec)}
          >
            {sec}
          </button>
        ))}
      </div>
      <div className="header-logo">
        <BookOpenIcon />
        <span>Exam Portal</span>
      </div>
    </header>
  );
};

export default Header;
