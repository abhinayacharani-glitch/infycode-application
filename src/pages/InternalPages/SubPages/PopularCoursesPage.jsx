import { useCourseContext } from '../../../context/CourseContext';

// ✅ SVG Icons as components
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

const PopularCoursesPage = () => {
  const navigate = useNavigate();
  const { publishedCourses } = useCourseContext();

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
    <div className="popular-page">
      <div
        className="popular-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="popular-hero-content">
          <h1>Popular Courses</h1>
          <p>Join thousands of learners in our most highly-rated, industry-recognized programs.</p>
        </div>
      </div>

      <div className="popular-section">
        <div className="popular-course-grid">
          {publishedCourses.map((course) => (
            <div className="popular-course-card" key={course.id}>
              <img src={course.image || course.img} alt={course.title} className="popular-course-img" />
              <div className="popular-course-info">
                <span className="popular-course-tag">{course.badge || course.tag}</span>
                <h3>{course.title}</h3>
                <p>{course.description || course.desc}</p>

                <div className="popular-course-meta">
                  
                  <span className="meta-item">
                    <ClockIcon /> {course.duration || course.hours}
                  </span>

                  <span className="meta-item">
                    <UsersIcon /> {course.students}
                  </span>

                  <button className="popular-enroll-btn" onClick={handleEnroll}>Enroll Now</button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCoursesPage;