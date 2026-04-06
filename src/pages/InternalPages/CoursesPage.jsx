import React, { useEffect } from 'react';
import './CoursesPage.css';

const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    desc: "Master modern web development from front to back. Build responsive UIs with React and scalable backends with Node.js and MongoDB.",
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    tag: "Popular",
    hours: "120 Hours",
    students: "4.5k+"
  },
  {
    id: 2,
    title: "Python & Data Science",
    desc: "Dive into data analysis, visualization, and machine learning. Learn to extract actionable insights from complex datasets.",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tag: "Beginner",
    hours: "90 Hours",
    students: "3.2k+"
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    desc: "Design intuitive, beautiful, and accessible user interfaces. Master Figma, wireframing, and user research methodologies.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    tag: "Intermediate",
    hours: "60 Hours",
    students: "2.8k+"
  },
  {
    id: 4,
    title: "Cloud Computing & DevOps",
    desc: "Deploy and scale applications seamlessly. Master Docker, Kubernetes, CI/CD pipelines, and AWS architecture.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    tag: "Advanced",
    hours: "100 Hours",
    students: "1.9k+"
  },
  {
    id: 5,
    title: "Cyber Security Fundamentals",
    desc: "Protect systems and networks from digital attacks. Learn ethical hacking, network security, and cryptography.",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    tag: "High Demand",
    hours: "85 Hours",
    students: "2.1k+"
  },
  {
    id: 6,
    title: "Mobile App Development",
    desc: "Build cross-platform mobile applications for iOS and Android using React Native and Flutter.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    tag: "Advanced",
    hours: "95 Hours",
    students: "1.5k+"
  }
];

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
          {courses.map((course) => (
            <div className="courses-card" key={course.id}>
              <img src={course.img} alt={course.title} className="courses-card-img" />
              <div className="courses-card-info">
                <span className="courses-card-tag">{course.tag}</span>
                <h3>{course.title}</h3>
                <p>{course.desc}</p>

                <div className="courses-card-meta">

                  <span className="meta-item">
                    <ClockIcon /> {course.hours}
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