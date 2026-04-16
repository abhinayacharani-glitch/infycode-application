import React from 'react';
import { motion } from 'framer-motion';
import { Target, Search, BarChart3, GraduationCap, Briefcase, ChevronRight, Star } from 'lucide-react';
import './CareerRoadmap.css';

const CareerRoadmap = () => {
    const roadmapSteps = [
        {
            title: "Phase 1: Self-Discovery & Assessment",
            description: "Interact with our AI-driven assessment tools to identify your core strengths and areas of natural interest.",
            icon: <Search size={28} />,
            color: "#6C63FF",
            tags: ["Strength Analysis", "Interest Mapping"]
        },
        {
            title: "Phase 2: Expert Consultation",
            description: "Deep-dive 1-on-1 session with a senior industry mentor to translate your assessment results into a career baseline.",
            icon: <Target size={28} />,
            color: "#10B981",
            tags: ["Mentor Match", "Goal Setting"]
        },
        {
            title: "Phase 3: Skill-Level Benchmarking",
            description: "Our performance algorithms analyze your current technical state and place you in the appropriate learning track.",
            icon: <BarChart3 size={28} />,
            color: "#F59E0B",
            tags: ["Beginner", "Intermediate", "Advanced"]
        },
        {
            title: "Phase 4: Tailored Learning Path",
            description: "Your curriculum is dynamically adjusted based on your speed, comprehension, and career goals.",
            icon: <GraduationCap size={28} />,
            color: "#3B82F6",
            tags: ["Adaptive Learning", "Project-Based"]
        },
        {
            title: "Phase 5: Career Placement",
            description: "From resume building to mock interviews and job referrals with 500+ hiring partners.",
            icon: <Briefcase size={28} />,
            color: "#EF4444",
            tags: ["Resume Building", "Hiring Partners"]
        }
    ];

    return (
        <div className="roadmap-page">
            <header className="roadmap-header">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="header-badge"
                >
                    <Star size={16} fill="currentColor" />
                    Premium Career Guidance
                </motion.div>
                <h1>Your Career Direction</h1>
                <p>We don't just teach code; we build professional careers through a structured, data-driven journey.</p>
            </header>

            <div className="roadmap-container">
                <div className="vertical-line"></div>
                {roadmapSteps.map((step, index) => (
                    <motion.div 
                        key={index} 
                        className={`roadmap-item ${index % 2 === 0 ? 'left' : 'right'}`}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        <div className="roadmap-dot" style={{ backgroundColor: step.color }}>
                            {step.icon}
                        </div>
                        <div className="roadmap-content">
                            <div className="content-inner">
                                <span className="step-number" style={{ color: step.color }}>Phase 0{index + 1}</span>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                                <div className="tag-group">
                                    {step.tags.map((tag, i) => (
                                        <span key={i} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="roadmap-arrow">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <footer className="roadmap-cta">
                <h3>Ready to start your journey?</h3>
                <p>Join thousands of students who have found their path with InfyCode.</p>
                <button 
                    className="cta-btn"
                    onClick={() => window.location.href = '/student/signup'}
                >
                    Get Started Free
                </button>
            </footer>
        </div>
    );
};

export default CareerRoadmap;
