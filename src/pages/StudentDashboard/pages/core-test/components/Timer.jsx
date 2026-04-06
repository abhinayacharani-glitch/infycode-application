import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import './Timer.css';

const Timer = ({ onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes total

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const isWarning = timeLeft <= 10;

  return (
    <div className={`timer-container ${isWarning ? 'timer-warning' : ''}`}>
      <Clock size={20} className="timer-icon" />
      <span className="timer-text">Time Left: {formatTime(timeLeft)}</span>
    </div>
  );
};

export default Timer;
