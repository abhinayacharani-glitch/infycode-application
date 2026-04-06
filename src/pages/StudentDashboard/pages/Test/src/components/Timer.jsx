import React, { useState, useEffect } from 'react';

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Timer = ({ onTimeUp }) => {
  // 15 minutes = 900 seconds
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px', 
      fontSize: '1.2rem', fontWeight: 'bold', 
      color: timeLeft < 60 ? 'var(--danger-red)' : 'var(--primary-blue)',
      padding: '10px 20px', backgroundColor: 'var(--light-blue)',
      borderRadius: '8px', width: 'fit-content',
      marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    }}>
      <ClockIcon />
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
};

export default Timer;
