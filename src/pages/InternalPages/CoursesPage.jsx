import { useCourseContext } from '../../context/CourseContext';

// ✅ SVG Icons (Reusable Components)
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

const CoursesPage = () => {
  const { publishedCourses } = useCourseContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="courses-page">
      <div
        className="courses-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="courses-hero-content">
          <h1>Master the Skills of Tomorrow</h1>
          <p>Explore our highly-curated, industry-aligned courses designed to take you from a beginner to a job-ready professional.</p>
          <div className="courses-search">
            <input type="text" placeholder="What do you want to learn today?" />
            <button>Search</button>
          </div>
        </div>
      </div>

      <div className="courses-section" id="popular">
        <h2 className="courses-section-title">Explore Our Premium Courses</h2>
        <div className="courses-grid">
          {publishedCourses.map((course) => (
            <div className="courses-card" key={course.id}>
              <img src={course.image || course.img} alt={course.title} className="courses-card-img" />
              <div className="courses-card-info">
                <span className="courses-card-tag">{course.badge || course.tag}</span>
                <h3>{course.title}</h3>
                <p>{course.description || course.desc}</p>

                <div className="courses-card-meta">

                  <span className="meta-item">
                    <ClockIcon /> {course.duration || course.hours}
                  </span>

                  <span className="meta-item">
                    <UsersIcon /> {course.students}
                  </span>

                  <button className="courses-enroll-btn">Enroll Now</button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;