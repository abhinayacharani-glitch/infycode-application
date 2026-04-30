import React, { useState, useEffect } from "react";
import { Star, Search, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { enrollInCourse, getEnrolledCourses } from "../../../services/api";
import { ALL_COURSES as ORIGINAL_COURSES } from "../../../components/Courses/Courses";
import { useCourseContext } from "../../../context/CourseContext";
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

const CourseCardModern = ({ course, index, onNavigate, enrolledIds }) => {
  const isEnrolled = enrolledIds.includes(course.courseId);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      await enrollInCourse(course.courseId);
      alert(`Successfully enrolled in ${course.title}!`);
      window.location.reload(); // Refresh to update enrollment status globally
    } catch (error) {
      alert(error.message || "Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
        <img src={course.image || 'https://via.placeholder.com/400x200?text=Course'} alt={course.title} />
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
            onClick={isDisabledCard || isEnrolled || loading ? undefined : handleEnroll}
            disabled={isDisabledCard || isEnrolled || loading}
            style={
              isDisabledCard 
                ? { cursor: 'not-allowed', opacity: 0.7 } 
                : isEnrolled 
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
        // Assuming data is an array of IDs or an object with an enrolledCourses array
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

  const combinedCourses = [...publishedCourses, ...ALL_COURSES];

  const filtered = combinedCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Categorize courses (if not searching)
  const isFiltering = searchTerm !== "" || activeCategory !== "All";
  
  const sections = [
    ...(publishedCourses.length > 0 ? [{ title: "New Published Courses", courses: publishedCourses }] : []),
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
        )}
      </div>

    </div>
  );
};

export default CourseDiscovery;
