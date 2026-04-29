import React, { useState, useEffect } from "react";
import { Star, Search, Eye, Calendar, User as UserIcon, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { enrollInCourse, getEnrolledCourses } from "../../../services/api";
import { ALL_COURSES as ORIGINAL_COURSES } from "../../../components/Courses/Courses";
import "./Course.css";

// Swap "Ethical Hacking & Cyber Security" and "AWS Cloud Practitioner" for dashboard UI
const ALL_COURSES = [...ORIGINAL_COURSES];

// Ensure "Java Full Stack Development" is first for Popular Courses
// And "AWS Cloud Practitioner" is in the Recommended section (index 8+)
const JavaIdx = ALL_COURSES.findIndex(c => c.title === "Java Full Stack Development");
if (JavaIdx !== -1) {
  const java = ALL_COURSES.splice(JavaIdx, 1)[0];
  ALL_COURSES.unshift(java);
}

const AWSIdx = ALL_COURSES.findIndex(c => c.title === "AWS Cloud Practitioner");
if (AWSIdx !== -1) {
  const aws = ALL_COURSES.splice(AWSIdx, 1)[0];
  // Insert at index 8 (start of Recommended section)
  ALL_COURSES.splice(8, 0, aws);
}

const PythonIdx = ALL_COURSES.findIndex(c => c.title === "Python Programming Masterclass");
if (PythonIdx !== -1) {
  const python = ALL_COURSES.splice(PythonIdx, 1)[0];
  // Insert at index 4 (start of Trending section)
  ALL_COURSES.splice(4, 0, python);
}

const CATEGORIES = ["All", "Web Dev", "Python", "Java", "AI & Data", "Cybersecurity", "Cloud"];

const CourseCardModern = ({ course, index, onNavigate, enrolledIds, onEnroll }) => {
  return (
    <motion.div
      className="course-card-modern"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -10 }}
    >
      <div className="card-img-banner">
        <img src={course.image} alt={course.title} />
      </div>

      <div className="card-content-modern">
        <h3 className="card-title-modern">{course.title}</h3>

        <div className="card-stats-modern">
          <span className="stat students-text">{course.students} students</span>
          <div className="stat stars-container">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < 4 ? "#f59e0b" : "transparent"}
                color={i < 4 ? "#f59e0b" : "#e2e8f0"}
              />
            ))}
          </div>
        </div>

        <div className="card-footer-modern">
          <div className="details-action-wrapper">
            <button 
              className="btn-view-details" 
              onClick={() => onNavigate(`/course-details/${course.courseId}`)}
            >
              <Eye size={20} />
            </button>
            <span className="action-label">Overview</span>
          </div>
          
          {enrolledIds.includes(course.courseId) ? (
            <button className="btn-enrolled" disabled>
              Enrolled
            </button>
          ) : (
            <button 
              className={`btn-join-now ${index !== 0 ? "disabled" : ""}`}
              disabled={index !== 0}
              onClick={(e) => {
                e.stopPropagation();
                onEnroll(course.courseId);
              }}
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CourseSection = ({ title, courses, onNavigate, enrolledIds, onEnroll }) => {
  if (courses.length === 0) return null;
  return (
    <div className="dc-section">
      <div className="dc-section-header">
        <h2 className="dc-section-title">{title}</h2>
      </div>
      <div className="dc-catalog-grid">
        {courses.map((course, index) => (
          <CourseCardModern 
            key={course.courseId} 
            course={course} 
            index={index} 
            onNavigate={onNavigate} 
            enrolledIds={enrolledIds}
            onEnroll={onEnroll}
          />
        ))}
      </div>
    </div>
  );
};

const CourseDiscovery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [enrolledIds, setEnrolledIds] = useState([]);

  // Initialize from localStorage on load
  useEffect(() => {
    const savedEnrolled = localStorage.getItem("student_clicked_enrollments");
    if (savedEnrolled) {
      try {
        setEnrolledIds(JSON.parse(savedEnrolled));
      } catch (err) {
        console.error("Failed to parse local enrollment state:", err);
      }
    }
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      // 1. Call backend to save enrollment
      await enrollInCourse(courseId);
      
      // 2. Update local state and persist to localStorage
      setEnrolledIds(prev => {
        const newIds = [...new Set([...prev, courseId])];
        localStorage.setItem("student_clicked_enrollments", JSON.stringify(newIds));
        return newIds;
      });
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  const handleNavigate = (path, state) => {
    navigate(path, { state });
  };

  const filtered = ALL_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const isFiltering = searchTerm !== "" || activeCategory !== "All";
  
  const sections = [
    { title: "Popular Courses", courses: ALL_COURSES.slice(0, 4) },
    { title: "Trending Courses", courses: ALL_COURSES.slice(4, 8) },
    { title: "Recommended Courses", courses: ALL_COURSES.slice(8, 12) }
  ];

  return (
    <div className="dc-main-viewport">
      <div className="dc-controls-wrapper" style={{ marginBottom: '40px' }}>
        <div className="dc-search-bar">
          <Search size={20} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search for courses (e.g. React, Java...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="dc-categories-bar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`dc-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="dc-content-sections" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {isFiltering ? (
          <CourseSection 
            title={searchTerm ? `Search Results for "${searchTerm}"` : `Filtered Courses: ${activeCategory}`} 
            courses={filtered} 
            onNavigate={handleNavigate} 
            enrolledIds={enrolledIds}
            onEnroll={handleEnroll}
          />
        ) : (
          sections.map((sec, idx) => (
            <CourseSection 
              key={idx} 
              title={sec.title} 
              courses={sec.courses} 
              onNavigate={handleNavigate} 
              enrolledIds={enrolledIds}
              onEnroll={handleEnroll}
            />
          ))
        )}

        {isFiltering && filtered.length === 0 && (
          <div className="no-results">
            <h3>No courses found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default CourseDiscovery;
