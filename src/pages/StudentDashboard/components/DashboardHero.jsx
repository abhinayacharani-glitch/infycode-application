import React from 'react';
import { Settings } from 'lucide-react';
import "./DashboardHero.css";

const DashboardHero = () => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { fullname: "Anjali Syamala" };
    const userName = user.fullname || user.fullName || "Anjali Syamala";

    return (
        <div className="dashboard-banner">
            <div className="banner-content">
                <div className="banner-left">
                    <h2>Welcome back, {userName}! <Settings size={22} className="settings-icon" /></h2>
                    <p>
                        Showing data for <strong>all courses</strong> · 0 modules completed this month
                    </p>
                </div>
                
                <div className="banner-right">
                    <div className="banner-stat-item">
                        <span className="banner-stat-value">00</span>
                        <span className="banner-stat-label">Enrolled Courses</span>
                    </div>
                    <div className="banner-divider"></div>
                    <div className="banner-stat-item">
                        <span className="banner-stat-value">00</span>
                        <span className="banner-stat-label">Earned Certificates</span>
                    </div>
                    <div className="banner-divider"></div>
                    <div className="banner-stat-item">
                        <span className="banner-stat-value">00</span>
                        <span className="banner-stat-label">Live Classes</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHero;
