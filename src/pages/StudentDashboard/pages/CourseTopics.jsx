import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, BookOpen, Star, Zap, ArrowLeft, Target, CheckCircle, Calendar, Briefcase, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CourseTopics.css';

const CourseTopics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseTitle, category } = location.state || { courseTitle: "Course Curriculum", category: "Technology" };

  const topicsData = [
    {
      level: "Beginner",
      icon: <BookOpen className="level-icon beginner" />,
      description: "Foundational concepts and core principles to get you started.",
      topics: [
        "Introduction and Environment Setup",
        "Fundamental Syntax and Logic",
        "Core Architecture Overview",
        "First Practical Application",
        "Best Practices for Beginners"
      ]
    },
    {
      level: "Intermediate",
      icon: <Zap className="level-icon intermediate" />,
      description: "Deep dive into complex patterns and professional workflows.",
      topics: [
        "Advanced State Management",
        "API Integration and Data Flow",
        "Performance Optimization Basics",
        "Testing and Debugging Strategies",
        "Component Reusability Patterns"
      ]
    },
    {
      level: "Advanced",
      icon: <Star className="level-icon advanced" />,
      description: "Mastering the ecosystem and expert-level optimizations.",
      topics: [
        "Enterprise System Architecture",
        "Scalability and Security",
        "Custom Hooks and Utilities",
        "Server-Side Rendering (SSR)",
        "Deployment and CI/CD Pipelines"
      ]
    }
  ];

  const overview = "This course is designed to take you from a novice to an expert, equipping you with practical skills and deep theoretical knowledge required to excel in the industry. You will build real-world applications and learn best practices used by top professionals.";

  const objectives = [
    "Master the core fundamentals and advanced concepts.",
    "Develop robust, scalable, and secure applications.",
    "Implement best practices for performance optimization.",
    "Gain proficiency in modern tools and frameworks."
  ];

  const outcomes = [
    "Build a production-ready portfolio.",
    "Crack technical interviews with confidence.",
    "Understand enterprise-level system architectures.",
    "Collaborate effectively using agile methodologies."
  ];

  const syllabus = [
    { week: "Week 1", title: "Introduction & Setup", content: "Environment configuration, basic syntax, and first steps." },
    { week: "Week 2", title: "Core Fundamentals", content: "Data structures, control flows, and logic building." },
    { week: "Week 3", title: "Advanced Functions", content: "Higher-order functions, closures, and functional programming." },
    { week: "Week 4", title: "Object-Oriented Programming", content: "Classes, inheritance, and design patterns." },
    { week: "Week 5", title: "Asynchronous Programming", content: "Promises, async/await, and event loops." },
    { week: "Week 6", title: "API Integration", content: "RESTful APIs, data fetching, and error handling." },
    { week: "Week 7", title: "State Management", content: "Handling complex states and data flow architectures." },
    { week: "Week 8", title: "Database Foundations", content: "SQL/NoSQL basics, querying, and data modeling." },
    { week: "Week 9", title: "Backend Integration", content: "Connecting services, authentication, and security." },
    { week: "Week 10", title: "Performance & Testing", content: "Unit testing, optimization techniques, and profiling." },
    { week: "Week 11", title: "Deployment & CI/CD", content: "Hosting, continuous integration, and standard workflows." },
    { week: "Week 12", title: "Final Capstone Preparation", content: "Project planning, architecture review, and execution." }
  ];

  const capstoneProjects = [
    { title: "E-Commerce Platform", desc: "A full-scale online store with payment gateway integration." },
    { title: "Real-time Chat Application", desc: "A scalable messaging app using WebSockets." },
    { title: "Data Analytics Dashboard", desc: "An interactive dashboard visualizing complex datasets." }
  ];

  return (
    <div className="ct-viewport">
      <motion.button 
        className="ct-back-btn"
        onClick={() => navigate(-1)}
        whileHover={{ x: -5 }}
      >
        <ArrowLeft size={18} /> Back to Courses
      </motion.button>

      <motion.div 
        className="ct-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="ct-category-tag">{category}</span>
        <h1 className="ct-main-title">{courseTitle}</h1>
        <p className="ct-main-subtitle">A comprehensive breakdown of the curriculum from foundations to mastery.</p>
      </motion.div>

      <div className="ct-topics-grid">
        {topicsData.map((section, idx) => (
          <motion.div 
            key={section.level}
            className="ct-level-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
          >
            <div className="ct-level-header">
              <div className="ct-icon-box">{section.icon}</div>
              <div>
                <h2 className="ct-level-title">{section.level} Topics</h2>
                <p className="ct-level-desc">{section.description}</p>
              </div>
            </div>

            <ul className="ct-topic-menu">
              {section.topics.map((topic, i) => (
                <motion.li 
                  key={i}
                  className="ct-topic-item"
                  whileHover={{ x: 8, color: "#2563eb" }}
                >
                  <ChevronRight size={16} className="ct-item-arrow" />
                  <span>{topic}</span>
                </motion.li>
              ))}
            </ul>

            <button className="ct-enroll-btn">Unlock {section.level} Level</button>
          </motion.div>
        ))}
      </div>

      <div className="ct-detailed-info">
        {/* Course Overview & Objectives */}
        <div className="ct-info-row">
          <motion.div className="ct-info-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="ct-card-header">
              <FileText className="ct-hdr-icon" />
              <h3>Course Overview</h3>
            </div>
            <p className="ct-overview-text">{overview}</p>
          </motion.div>

          <motion.div className="ct-info-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="ct-card-header">
              <Target className="ct-hdr-icon" />
              <h3>Objectives</h3>
            </div>
            <ul className="ct-list">
              {objectives.map((obj, i) => (
                <li key={i}><ChevronRight size={16} className="ct-list-arrow"/> {obj}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="ct-info-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="ct-card-header">
              <CheckCircle className="ct-hdr-icon" />
              <h3>Learning Outcomes</h3>
            </div>
            <ul className="ct-list">
              {outcomes.map((out, i) => (
                 <li key={i}><ChevronRight size={16} className="ct-list-arrow"/> {out}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Syllabus / Modules */}
        <motion.div className="ct-syllabus-section" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="ct-section-title">
            <Calendar className="ct-section-icon" />
            <h2>12-Week Syllabus Map</h2>
          </div>
          <div className="ct-syllabus-grid">
            {syllabus.map((mod, i) => (
              <div key={i} className="ct-syllabus-card">
                <div className="ct-week-badge">{mod.week}</div>
                <h4>{mod.title}</h4>
                <p>{mod.content}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Capstone Projects */}
        <motion.div className="ct-capstone-section" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="ct-section-title">
            <Briefcase className="ct-section-icon" />
            <h2>Real-Time Capstone Projects</h2>
          </div>
          <div className="ct-capstone-grid">
            {capstoneProjects.map((proj, i) => (
              <div key={i} className="ct-capstone-card">
                <div className="ct-capstone-icon"><Star size={24} /></div>
                <div>
                  <h4>{proj.title}</h4>
                  <p>{proj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseTopics;
