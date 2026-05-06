import React, { useState, useEffect, useMemo } from "react";
import { Star, Search, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { enrollInCourse, getEnrolledCourses } from "../../../services/api";
import { useCourseContext } from "../../../context/CourseContext";
import { getCourseImage } from "../../../utils/courseUtils";
import "./Course.css";

const CATEGORIES = ["All", "Web Dev", "Python", "Java", "AI & Data", "Cybersecurity", "Cloud", "Mobile Dev"];

const CourseCardModern = ({ course, index, onNavigate, enrolledIds }) => {
  const isEnrolled = enrolledIds.includes(course.courseId);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await enrollInCourse(course.courseId);
      alert(`Successfully enrolled in ${course.title}!`);
      window.location.reload(); 
    } catch (error) {
      alert(error.message || "Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <img src={getCourseImage(course)} alt={course.title} />
      </div>

      <div className="card-content-modern">
        <h3 className="card-title-modern">{course.title}</h3>

        <div className="card-stats-modern">
          <div className="stat students-text">
            {course.students || '0'} students
          </div>
          <div className="stat stars-container">
            {[...Array(5)].map((_, idx) => (
              <Star
                key={idx}
                size={14}
                fill={idx < Math.floor(course.rating || 4.5) ? "#f59e0b" : "#e2e8f0"}
                color={idx < Math.floor(course.rating || 4.5) ? "#f59e0b" : "#e2e8f0"}
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
            onClick={isEnrolled || loading ? undefined : handleEnroll}
            disabled={isEnrolled || loading}
            style={
              isEnrolled
                ? { backgroundColor: '#10b981', cursor: 'default' }
                : {}
            }
          >
            {loading ? 'Processing...' : isEnrolled ? 'Enrolled' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CourseSection = ({ title, courses, onNavigate, enrolledIds }) => {
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
  const { publishedCourses } = useCourseContext();

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const data = await getEnrolledCourses();
        const ids = Array.isArray(data) ? data : (data.enrolledCourses || []);
        setEnrolledIds(ids);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
      }
    };
    fetchEnrolled();
  }, []);

  const handleNavigate = (path, state) => {
    navigate(path, { state });
  };

  const filtered = useMemo(() => {
    return publishedCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || course.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [publishedCourses, searchTerm, activeCategory]);

  const isFiltering = searchTerm !== "" || activeCategory !== "All";

  // Dynamic sections based on all published courses
  const sections = useMemo(() => {
    if (publishedCourses.length === 0) return [];
    
    // Divide courses into sections for better UI
    const popular = publishedCourses.slice(0, 4);
    const trending = publishedCourses.slice(4, 8);
    const recommended = publishedCourses.slice(8);

    const result = [];
    if (popular.length > 0) result.push({ title: "Popular Courses", courses: popular });
    if (trending.length > 0) result.push({ title: "Trending Courses", courses: trending });
    if (recommended.length > 0) result.push({ title: "Recommended Courses", courses: recommended });
    
    return result;
  }, [publishedCourses]);

  return (
    <div className="dc-main-viewport">
      <header className="page-header-centered">
        <h2>Course Catalog</h2>
        <p>Explore our wide range of professional courses and start your learning journey today.</p>
      </header>

      <div className="dc-controls-wrapper">
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

      <div className="dc-content-sections">
        {isFiltering ? (
          <CourseSection
            title={searchTerm ? `Search Results for "${searchTerm}"` : `Filtered Courses: ${activeCategory}`}
            courses={filtered}
            onNavigate={handleNavigate}
            enrolledIds={enrolledIds}
          />
        ) : (
          sections.map((sec, idx) => (
            <CourseSection
              key={idx}
              title={sec.title}
              courses={sec.courses}
              onNavigate={handleNavigate}
              enrolledIds={enrolledIds}
            />
          ))
        )}

        {isFiltering && filtered.length === 0 && (
          <div className="no-results">
            <h3>No courses found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        ) || (!isFiltering && publishedCourses.length === 0 && (
          <div className="no-results">
            <h3>Loading courses...</h3>
            <p>Please wait while we fetch the latest curriculum.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDiscovery;

