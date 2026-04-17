import React from 'react';
import './popup.css';
import { useNavigate } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import { HiOutlineBookOpen } from 'react-icons/hi';

const Popup = ({ onClose }) => {
  const navigate = useNavigate();

  const handleReserveNow = () => {
    onClose();
    navigate('/course-details/CID-103');
  };

  return (
    <div className="popup-overlay" onClick={(e) => {
      if (e.target.className === 'popup-overlay') onClose();
    }}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose} aria-label="Close popup">
          <IoClose />
        </button>

        <div className="popup-icon-container">
          <div className="popup-icon-circle">
            <HiOutlineBookOpen className="popup-main-icon" />
          </div>
        </div>

        <div className="popup-content">
          <h2 className="popup-title">Java Full Stack</h2>
          <p className="popup-date">Start Date: <span className="date-value">Oct 25, 2026</span></p>

          <div className="popup-badge">
            <span className="fire-emoji">🔥</span>
            <span className="badge-text">Few seats left!</span>
          </div>

          <button className="popup-action-btn" onClick={handleReserveNow}>
            Reserve Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

