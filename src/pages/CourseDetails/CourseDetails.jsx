import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ALL_COURSES } from "../../components/Courses/Courses";
import { useCourseContext } from "../../context/CourseContext";
import { ArrowLeft, Clock, Users, Star, BookOpen, ChevronDown, ChevronUp, CheckCircle, Eye, Calendar, User as UserIcon, Download } from "lucide-react";
import jsPDF from 'jspdf';
import "../../components/Courses/Courses.css";
import "./CourseDetailsPage.css";

const SYLLABUS_DB = {
  "Java": [
    {
      id: 1, title: "Core Java", topics: [
        { main: "Introduction & Essentials", subtopics: ["JVM Architecture & Data Types", "Operators & Control Flow"] },
        { main: "Object-Oriented Programming", subtopics: ["Classes, Objects, Methods", "Inheritance, Polymorphism", "Abstraction, Encapsulation"] }
      ]
    },
    {
      id: 2, title: "ADV.JAVA", topics: [
        {
          main: "JDBC (Java Database Connectivity)", subtopics: [
            "Introduction to JDBC",
            "Establishing Connection to Database",
            "Statement",
            "PreparedStatement",
            "CallableStatement",
            "ResultSet Interface & Metadata",
            "Batch Updates",
            "Transaction Management"
          ]
        },
        {
          main: "Servlet", subtopics: [
            "Servlet Lifecycle",
            "Request & Response Interfaces",
            "Session Tracking"
          ]
        },
        { main: "JSP", subtopics: ["JSP Architecture & Lifecycle", "Scripting Elements & Directives", "JSTL & Custom Tags"] }
      ]
    },
    { id: 3, title: "Oracle", topics: [{ main: "Database Management", subtopics: ["SQL Fundamentals", "Joins & Subqueries", "PL/SQL Basics"] }] },
    { id: 4, title: "HTML", topics: [{ main: "Structure & Semantics", subtopics: ["HTML5 Forms & Inputs", "Media Elements"] }] },
    { id: 5, title: "CSS", topics: [{ main: "Styling & Layouts", subtopics: ["CSS3 Properties", "Flexbox & Grid Layouts"] }] },
    { id: 6, title: "JavaScript", topics: [{ main: "Behavior & Logic", subtopics: ["ES6+ Features", "DOM Manipulation", "Promises & Async/Await"] }] },
    { id: 7, title: "BootStrap", topics: [{ main: "Responsive Design", subtopics: ["Grid System", "Components & Utilities"] }] }
  ],
  "Web Dev": [
    {
      id: 1, title: "Frontend Fundamentals", topics: [
        { main: "HTML5 & CSS3 Masterclass", subtopics: ["Semantic HTML", "Advanced CSS Selectors", "Flexbox & CSS Grid"] },
        { main: "JavaScript Core (ES6+)", subtopics: ["Variables, Scopes & Closures", "Asynchronous JavaScript (Promises, Async/Await)", "DOM Manipulation"] }
      ]
    },
    {
      id: 2, title: "React.js Framework", topics: [
        { main: "React Essentials", subtopics: ["Components, Props, & State", "React Hooks (useState, useEffect)", "Context API"] },
        { main: "Advanced React", subtopics: ["Redux Toolkit Integration", "React Router Navigation", "Performance Optimization"] }
      ]
    },
    {
      id: 3, title: "Backend Development", topics: [
        { main: "Node.js & Express.js", subtopics: ["RESTful API Creation", "Middleware & Error Handling", "Authentication & JWT"] },
        { main: "Database Integration", subtopics: ["MongoDB & Mongoose", "SQL Basics (PostgreSQL)"] }
      ]
    }
  ],
  "Python": [
    {
      id: 1, title: "Python Core", topics: [
        { main: "Syntax & Data Structures", subtopics: ["Variables & Operators", "Lists, Tuples, Dictionaries, Sets", "Control Flow (Loops & Conditionals)"] },
        { main: "Functions & OOP", subtopics: ["Decorators & Generators", "Classes & Object-Oriented Principles"] }
      ]
    },
    {
      id: 2, title: "Advanced Python", topics: [
        { main: "File & Error Handling", subtopics: ["Reading & Writing Files (CSV, JSON)", "Exception Handling (Try, Except)"] },
        { main: "Modules & APIs", subtopics: ["Using Requests library", "Regular Expressions", "Multithreading Basics"] }
      ]
    },
    {
      id: 3, title: "Django Web Framework", topics: [
        { main: "Building APIs", subtopics: ["Models & ORM", "Views & Templates", "Django REST Framework (DRF)"] }
      ]
    }
  ],
  "AI & Data": [
    {
      id: 1, title: "Data Analysis & Manipulation", topics: [
        { main: "Python for Data Science", subtopics: ["NumPy Arrays & Mathematical Operations", "Pandas DataFrames", "Data Cleaning Techniques"] }
      ]
    },
    {
      id: 2, title: "Machine Learning Elements", topics: [
        { main: "Supervised Learning", subtopics: ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Model Evaluation & Metrics"] },
        { main: "Unsupervised Learning", subtopics: ["K-Means Clustering", "PCA (Principal Component Analysis)"] }
      ]
    },
    {
      id: 3, title: "Deep Learning Foundations", topics: [
        { main: "Neural Networks", subtopics: ["Perceptrons & Backpropagation", "Building Models with TensorFlow & Keras"] }
      ]
    }
  ]
};

const DEFAULT_SYLLABUS = [
  { id: 1, title: "Module 1: Introduction", topics: [{ main: "Course Fundamentals", subtopics: ["Overview of Concepts", "Environment Setup"] }] },
  { id: 2, title: "Module 2: Core Architecture", topics: [{ main: "Deep Dive", subtopics: ["Main Architecture", "System Design Patterns"] }] },
  { id: 3, title: "Module 3: Advanced Concepts", topics: [{ main: "Masterclass Topics", subtopics: ["Advanced Implementations", "Real-world Error Handling"] }] },

];



const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [openModules, setOpenModules] = useState([]); // All modules closed by default
  const { publishedCourses } = useCourseContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const combinedCourses = [...publishedCourses, ...ALL_COURSES];
  const course = combinedCourses.find((c) => c.courseId === id);

  if (!course) {
    return (
      <div className="cd-not-found">
        <h2>Course Not Found</h2>
        <button onClick={() => navigate(-1)} className="cd-back-btn">Go Back</button>
      </div>
    );
  }

  const toggleModule = (modId) => {
    if (openModules.includes(modId)) {
      setOpenModules(openModules.filter(id => id !== modId));
    } else {
      setOpenModules([...openModules, modId]);
    }
  };

  const handleEnroll = () => {
    const userStr = localStorage.getItem("loggedUser");
    let userObj = null;
    try {
      userObj = userStr ? JSON.parse(userStr) : null;
    } catch {
      console.error("Session data corrupted.");
    }

    if (userObj && userObj.role === "Student") {
      navigate("/student-dashboard/courses");
    } else {
      navigate("/login", { state: { redirect: "/student-dashboard/courses" } });
    }
  };

  const handleDownloadCurriculum = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233); // #0ea5e9
    doc.text(course.title, 20, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(`Instructor: ${course.trainer}`, 20, yPos);
    yPos += 10;
    doc.text(`Duration: ${course.duration}`, 20, yPos);
    yPos += 20;

    // Curriculum Header
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // #0f172a
    doc.text("Course Curriculum", 20, yPos);
    yPos += 15;

    // Syllabus
    courseSyllabus.forEach((mod) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(mod.title, 20, yPos);
      yPos += 8;

      mod.topics.forEach((topic) => {
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`• ${topic.main}`, 25, yPos);
        yPos += 6;

        if (topic.subtopics) {
          topic.subtopics.forEach((sub) => {
            doc.setFontSize(10);
            doc.text(`  - ${sub}`, 30, yPos);
            yPos += 5;
            
            if (yPos > 280) {
              doc.addPage();
              yPos = 20;
            }
          });
        }
        yPos += 4;
      });
      yPos += 10;
    });

    doc.save(`${course.title}_Curriculum.pdf`);
  };

  // Only two tabs allowed
  const tabs = ["Overview", "Curriculum"];

  // Calculate specific syllabus based on category
  let courseSyllabus = SYLLABUS_DB[course.category] || DEFAULT_SYLLABUS;

  // Handle dynamically parsed curriculum from Firebase published courses
  if (course.curriculum) {
    try {
      // The curriculum format from Firebase is e.g.:
      // [Module Name]
      // Topic 1
      // Topic 2
      const blocks = course.curriculum.split('\n\n').filter(b => b.trim());
      if (blocks.length > 0) {
        courseSyllabus = blocks.map((block, idx) => {
          const lines = block.split('\n').filter(l => l.trim());
          const titleLine = lines[0] || '';
          const titleMatch = titleLine.match(/\[(.*?)\]/);
          const title = titleMatch ? titleMatch[1] : `Module ${idx + 1}`;
          const topics = lines.slice(1).map(t => ({ main: t, subtopics: [] }));
          return { id: idx + 1, title, topics };
        });
      }
    } catch (e) {
      console.error("Failed to parse dynamic curriculum", e);
    }
  }

  return (
    <div className="cd-page-wrapper">
      <div className="cd-container">

        {/* Back Navigation */}
        <button onClick={() => navigate(-1)} className="cd-nav-back">
          <ArrowLeft size={18} />
          <span>Back to Courses</span>
        </button>

        {/* Header Section */}
        <div className="cd-header-card">
          <div className="cd-header-info">
            <div className="cd-tags">
              <span className="cd-cat-tag" style={{ background: `${course.color}15`, color: course.color }}>
                {course.category}
              </span>
              <span className="cd-level-tag">{course.level || "Beginner to Pro"}</span>
            </div>

            <h1 className="cd-main-title">{course.title}</h1>
            <p className="cd-subtitle">Build real-world skills through interactive, hands-on learning with expert guidance.</p>

            <div className="cd-stats">
              <span className="cd-stat"><Star size={16} className="text-yellow" /> {course.rating} Rating</span>
              <span className="cd-stat"><Clock size={16} /> {course.duration}</span>
              <span className="cd-stat trainer-stat">
                <UserIcon size={16} /> 
                {course.trainer}
                <button className="cd-mini-download" onClick={handleDownloadCurriculum} title="Download Curriculum">
                  <Download size={14} />
                  <span>Download Curriculum</span>
                </button>
              </span>
            </div>

            <div className="cd-hero-actions">
              <button className="cd-hero-enroll" onClick={handleEnroll}>
                Enroll Now
              </button>
              <button className="cd-hero-pricing" title="Pricing">
                ₹
              </button>
            </div>
          </div>
          <div className="cd-header-image">
            <img src={course.image || 'https://via.placeholder.com/600x400?text=Course'} alt={course.title} />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="cd-tabs-wrapper">
          <div className="cd-tabs-container">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`cd-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="cd-content-area">

          {/* OVERVIEW TAB */}
          {activeTab === "Overview" && (
            <div className="cd-tab-panel">
              <section className="cd-section">
                <h2 className="cd-section-title">Course Overview</h2>
                <div className="cd-desc-block">
                  <p>
                    Welcome to the <strong>{course.title}</strong> program. This course is meticulously designed to take you from foundational concepts to advanced practical implementation. Whether you're looking to break into the industry, upgrade your current skillset, or shift your career trajectory, this program provides the comprehensive knowledge necessary to succeed.
                  </p>

                  <h4>Skills You Will Gain</h4>
                  <ul className="cd-skills-list">
                    <li><CheckCircle size={16} /> Complete mastery of industry-standard {course.category} tools.</li>
                    <li><CheckCircle size={16} /> Ability to architect, design, and deploy robust applications.</li>
                    <li><CheckCircle size={16} /> Strong problem-solving methodologies.</li>
                    <li><CheckCircle size={16} /> Best practices and modern workflows used by top companies.</li>
                  </ul>

                </div>
              </section>

              <section className="cd-section mt-8">
                <h2 className="cd-section-title">Description</h2>
                <div className="cd-desc-block">
                  <h4>Course Structure</h4>
                  <p>
                    The curriculum is broken down into structured, easily digestible modules. We start with core principles and gradually build up to complex, multi-layered concepts. Each week focuses on specific deliverables and practical assignments.
                  </p>

                  <h4>Learning Approach</h4>
                  <p>
                    We believe in learning by doing. While theoretical knowledge forms the base, 80% of this course is practical. You'll be writing code, executing strategies, and solving challenges exactly as you would in a real job environment.
                  </p>
                </div>
              </section>

              {/* Related Courses Section */}
              <RelatedCourses currentCourse={course} navigate={navigate} publishedCourses={publishedCourses} />
            </div>
          )}

          {/* CURRICULUM TAB */}
          {activeTab === "Curriculum" && (
            <div className="cd-tab-panel">
              <section className="cd-section">
                <h2 className="cd-section-title">Course Curriculum</h2>

                <div className="cd-accordion-container">
                  {courseSyllabus.map((mod) => {
                    const isOpen = openModules.includes(mod.id);
                    return (
                      <div key={mod.id} className={`cd-accordion-item ${isOpen ? "open" : ""}`}>
                        <div className="cd-accordion-header" onClick={() => toggleModule(mod.id)}>
                          <div className="cd-accordion-title">
                            {mod.title}
                          </div>
                          <div className="cd-accordion-icon">
                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>

                        <div className={`cd-accordion-body ${isOpen ? "expanded" : ""}`}>
                          <ul className="cd-topic-list">
                            {mod.topics.map((topicBlock, i) => (
                              <li key={i} className="cd-topic-item">
                                <span className="cd-topic-main">{topicBlock.main}</span>
                                {topicBlock.subtopics && topicBlock.subtopics.length > 0 && (
                                  <ul className="cd-subtopic-list">
                                    {topicBlock.subtopics.map((sub, j) => (
                                      <li key={j}>{sub}</li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

/* ----------  Related Courses Component (Animated Slider) ---------- */
const statusColors = {
  "BEST SELLER": { bg: "rgba(249,115,22,0.12)", color: "#f97316" },
  "TRENDING": { bg: "rgba(16,185,129,0.12)", color: "#10b981" },
  "POPULAR": { bg: "rgba(99,102,241,0.12)", color: "#6366f1" },
  "HOT": { bg: "rgba(220,38,38,0.12)", color: "#dc2626" },
  "NEW": { bg: "rgba(14,165,233,0.12)", color: "#0ea5e9" },
  "ADVANCED": { bg: "rgba(139,92,246,0.12)", color: "#8b5cf6" },
  "INTERMEDIATE": { bg: "rgba(16,185,129,0.12)", color: "#10b981" },
  "BEGINNER": { bg: "rgba(99,102,241,0.12)", color: "#6366f1" },
};

const RelatedCourses = ({ currentCourse, navigate, publishedCourses }) => {
  // Get suggestions
  const combinedCourses = [...publishedCourses, ...ALL_COURSES];

  const sameCat = combinedCourses.filter(
    (c) => c.courseId !== currentCourse.courseId && c.category === currentCourse.category
  );
  const others = combinedCourses.filter(
    (c) => c.courseId !== currentCourse.courseId && c.category !== currentCourse.category
  );
  const originalSuggestions = [...sameCat, ...others].slice(0, 8);

  // Triple the items for a seamless loop
  const suggestions = [...originalSuggestions, ...originalSuggestions, ...originalSuggestions];

  const [index, setIndex] = useState(originalSuggestions.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  if (originalSuggestions.length === 0) return null;

  const next = () => {
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    setIndex((prev) => prev - 1);
  };

  // Seamless reset logic
  useEffect(() => {
    if (index >= originalSuggestions.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(originalSuggestions.length);
      }, 600);
    } else if (index < originalSuggestions.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(originalSuggestions.length * 2 - 1);
      }, 600);
    } else {
      setIsTransitioning(true);
    }
  }, [index, originalSuggestions.length]);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(interval);
  }, [index, originalSuggestions.length]);

  return (
    <div className="cd-related-section slider-mode">
      <div className="cd-related-header">
        <h2 className="cd-related-title">Course Related Suggestions</h2>
        <p className="cd-related-sub">Explore more courses to accelerate your learning journey</p>
      </div>

      <div className="cd-slider-container">
        <button className="cd-slider-nav prev" onClick={prev}>❮</button>
        
        <div className="cd-slider-viewport">
          <div 
            className="cd-slider-track"
            style={{ 
              transform: `translateX(-${index * (100 / (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1))}%)`,
              transition: isTransitioning ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
            }}
          >
            {suggestions.map((c, i) => {
              return (
                <div 
                  key={`${c.courseId}-${i}`} 
                  className="cd-slider-item"
                  style={{ flex: `0 0 ${100 / (window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1)}%` }}
                >
                  <div className="course-card-modern">
                    <div 
                      className="card-img-banner" 
                      onClick={() => { navigate(`/course-details/${c.courseId}`); window.scrollTo(0, 0); }} 
                      style={{ cursor: "pointer" }}
                    >
                      <img src={c.image || 'https://via.placeholder.com/400x200?text=Course'} alt={c.title} />
                    </div>

                    <div className="card-content-modern">
                      <h3 
                        className="card-title-modern" 
                        onClick={() => { navigate(`/course-details/${c.courseId}`); window.scrollTo(0, 0); }} 
                        style={{ cursor: "pointer" }}
                      >
                        {c.title}
                      </h3>

                      <div className="card-footer-modern">
                        <div className="footer-info-left">
                          <div className="info-item">
                            <UserIcon size={14} />
                            <span>{c.trainer}</span>
                          </div>
                          <div className="info-item">
                            <Calendar size={14} />
                            <span>{c.startDate}</span>
                          </div>
                          <div className="info-item duration-highlight">
                            <Clock size={14} />
                            <span>{c.duration}</span>
                          </div>
                        </div>

                        <div className="details-action-wrapper">
                          <button 
                            className="btn-view-details" 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/course-details/${c.courseId}`);
                              window.scrollTo(0, 0);
                            }}
                            title="View Course Details"
                          >
                            <Eye size={20} />
                          </button>
                          <span className="action-label">View Course</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="cd-slider-nav next" onClick={next}>❯</button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
