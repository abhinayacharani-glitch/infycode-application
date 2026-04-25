import React from 'react';
import { Settings } from 'lucide-react';
import "./DashboardHero.css";

import { motion } from 'framer-motion';

const DashboardHero = () => {
    return (
        <div className="dc-hero-card-shared">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Elevate Your Expertise</h1>
                <p>
                    Unlock professional-grade tech courses curated by industry leaders.
                </p>
            </motion.div>
        </div>
    );
};

export default DashboardHero;
