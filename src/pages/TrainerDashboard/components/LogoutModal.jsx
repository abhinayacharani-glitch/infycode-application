import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './LogoutModal.css';

const LogoutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = () => {
    // Clear any local storage/auth data if needed
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    
    // Close modal and navigate to landing page
    onClose();
    navigate('/');
  };

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="logout-icon-circle">
          <LogOut size={28} strokeWidth={2.5} />
        </div>
        <h2 className="logout-modal-title">Logout</h2>
        <p className="logout-modal-subtitle">Are you sure you want to log out?</p>
        <div className="logout-modal-button-group">
          <button className="logout-modal-cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="logout-modal-confirm-btn" onClick={handleLogout}>
            OK, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
