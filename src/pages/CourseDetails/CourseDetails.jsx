import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ALL_COURSES } from "../../components/Courses/Courses";
import { ArrowLeft, Clock, Users, Star, BookOpen, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
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

const SUGGESTIONS_DB = {
  "Java": [
    "Advanced Microservices Architecture with Spring Boot",
    "Java Performance Tuning & Memory Management",
    "Enterprise Messaging Systems (Kafka/RabbitMQ)",
    "Building Scalable REST APIs with JAX-RS",
    "Cloud-Native Java Development with Quarkus"
  ],
  "Web Dev": [
    "Mastering Modern Frontend Frameworks (React/Next.js)",
    "Backend System Design & Scalable Architectures",
    "Advanced CSS & Responsive Design Masterclass",
    "Full-Stack Security & Authentication Patterns",
    "PWA (Progressive Web Apps) & Offline Capabilities"
  ],
  "Python": [
    "Data Science & Statistical Modeling with Python",
    "Automation & Scripting for DevOps & Cloud",
    "Natural Language Processing (NLP) Fundamentals",
    "Building Robust Web APIs with FastAPI",
    "Quantitative Analysis & Financial Modeling"
  ],
  "AI & Data": [
    "Deep Learning Architectures & Neural Networks",
    "Big Data Processing with Spark & Hadoop",
    "MLOps: Deploying & Monitoring ML Models",
    "Computer Vision & Image Processing Techniques",
    "Ethics & Fairness in AI Systems"
  ],
  "Cloud": [
    "Multi-Cloud Strategy (AWS, Azure, GCP)",
    "Serverless Architecture & Lambda Functions",
    "Kubernetes & Docker Container Orchestration",
    "Cloud Infrastructure as Code (Terraform/CDK)",
    "Disaster Recovery & High Availability Design"
  ],
  "Cybersecurity": [
    "Penetration Testing & Vulnerability Assessment",
    "Network Security & Intrusion Detection Systems",
    "Incident Response & Digital Forensics",
    "Cloud Security Posture Management (CSPM)",
    "Identity & Access Management (IAM) Strategy"
  ]
};

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [openModules, setOpenModules] = useState([]); // All modules closed by default

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const course = ALL_COURSES.find((c) => c.courseId === id);

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

  // Only two tabs allowed
  const tabs = ["Overview", "Curriculum"];

  // Calculate specific syllabus based on category
  const courseSyllabus = SYLLABUS_DB[course.category] || DEFAULT_SYLLABUS;

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
              <span className="cd-stat"><Users size={16} /> {course.students} Enrolled</span>
              <span className="cd-stat"><BookOpen size={16} /> Comprehensive</span>
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
            <img src={course.image} alt={course.title} />
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

                  <h4>Key Benefits</h4>
                  <p>
                    By completing this program, you will not only receive a recognized certificate of completion, but you will also walk away with a portfolio of real-world projects that you can showcase to employers. Our expert-led approach ensures that every hour you spend learning directly translates into applied practical ability.
                  </p>
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

        {/* Related Learning Suggestions */}
        <RelatedCourses currentCourse={course} />

      </div>
    </div>
  );
};

/* ---------- Related Courses Component (Bullet Points) ---------- */
const RelatedCourses = ({ currentCourse }) => {
  // Get suggestions based on category from SUGGESTIONS_DB
  const points = SUGGESTIONS_DB[currentCourse.category] || [
    "Advanced Project Implementation & Case Studies",
    "Industry Standard Best Practices & Design Patterns",
    "Emerging Trends & Future Tech in this Domain",
    "Career Guidance & Portfolio Building Strategies",
    "Community Collaboration & Open Source Contribution"
  ];

  return (
    <div className="cd-related-bullet-section">
      <h2 className="cd-section-title">Related Learning Suggestions</h2>
      <ul className="cd-related-list">
        {points.map((point, index) => (
          <li key={index} className="cd-related-item">
            <div className="cd-related-point">
              <CheckCircle size={16} className="cd-bullet-icon" />
              <span>{point}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseDetailsPage;
