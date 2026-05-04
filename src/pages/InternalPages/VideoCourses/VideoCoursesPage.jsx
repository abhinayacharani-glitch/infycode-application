import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, Star, PlayCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import '../CoursesPage.css'; // Reuse existing styles
import './VideoCourses.css';
import heroBg from '../../../assets/video-courses-hero.png';

const videoCoursesData = [
  {
    id: "java",
    title: "Java Full Stack Mastery",
    desc: "A comprehensive guide to master data structures, algorithms, and backend development with Spring Boot.",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    tag: "Programming",
    hours: "45 Hours",
    students: "1.2k+"
  },
  {
    id: "python",
    title: "Python Data Science Pro",
    desc: "Learn analytical programming, data visualization, and machine learning from scratch in this deep dive.",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    tag: "Data Science",
    hours: "38 Hours",
    students: "2.5k+"
  },
  {
    id: "cybersecurity",
    title: "Ethical Hacking & Cyber Ops",
    desc: "Master network security, penetration testing, and digital forensics in a fast-paced intensive video series.",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tag: "Security",
    hours: "60 Hours",
    students: "850+"
  }
];

const VideoCoursesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="courses-page">
      <button className="modern-back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
      <div
        className="courses-hero"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="courses-hero-content">
          <h1>Expert-Led <br /> Video Master Classes</h1>
          <p>Access high-definition recorded sessions from industry experts. Master new skills at your own pace with unlimited playback.</p>
          <div className="hero-motivation">
            <span>"The expert in anything was once a beginner. Start your mastery today."</span>
          </div>
        </div>
      </div>

      <div className="video-courses-section">
        <h2 className="courses-section-title">Available Recorded Sessions</h2>
        <div className="courses-grid">
          {videoCoursesData.map((course, i) => (
            <motion.div
              className="courses-card"
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <img src={course.img} alt={course.title} className="courses-card-img" />
              <div className="courses-card-info">
                <span className="courses-card-tag">{course.tag}</span>
                <h3>{course.title}</h3>
                <p>{course.desc}</p>

                <div className="courses-card-meta">
                  <span className="meta-item">
                    <Clock size={16} /> {course.hours}
                  </span>
                  <span className="meta-item">
                    <Users size={16} /> {course.students}
                  </span>
                  <button
                    className="courses-enroll-btn"
                    onClick={() => navigate(`/video-courses/${course.id}`)}
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoCoursesPage;
