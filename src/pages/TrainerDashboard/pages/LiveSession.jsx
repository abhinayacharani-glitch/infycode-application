import React, { useState } from 'react';
import './LiveSession.css';

const VideoIllustration = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="40" width="160" height="120" rx="20" fill="#eff6ff" />
    <rect x="40" y="60" width="40" height="30" rx="8" fill="#3b82f6" fillOpacity="0.2" />
    <rect x="90" y="60" width="70" height="10" rx="5" fill="#3b82f6" fillOpacity="0.2" />
    <rect x="90" y="80" width="50" height="10" rx="5" fill="#3b82f6" fillOpacity="0.1" />
    <circle cx="100" cy="120" r="25" fill="#3b82f6" fillOpacity="0.1" />
    <path d="M95 110L115 120L95 130V110Z" fill="#3b82f6" />
    <rect x="40" y="100" width="40" height="40" rx="10" fill="#3b82f6" fillOpacity="0.05" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
  </svg>
);

const LiveSession = () => {
  const [sessionLink, setSessionLink] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    const data = {
      sessionLink,
      startTime,
      endTime
    };
    console.log('Session data saved:', data);
    alert('Live session details saved successfully!');
  };

  return (
    <div className="live-session-container">
      {/* 1. Page Header */}
      <div className="live-session-header text-center">
        <h1>Live Session Manager</h1>
        <p>Configure and manage your virtual classroom sessions</p>
      </div>

      {/* 2. Centered Card */}
      <div className="live-session-card">
        {/* Card Illustration */}
        <div className="card-illustration">
          <VideoIllustration />
        </div>

        {/* Input Fields */}
        <div className="form-group mb-4">
          <label htmlFor="meeting-link">Meeting Link</label>
          <div className="input-with-icon">
            <input
              id="meeting-link"
              type="url"
              placeholder="Paste Google Meet / Teams Link"
              value={sessionLink}
              onChange={(e) => setSessionLink(e.target.value)}
            />
            {/* Using a simple icon symbol for cleanliness */}
            <i className="link-icon">🔗</i>
          </div>
        </div>

        {/* Time Fields Grid */}
        <div className="time-grid mb-6">
          <div className="time-box">
            <label htmlFor="start-time">Start Time</label>
            <input
              id="start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="time-box">
            <label htmlFor="end-time">End Time</label>
            <input
              id="end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Action Button */}
        <button className="save-btn" onClick={handleSave}>
          <span className="save-icon">💾</span>
          Save Details
        </button>
      </div>
    </div>
  );
};

export default LiveSession;
