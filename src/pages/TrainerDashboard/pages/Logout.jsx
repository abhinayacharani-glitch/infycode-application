import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Logout.css';

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }, []);

    return (
        <div className="trainer-logout-page">
            <div className="logout-card">
                <div className="logout-icon-box">
                    <span>🔒</span>
                </div>
                <h2>Securely Logged Out</h2>
                <p>Your session has ended. Thank you for using the Trainer Portal.</p>
                <NavLink to="/" className="relogin-btn">
                    Return to Home
                </NavLink>
            </div>
        </div>
    );
};

export default Logout;
