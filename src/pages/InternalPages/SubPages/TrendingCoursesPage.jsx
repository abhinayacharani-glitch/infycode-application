import React, { useEffect } from 'react';
import { useCourseContext } from '../../../context/CourseContext';
import { useNavigate } from 'react-router-dom';
import { ALL_COURSES } from '../../../components/Courses/Courses';
import { ArrowLeft } from 'lucide-react';

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

const TrendingCoursesPage = () => {
  const navigate = useNavigate();
  const { publishedCourses } = useCourseContext();

  const combinedCourses = [...publishedCourses, ...ALL_COURSES];
  const trendingCourses = combinedCourses.filter(course => {
    const badge = course.badge?.toLowerCase();
    return badge === "trending" || badge === "hot" || badge === "new";
  });

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
      console.log("Not logged in or corrupted session, navigating to login.");
      navigate("/login", { state: { redirect: "/student-dashboard/courses" } });
    }
  };

  return (
    <div className="trending-page">
      <button className="modern-back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
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
          {trendingCourses.length > 0 ? (
            trendingCourses.map((course, index) => (
              <div className="trending-course-card" key={course.id || course.courseId || index}>
                <img src={course.image || course.img} alt={course.title} className="trending-course-img" />
                <div className="trending-course-info">
                  <span className="trending-course-tag">{course.badge}</span>
                  <h3>{course.title}</h3>
                  <p>{course.description || course.desc}</p>

                  <div className="trending-course-meta">

                    <span className="meta-item">
                      <ClockIcon /> {course.duration || course.hours}
                    </span>

                    <span className="meta-item">
                      <UsersIcon /> {course.students}
                    </span>

                    <button className="trending-enroll-btn" onClick={handleEnroll}>Enroll Now</button>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="no-courses-msg">No trending courses available at the moment.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingCoursesPage;