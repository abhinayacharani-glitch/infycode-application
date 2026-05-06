import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCourseContext } from "../../context/CourseContext";
import { motion } from "framer-motion";
import { Search, Filter, Star, Clock, Users, ArrowRight, Eye, Calendar, User as UserIcon } from "lucide-react";
import { getCourseImage } from "../../utils/courseUtils";
import "./Courses.css";
import bgImage from "../../assets/course/bg.jpg";
const CATEGORIES = ["All", "Web Dev", "Python", "Java", "AI & Data", "Cybersecurity", "Cloud", "Mobile Dev"];

// Legacy export kept to prevent import errors in other components migrating to dynamic data
export const ALL_COURSES = [];


const statusColors = {
  "BEST SELLER": { bg: "rgba(249, 115, 22, 0.12)", color: "#f97316" },
  "TRENDING": { bg: "rgba(16, 185, 129, 0.12)", color: "#10b981" },
  "POPULAR": { bg: "rgba(99, 102, 241, 0.12)", color: "#6366f1" },
  "HOT": { bg: "rgba(220, 38, 38, 0.12)", color: "#dc2626" },
  "NEW": { bg: "rgba(14, 165, 233, 0.12)", color: "#0ea5e9" },
  "ADVANCED": { bg: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6" },
  "PRO": { bg: "rgba(13, 148, 136, 0.12)", color: "#0d9488" },
  "OFFICIAL": { bg: "rgba(251, 191, 36, 0.12)", color: "#fbbf24" },
  "ENTERPRISE": { bg: "rgba(221, 0, 49, 0.12)", color: "#dd0031" },
  "MODERN": { bg: "rgba(14, 165, 233, 0.12)", color: "#0ea5e9" },
  "MOBILE": { bg: "rgba(2, 86, 155, 0.12)", color: "#02569b" },
  "COMPLETE": { bg: "rgba(55, 118, 171, 0.12)", color: "#3776ab" },
  "FOUNDATION": { bg: "rgba(79, 70, 229, 0.12)", color: "#4f46e5" },
  "PLACEMENT": { bg: "rgba(248, 152, 29, 0.12)", color: "#f8981d" },
  "ESSENTIAL": { bg: "rgba(99, 102, 241, 0.12)", color: "#6366f1" },
  "FUTURE": { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" },
  "CREATIVE": { bg: "rgba(139, 92, 246, 0.12)", color: "#8b5cf6" },
  "EFFICIENT": { bg: "rgba(16, 185, 129, 0.12)", color: "#10b981" },
  "SUCCESS": { bg: "rgba(244, 63, 94, 0.12)", color: "#f43f5e" },
};

const Courses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { publishedCourses } = useCourseContext();

  const handleEnroll = () => {
    const userStr = localStorage.getItem("loggedUser");
    let userObj = null;
    try {
      userObj = userStr ? JSON.parse(userStr) : null;
    } catch {
      console.error("Session data corrupted, redirecting to login.");
    }

    if (userObj && userObj.role === "Student") {
      navigate("/student-dashboard/courses");
    } else {
      console.log("Not logged in or corrupted session, navigating to login.");
      navigate("/login", { state: { redirect: "/student-dashboard/courses" } });
    }
  };

  const filtered = useMemo(() => {
    return publishedCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [publishedCourses, searchTerm, activeCategory]);

  return (
    <div className="courses-page-modern" id="courses">
      {/* Header with Search */}
      <div
        className="courses-hero"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <div className="container-custom">
          <motion.div
            className="courses-hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="section-title">Master New Tech Skills</h1>
            <p className="section-subtitle">
              Browse our comprehensive collection of professional courses designed for your career growth.
            </p>

            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search for courses (e.g. React, Python...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const lower = searchTerm.toLowerCase();

                    if (
                      lower.includes("web") ||
                      lower.includes("mern") ||
                      lower.includes("mernstack") ||
                      lower.includes("react") ||
                      lower.includes("frontend") ||
                      lower.includes("backend") ||
                      lower.includes("fullstack")
                    ) {
                      setActiveCategory("Web Dev");
                    }
                    else if (
                      lower.includes("python") ||
                      lower.includes("django") ||
                      lower.includes("flask")
                    ) {
                      setActiveCategory("Python");
                    }
                    else if (
                      lower.includes("java") ||
                      lower.includes("spring")
                    ) {
                      setActiveCategory("Java");
                    }
                    else if (
                      lower.includes("ai") ||
                      lower.includes("data") ||
                      lower.includes("machine") ||
                      lower.includes("ml") ||
                      lower.includes("deep")
                    ) {
                      setActiveCategory("AI & Data");
                    }
                    else if (
                      lower.includes("cloud") ||
                      lower.includes("aws") ||
                      lower.includes("azure")
                    ) {
                      setActiveCategory("Cloud");
                    }
                    else if (
                      lower.includes("cyber") ||
                      lower.includes("security") ||
                      lower.includes("hacking")
                    ) {
                      setActiveCategory("Cybersecurity");
                    }
                    else {
                      setActiveCategory("All");
                    }

                    // scroll to courses
                    const section = document.querySelector(".catalog-grid");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }}
              />
              <div className="search-divider" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom">
        {/* Categories Bar */}
        <div className="categories-bar-wrap">
          <div className="categories-scroll">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="catalog-grid">
          {filtered.length > 0 ? (
            filtered.map((course, i) => {
              const sc = statusColors[course.badge] || statusColors["NEW"];

              // Fallback dates for specific cards as requested
              let displayDate = course.startDate;
              const lowerTitle = course.title.toLowerCase();
              if (lowerTitle.includes("aptitude")) {
                displayDate = "May 5, 2026";
              } else if (lowerTitle.includes("introduction to ai")) {
                displayDate = "May 10, 2026";
              }

              return (
                <motion.div
                  key={course.title}
                  className="course-card-modern"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{ y: -10 }}
                >
                  {/* Image Banner */}
                  <div className="card-img-banner">
                    <img src={getCourseImage(course)} alt={course.title} />
                  </div>

                  <div className="card-content-modern">
                    <h3 className="card-title-modern">{course.title}</h3>

                    {/* Footer */}
                    <div className="card-footer-modern">
                      <div className="footer-info-left">
                        <div className="info-item">
                          <UserIcon size={14} />
                          <span>{course.trainer}</span>
                        </div>
                        <div className="info-item">
                          <Calendar size={14} />
                          <span>{displayDate || "TBA"}</span>
                        </div>
                        <div className="info-item duration-highlight">
                          <Clock size={14} />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      <div className="details-action-wrapper">
                        <button
                          className="btn-view-details"
                          onClick={() => navigate(`/course-details/${course.courseId}`)}
                          title="View Course Details"
                        >
                          <Eye size={20} />
                        </button>
                        <span className="action-label">View Course</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="no-results">
              <h3>No courses found matching your search.</h3>
              <p>Try searching for something else or browse categories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

