import React, { useState, useEffect } from "react";
import { Star, Search, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ALL_COURSES as ORIGINAL_COURSES } from "../../../components/Courses/Courses";
import "./Course.css";

// Swap "Ethical Hacking & Cyber Security" and "AWS Cloud Practitioner" for dashboard UI
const ALL_COURSES = [...ORIGINAL_COURSES];

const swapCourses = (title1, title2) => {
  const idx1 = ALL_COURSES.findIndex(c => c.title === title1);
  const idx2 = ALL_COURSES.findIndex(c => c.title === title2);
  if (idx1 !== -1 && idx2 !== -1) {
    const temp = ALL_COURSES[idx1];
    ALL_COURSES[idx1] = ALL_COURSES[idx2];
    ALL_COURSES[idx2] = temp;
  }
};

swapCourses("Ethical Hacking & Cyber Security", "AWS Cloud Practitioner");
swapCourses("React JS Full Stack Development", "Python Programming Masterclass");
swapCourses("Machine Learning Deep Dive", "Java Full Stack Development");

const CATEGORIES = ["All", "Web Dev", "Python", "Java", "AI & Data", "Cybersecurity", "Cloud"];

const DISABLED_COURSES = [
  "Data Science & AI",
  "Machine Learning Deep Dive",
  "Ethical Hacking & Cyber Security",
  "React JS Full Stack Development",
  "Next.js 14 Masterclass",
  "MERN Stack Development",
  "Angular Enterprise Development",
  "Flutter Mobile Apps",
  "Full Stack Python Pro"
];

const CourseCardModern = ({ course, index, onNavigate }) => {
  const loggedUserStr = localStorage.getItem("loggedUser");
  const loggedUser = loggedUserStr ? JSON.parse(loggedUserStr) : { username: "guest" };
  const userId = loggedUser.username || "guest";
  const storageKey = `enrolled_courses_${userId}`;
  
  const getEnrollments = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "[]");
    } catch {
      return [];
    }
  };
  
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const enrollments = getEnrollments();
    if (enrollments.includes(course.title)) {
      setIsEnrolled(true);
    }
  }, [course.title]);

  const handleEnroll = () => {
    const enrollments = getEnrollments();
    if (!enrollments.includes(course.title)) {
      enrollments.push(course.title);
      localStorage.setItem(storageKey, JSON.stringify(enrollments));
    }
    setIsEnrolled(true);
    alert("You have successfully enrolled in this course.");
  };

  const isDisabledCard = DISABLED_COURSES.includes(course.title);

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
          <div className="stat students-text">
            {course.students} students
          </div>
          <div className="stat stars-container">
            {[...Array(5)].map((_, idx) => (
              <Star 
                key={idx} 
                size={14} 
                fill={idx < Math.floor(course.rating) ? "#f59e0b" : "#e2e8f0"} 
                color={idx < Math.floor(course.rating) ? "#f59e0b" : "#e2e8f0"} 
                strokeWidth={0}
              />
            ))}
          </div>
        </div>

        <div className="card-footer-modern">
          <div className="footer-actions-left">
            <div className="details-action-wrapper">
              <button 
                className="btn-view-details" 
                onClick={() => onNavigate(`/course-details/${course.courseId}`)}
                title="View Course Details"
              >
                <Eye size={20} />
              </button>
              <span className="action-label">Overview</span>
            </div>
          </div>
          <button 
            className={`btn-join-now ${isEnrolled ? 'enrolled' : ''}`} 
            onClick={isDisabledCard || isEnrolled ? undefined : handleEnroll}
            disabled={isDisabledCard || isEnrolled}
            style={
              isDisabledCard 
                ? { cursor: 'not-allowed', opacity: 0.7 } 
                : isEnrolled 
                  ? { backgroundColor: '#10b981', cursor: 'default' } 
                  : {}
            }
          >
            {isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CourseSection = ({ title, courses, onNavigate }) => {
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


  const handleNavigate = (path, state) => {
    navigate(path, { state });
  };

  const filtered = ALL_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Categorize courses (if not searching)
  const isFiltering = searchTerm !== "" || activeCategory !== "All";
  
  const sections = [
    { title: "Popular Courses", courses: ALL_COURSES.slice(0, 4) },
    { title: "Trending Courses", courses: ALL_COURSES.slice(4, 8) },
    { title: "Recommended Courses", courses: ALL_COURSES.slice(8, 12) }
  ];

  return (
    <div className="dc-main-viewport">
      <div className="dc-controls-wrapper">
        <motion.div 
          className="dc-hero-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Elevate Your Expertise</h1>
          <p>
            Unlock professional-grade tech courses curated by industry leaders.
          </p>
        </motion.div>

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
          />
        ) : (
          sections.map((sec, idx) => (
            <CourseSection 
              key={idx} 
              title={sec.title} 
              courses={sec.courses} 
              onNavigate={handleNavigate} 
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
