import React, { useEffect } from 'react';
import { FaFingerprint } from 'react-icons/fa';
import { useNavigate } from "react-router-dom"; // ✅ added
import './Logout.css';

const Logout = () => {

  const navigate = useNavigate(); // ✅ added

  useEffect(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // ✅ replace history instead of normal redirect
    navigate("/student/login", { replace: true });

  }, [navigate]);

  return (
    <div className="logout-page">
      <div className="logout-card">
        <div className="logout-icon-box">
          <FaFingerprint size={50} />
        </div>
        <h2>Securely Logged Out</h2>
        <p>Your session has ended. Thank you for using InfyCode Dashboard.</p>

        <button 
          className="relogin-btn" 
          onClick={() => navigate("/student/login", { replace: true })} // ✅ updated
        >
          Return to Login
        </button>

      </div>
    </div>
  );
};

export default Logout;
