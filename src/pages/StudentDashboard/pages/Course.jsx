import React from "react";
import { Star, Clock, Users, ArrowRight, ChevronRight, PlayCircle, BookOpen, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Course.css";

// ── Course images ──────────────────────────────────────────────
import imgReact      from "../../../assets/course/react.jpeg";
import imgWebDev     from "../../../assets/course/Webdev.jpeg";
import imgPython     from "../../../assets/course/Python.jpeg";
import imgJava       from "../../../assets/course/java.jpeg";
import imgAI         from "../../../assets/course/AI.jpeg";
import imgDataScience from "../../../assets/course/DataScience.jpeg";
import imgCloud      from "../../../assets/course/cloud.jpeg";
import imgUIUX       from "../../../assets/course/UI-UX.jpeg";

// components/StatusIcon.jsx (Helper)
const StatusIcon = ({ name }) => {
  const icons = { PlayCircle, Star, BookOpen, Layers };
  const Icon = icons[name] || BookOpen;
  return <Icon size={12} />;
};

const CourseCard = ({ course, index, onExplore }) => {
  const statusColors = {
    "BEST SELLER": { bg: "rgba(249, 115, 22, 0.15)", color: "#f97316", icon: "PlayCircle" },
    "TRENDING":    { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981", icon: "Layers" },
    "POPULAR":     { bg: "rgba(99, 102, 241, 0.15)", color: "#6366f1", icon: "Star" },
    "HOT":         { bg: "rgba(220, 38, 38, 0.15)",  color: "#dc2626", icon: "Star" },
    "NEW":         { bg: "rgba(14, 165, 233, 0.15)", color: "#0ea5e9", icon: "BookOpen" },
    "ADVANCED":    { bg: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6", icon: "Layers" },
    "INTERMEDIATE":{ bg: "rgba(13, 148, 136, 0.15)", color: "#0d9488", icon: "Layers" },
    "BEGINNER":    { bg: "rgba(37, 99, 235, 0.15)",  color: "#2563eb", icon: "BookOpen" },
  };
  const sc = statusColors[course.badge] || statusColors["NEW"];
  return (
    <motion.div 
      className="dc-card-premium"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <div className="dc-card-img-wrap">
        <img src={course.image} alt={course.title} />
        <div className="dc-glass-tag">{course.category}</div>
      </div>
      <div className="dc-card-info">
        <div className="dc-badge-group">
          <span className="dc-premium-pill" style={{ background: sc.bg, color: sc.color }}>
            <StatusIcon name={sc.icon} /> {course.badge}
          </span>
          <span className="dc-level-indicator">{course.level}</span>
        </div>
        <h3 className="dc-card-head">{course.title}</h3>
        <div className="dc-meta-row">
          <div className="dc-meta-item"><Users size={14} className="dc-icon-blue" /><span>{course.students}</span></div>
          <div className="dc-meta-item"><Star size={14} className="dc-icon-gold" fill="currentColor" /><span>{course.rating}</span></div>
          <div className="dc-meta-item"><Clock size={14} /><span>{course.duration}</span></div>
        </div>
        <div className="dc-card-actions">
          <button className="dc-btn-enrol-premium" onClick={() => onExplore(course)}>Explore Course <ArrowRight size={16} /></button>
        </div>
      </div>
    </motion.div>
  );
};

const CourseSection = ({ title, courses, onViewMore, onExplore, sectionIndex }) => (
  <motion.section 
    className="dc-section-premium"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: sectionIndex * 0.2 }}
  >
    <div className="dc-sec-header">
      <div className="dc-sec-intro">
        <h2 className="dc-sec-title-premium">{title}</h2>
        <div className="dc-sec-underline"></div>
      </div>
      <motion.button className="dc-btn-ghost-premium" onClick={onViewMore} whileHover={{ x: 5 }}>
        View Library <ChevronRight size={18} />
      </motion.button>
    </div>
    <div className="dc-grid-premium">
      {courses.map((c, i) => <CourseCard key={i} course={c} index={i} onExplore={onExplore} />)}
    </div>
  </motion.section>
);

const CourseDiscovery = () => {
  const POPULAR = [
    { image: imgReact,       title: "Full-Stack React & Next.js Masterclass", category: "Development", badge: "CID-108", rating: 4.9, students: "2.4k", duration: "12 weeks", level: "Intermediate" },
    { image: imgPython,      title: "Advanced Python for Data Engineering",  category: "Data Science", badge: "CID-109",     rating: 4.8, students: "1.8k", duration: "8 weeks",  level: "Advanced" },
    { image: imgJava,        title: "Enterprise Java Spring Boot Architecture", category: "Backend",  badge: "CID-110",    rating: 4.9, students: "950+", duration: "10 weeks", level: "Expert" },
  ];

  const TRENDING = [
    { image: imgAI,          title: "Generative AI & LLM Systems Design",     category: "Artificial Intelligence", badge: "CID-111",    rating: 5.0, students: "1.2k", duration: "6 weeks",  level: "Intermediate" },
    { image: imgDataScience, title: "Modern Data Analytics with Power BI",      category: "Business Intelligence",  badge: "CID-112",         rating: 4.8, students: "3.5k", duration: "4 weeks",  level: "Beginner" },
    { image: imgCloud,       title: "Cloud Infrastructure Specialist (AWS)",    category: "DevOps",        badge: "CID-113",         rating: 4.7, students: "800+", duration: "8 weeks",  level: "Intermediate" },
  ];

  const RECOMMENDED = [
    { image: imgWebDev,      title: "Responsive Web Design Professional",       category: "Frontend",      badge: "CID-114",    rating: 4.9, students: "5.6k", duration: "6 weeks",  level: "Beginner" },
    { image: imgUIUX,        title: "UX Research & Product Design Strategy",    category: "Design",        badge: "CID-115",         rating: 4.8, students: "2.1k", duration: "8 weeks",  level: "Intermediate" },
    { image: imgPython,       title: "Python for Financial Modeling",            category: "Finance",       badge: "CID-116",     rating: 4.7, students: "1.5k", duration: "5 weeks",  level: "Advanced" },
  ];

  const ALL_COURSES = [...POPULAR, ...TRENDING, ...RECOMMENDED];

  const navigate = useNavigate();
  const goToLibrary = () => navigate("/student-dashboard/courses");
  const handleExplore = (course) => {
    navigate("/student-dashboard/course-explore", { 
      state: { courseId: course.badge.toLowerCase(), courseTitle: course.title, category: course.category } 
    });
  };

  return (
    <div className="dc-main-viewport">
      <div className="dc-content-body">
        <CourseSection title="All Available Courses" courses={ALL_COURSES} onViewMore={goToLibrary} onExplore={handleExplore} sectionIndex={0} />
      </div>
    </div>
  );
};


export default CourseDiscovery;
