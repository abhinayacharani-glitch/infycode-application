import React from 'react';
import { Settings } from 'lucide-react';
import "./DashboardHero.css";

const DashboardHero = () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { fullname: "Anjali Shyamala" };
    const userName = user.fullname || user.fullName || "Anjali Shyamala";

    return (
        <div className="dashboard-hero">
            <div className="hero-content">
                <div className="welcome-section">
                    <h2 className="welcome-text">
                        Welcome back, {userName}! <Settings size={20} className="settings-icon" />
                    </h2>
                    <p className="status-text">
                        Showing data for <strong>all courses</strong> · 8 modules completed this month
                    </p>
                </div>
                
                <div className="stats-section">
                    <div className="stat-item">
                        <span className="stat-value">04</span>
                        <span className="stat-label">Enrolled Courses</span>
                    </div>
                    <div className="divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">12</span>
                        <span className="stat-label">Earned Certificates</span>
                    </div>
                    <div className="divider"></div>
                    <div className="stat-item">
                        <span className="stat-value">03</span>
                        <span className="stat-label">Live Classes</span>
                    </div>
                </div>
            </div>
            
            {/* Visual background circles/effects */}
            <div className="hero-circle-1"></div>
            <div className="hero-circle-2"></div>
        </div>
    );
};

export default DashboardHero;
