import React from 'react';
import { Settings } from 'lucide-react';
import "./DashboardHero.css";

const DashboardHero = () => {
    const userString = localStorage.getItem('user') || localStorage.getItem('loggedUser');
    const user = userString ? JSON.parse(userString) : { fullName: "Anjali Syamala" };
    const userName = user.fullName || user.fullname || "Anjali Syamala";

    return (
        <div className="dashboard-banner">
            <div className="banner-content">
                <div className="banner-left">
                    <h2>Welcome Back, {userName}!</h2>
                </div>
                
            </div>
        </div>
    );
};

export default DashboardHero;
