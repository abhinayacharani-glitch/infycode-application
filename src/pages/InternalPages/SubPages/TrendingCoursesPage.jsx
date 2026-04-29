import React, { useEffect } from 'react';
import './TrendingCoursesPage.css';

const courses = [
  {
    id: 1,
    title: "Generative AI Foundations",
    desc: "Learn the fundamentals of LLMs, prompt engineering, and building AI-powered apps with LangChain.",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    tag: "Trending #1",
    hours: "40 Hours",
    students: "5.8k+"
  },
  {
    id: 2,
    title: "Blockchain & Web3 Engineering",
    desc: "Master smart contract development with Solidity, Hardhat, and decentralized app architectures.",
    img: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800",
    tag: "Trending #2",
    hours: "65 Hours",
    students: "2.4k+"
  },
  {
    id: 3,
    title: "Advanced Cyber Security",
    desc: "Defend against modern threats. Learn penetration testing, cryptography, and network defense.",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tag: "Trending #3",
    hours: "85 Hours",
    students: "1.9k+"
  }
];

// ✅ SVG Icons
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M7 21v-2a4 4 0 0 1 3-3.87"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

import { useNavigate } from 'react-router-dom';

const TrendingCoursesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      navigate("/student/signup");
    }
  };

  return (
    <div className="trending-page">
      <div
        className="trending-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="trending-hero-content">
          <h1>Trending Courses</h1>
          <p>Stay ahead of the curve. Learn the hottest emerging technologies dominating the job market today.</p>
        </div>
      </div>

      <div className="trending-section">
        <div className="trending-course-grid">
          {courses.map((course) => (
            <div className="trending-course-card" key={course.id}>
              <img src={course.img} alt={course.title} className="trending-course-img" />
              <div className="trending-course-info">
                <span className="trending-course-tag">{course.tag}</span>
                <h3>{course.title}</h3>
                <p>{course.desc}</p>

                <div className="trending-course-meta">

                  <span className="meta-item">
                    <ClockIcon /> {course.hours}
                  </span>

                  <span className="meta-item">
                    <UsersIcon /> {course.students}
                  </span>

                  <button className="trending-enroll-btn" onClick={handleEnroll}>Enroll Now</button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingCoursesPage;