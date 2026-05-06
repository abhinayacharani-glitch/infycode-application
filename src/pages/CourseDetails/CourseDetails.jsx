import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseContext } from "../../context/CourseContext";
import {
  ArrowLeft, Clock, Star, BookOpen, ChevronDown, ChevronUp,
  CheckCircle, Eye, Calendar, User as UserIcon, Download,
  Layers, Target, Trophy, Globe, PlayCircle
} from "lucide-react";
import jsPDF from "jspdf";
import { getCourseImage, parseCurriculum } from "../../utils/courseUtils";
import "../../components/Courses/Courses.css";
import "./CourseDetailsPage.css";

/* ─── Curriculum parser: bracket format → module objects ─── */
const parseDynamicCurriculum = (curriculumStr) => {
  if (!curriculumStr) return [];
  try {
    const blocks = curriculumStr.split("\n\n").filter((b) => b.trim());
    return blocks.map((block, idx) => {
      const lines = block.split("\n").filter((l) => l.trim());
      const titleLine = lines[0] || "";
      const titleMatch = titleLine.match(/\[(.*?)\]/);
      const title = titleMatch ? titleMatch[1] : `Module ${idx + 1}`;
      const topics = lines.slice(1).map((t) => ({ main: t.trim(), subtopics: [] }));
      return { id: idx + 1, title, topics };
    });
  } catch {
    return [];
  }
};

/* ─── Main Page ─── */
const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [openModules, setOpenModules] = useState([]);
  const { publishedCourses } = useCourseContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const course = useMemo(
    () => publishedCourses.find((c) => c.courseId === id || c.id === id),
    [publishedCourses, id]
  );

  const courseSyllabus = useMemo(
    () => parseDynamicCurriculum(course?.curriculum),
    [course]
  );

  const toggleModule = (modId) => {
    setOpenModules((prev) =>
      prev.includes(modId) ? prev.filter((x) => x !== modId) : [...prev, modId]
    );
  };

  const handleEnroll = () => {
    const userStr = localStorage.getItem("loggedUser");
    let userObj = null;
    try { userObj = userStr ? JSON.parse(userStr) : null; } catch {}
    if (userObj?.role === "Student") {
      navigate("/student-dashboard/courses");
    } else {
      navigate("/login", { state: { redirect: "/student-dashboard/courses" } });
    }
  };

  const handleDownloadCurriculum = () => {
    if (!course) return;
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233);
    doc.text(course.title, 20, y); y += 10;

    doc.setFontSize(13);
    doc.setTextColor(80);
    doc.text(`Instructor: ${course.trainer}`, 20, y); y += 8;
    doc.text(`Duration: ${course.duration}`, 20, y); y += 8;
    doc.text(`Level: ${course.level}`, 20, y); y += 14;

    doc.setFontSize(17);
    doc.setTextColor(15, 23, 42);
    doc.text("Course Curriculum", 20, y); y += 12;

    courseSyllabus.forEach((mod) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(mod.title, 20, y); y += 7;
      mod.topics.forEach((t) => {
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text(`  • ${t.main}`, 25, y); y += 5;
        if (y > 280) { doc.addPage(); y = 20; }
      });
      y += 5;
    });

    doc.save(`${course.title}_Curriculum.pdf`);
  };

  /* ─── Loading / Not Found states ─── */
  if (!course && publishedCourses.length === 0) {
    return (
      <div className="cd-not-found">
        <div className="cd-not-found-inner">
          <BookOpen size={48} style={{ color: "#0ea5e9", marginBottom: 16 }} />
          <h2>Loading course details...</h2>
          <p>Please wait while we fetch the course information.</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="cd-not-found">
        <div className="cd-not-found-inner">
          <BookOpen size={48} style={{ color: "#ef4444", marginBottom: 16 }} />
          <h2>Course Not Found</h2>
          <p>The course you're looking for doesn't exist or may have been removed.</p>
          <button onClick={() => navigate(-1)} className="cd-back-btn">
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const totalTopics = courseSyllabus.reduce((acc, m) => acc + m.topics.length, 0);

  return (
    <div className="cd-page-wrapper">
      <div className="cd-container">

        {/* Back Navigation */}
        <button onClick={() => navigate(-1)} className="cd-nav-back">
          <ArrowLeft size={18} />
          <span>Back to Courses</span>
        </button>

        {/* ── Hero Header ── */}
        <div className="cd-header-card">
          <div className="cd-header-info">
            <div className="cd-tags">
              <span className="cd-cat-tag" style={{ background: "#0ea5e915", color: "#0ea5e9" }}>
                {course.category}
              </span>
              <span className="cd-level-tag">{course.level || "All Levels"}</span>
            </div>

            <h1 className="cd-main-title">{course.title}</h1>
            <p className="cd-subtitle">
              {course.description || "Build real-world skills through interactive, hands-on learning with expert guidance."}
            </p>

            <div className="cd-stats">
              <span className="cd-stat"><Star size={16} className="text-yellow" /> {course.rating} Rating</span>
              <span className="cd-stat"><Clock size={16} /> {course.duration}</span>
              <span className="cd-stat"><Layers size={16} /> {courseSyllabus.length} Modules</span>
              <span className="cd-stat"><Target size={16} /> {totalTopics} Topics</span>
              <span className="cd-stat">
                <UserIcon size={16} /> {course.trainer}
                <button className="cd-mini-download" onClick={handleDownloadCurriculum} title="Download Curriculum">
                  <Download size={14} />
                  <span>Download</span>
                </button>
              </span>
            </div>

            <div className="cd-hero-actions">
              <button className="cd-hero-enroll" onClick={handleEnroll}>
                Enroll Now
              </button>
              <button className="cd-hero-pricing" title="View Pricing">₹</button>
            </div>
          </div>

          <div className="cd-header-image">
            <img src={getCourseImage(course)} alt={course.title} />
          </div>
        </div>

        {/* ── Quick Stats Bar ── */}
        <div className="cd-quick-stats-bar">
          <div className="cd-quick-stat">
            <BookOpen size={20} />
            <div>
              <span className="qs-num">{courseSyllabus.length}</span>
              <span className="qs-lbl">Modules</span>
            </div>
          </div>
          <div className="cd-quick-stat">
            <Target size={20} />
            <div>
              <span className="qs-num">{totalTopics}</span>
              <span className="qs-lbl">Topics</span>
            </div>
          </div>
          <div className="cd-quick-stat">
            <Clock size={20} />
            <div>
              <span className="qs-num">{course.duration}</span>
              <span className="qs-lbl">Duration</span>
            </div>
          </div>
          <div className="cd-quick-stat">
            <Globe size={20} />
            <div>
              <span className="qs-num">Self-Paced</span>
              <span className="qs-lbl">Mode</span>
            </div>
          </div>
          <div className="cd-quick-stat">
            <Trophy size={20} />
            <div>
              <span className="qs-num">Certificate</span>
              <span className="qs-lbl">On Completion</span>
            </div>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <div className="cd-tabs-wrapper">
          <div className="cd-tabs-container">
            {["Overview", "Curriculum"].map((tab) => (
              <button
                key={tab}
                className={`cd-tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="cd-content-area">

          {/* OVERVIEW TAB */}
          {activeTab === "Overview" && (
            <div className="cd-tab-panel">

              {/* Course Overview */}
              <section className="cd-section">
                <h2 className="cd-section-title">Course Overview</h2>
                <div className="cd-desc-block">
                  <p>
                    Welcome to the <strong>{course.title}</strong> program. This course is meticulously designed
                    to take you from foundational concepts to advanced practical implementation. Whether you're
                    looking to break into the industry, upgrade your current skillset, or shift your career
                    trajectory, this program provides the comprehensive knowledge necessary to succeed.
                  </p>
                  <h4>Skills You Will Gain</h4>
                  <ul className="cd-skills-list">
                    <li><CheckCircle size={16} /> Complete mastery of industry-standard {course.category} tools.</li>
                    <li><CheckCircle size={16} /> Ability to architect, design, and deploy robust applications.</li>
                    <li><CheckCircle size={16} /> Strong problem-solving methodologies used by top companies.</li>
                    <li><CheckCircle size={16} /> Best practices and modern workflows adopted in the industry.</li>
                    <li><CheckCircle size={16} /> Portfolio-ready projects to showcase to employers.</li>
                  </ul>
                </div>
              </section>

              {/* Curriculum Preview (first 3 modules) */}
              {courseSyllabus.length > 0 && (
                <section className="cd-section mt-8">
                  <h2 className="cd-section-title">Curriculum Preview</h2>
                  <div className="cd-curriculum-preview">
                    {courseSyllabus.slice(0, 3).map((mod) => (
                      <div key={mod.id} className="cd-preview-module">
                        <div className="cd-preview-module-header">
                          <PlayCircle size={18} />
                          <span>{mod.title}</span>
                          <span className="cd-preview-count">{mod.topics.length} topics</span>
                        </div>
                        <ul className="cd-preview-topics">
                          {mod.topics.slice(0, 4).map((t, i) => (
                            <li key={i}><CheckCircle size={12} />{t.main}</li>
                          ))}
                          {mod.topics.length > 4 && (
                            <li className="cd-more-topics">+{mod.topics.length - 4} more topics</li>
                          )}
                        </ul>
                      </div>
                    ))}
                    {courseSyllabus.length > 3 && (
                      <button
                        className="cd-see-all-btn"
                        onClick={() => setActiveTab("Curriculum")}
                      >
                        View Full Curriculum ({courseSyllabus.length} Modules)
                      </button>
                    )}
                  </div>
                </section>
              )}

              {/* Description */}
              <section className="cd-section mt-8">
                <h2 className="cd-section-title">Description</h2>
                <div className="cd-desc-block">
                  <h4>Course Structure</h4>
                  <p>
                    The curriculum is broken down into {courseSyllabus.length} structured, easily digestible modules.
                    We start with core principles and gradually build up to complex, multi-layered concepts.
                    Each module focuses on specific deliverables and practical exercises.
                  </p>
                  <h4>Learning Approach</h4>
                  <p>
                    We believe in learning by doing. While theoretical knowledge forms the base, 80% of this
                    course is practical. You'll be writing code, executing strategies, and solving challenges
                    exactly as you would in a real job environment.
                  </p>
                </div>
              </section>

              {/* Suggested / Related Courses */}
              <RelatedCourses currentCourse={course} navigate={navigate} publishedCourses={publishedCourses} />
            </div>
          )}

          {/* CURRICULUM TAB */}
          {activeTab === "Curriculum" && (
            <div className="cd-tab-panel">
              <section className="cd-section">
                <div className="cd-curriculum-header-row">
                  <h2 className="cd-section-title">Course Curriculum</h2>
                  <div className="cd-curriculum-meta">
                    <span><Layers size={15} /> {courseSyllabus.length} Modules</span>
                    <span><Target size={15} /> {totalTopics} Topics</span>
                    <button className="cd-download-btn" onClick={handleDownloadCurriculum}>
                      <Download size={15} /> Download PDF
                    </button>
                  </div>
                </div>

                {courseSyllabus.length === 0 ? (
                  <div className="cd-no-curriculum">
                    <BookOpen size={40} />
                    <p>Curriculum content is being prepared. Check back soon!</p>
                  </div>
                ) : (
                  <div className="cd-accordion-container">
                    {courseSyllabus.map((mod) => {
                      const isOpen = openModules.includes(mod.id);
                      return (
                        <div key={mod.id} className={`cd-accordion-item ${isOpen ? "open" : ""}`}>
                          <div className="cd-accordion-header" onClick={() => toggleModule(mod.id)}>
                            <div className="cd-accordion-title-wrap">
                              <span className="cd-module-num">Module {mod.id}</span>
                              <span className="cd-accordion-title">{mod.title}</span>
                            </div>
                            <div className="cd-accordion-right">
                              <span className="cd-topic-count">{mod.topics.length} topics</span>
                              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                          </div>

                          <div className={`cd-accordion-body ${isOpen ? "expanded" : ""}`}>
                            <ul className="cd-topic-list">
                              {mod.topics.map((t, i) => (
                                <li key={i} className="cd-topic-item">
                                  <CheckCircle size={14} className="cd-topic-check" />
                                  <span className="cd-topic-main">{t.main}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Related / Suggested Courses Slider ─── */
const RelatedCourses = ({ currentCourse, navigate, publishedCourses }) => {
  const sameCat = publishedCourses.filter(
    (c) => c.courseId !== currentCourse.courseId && c.category === currentCourse.category
  );
  const others = publishedCourses.filter(
    (c) => c.courseId !== currentCourse.courseId && c.category !== currentCourse.category
  );
  const originalSuggestions = [...sameCat, ...others].slice(0, 8);
  const suggestions = [...originalSuggestions, ...originalSuggestions, ...originalSuggestions];

  const [index, setIndex] = useState(originalSuggestions.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    if (index >= originalSuggestions.length * 2) {
      setTimeout(() => { setIsTransitioning(false); setIndex(originalSuggestions.length); }, 600);
    } else if (index < originalSuggestions.length) {
      setTimeout(() => { setIsTransitioning(false); setIndex(originalSuggestions.length * 2 - 1); }, 600);
    } else {
      setIsTransitioning(true);
    }
  }, [index, originalSuggestions.length]);

  useEffect(() => {
    const interval = setInterval(() => setIndex((p) => p + 1), 4000);
    return () => clearInterval(interval);
  }, [originalSuggestions.length]);

  if (originalSuggestions.length === 0) return null;

  const cols = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;

  return (
    <div className="cd-related-section slider-mode">
      <div className="cd-related-header">
        <h2 className="cd-related-title">Suggested Courses</h2>
        <p className="cd-related-sub">Explore more courses to accelerate your learning journey</p>
      </div>

      <div className="cd-slider-container">
        <button className="cd-slider-nav prev" onClick={() => setIndex((p) => p - 1)}>❮</button>

        <div className="cd-slider-viewport">
          <div
            className="cd-slider-track"
            style={{
              transform: `translateX(-${index * (100 / cols)}%)`,
              transition: isTransitioning ? "transform 0.5s cubic-bezier(0.4,0,0.2,1)" : "none"
            }}
          >
            {suggestions.map((c, i) => (
              <div
                key={`${c.courseId}-${i}`}
                className="cd-slider-item"
                style={{ flex: `0 0 ${100 / cols}%` }}
              >
                <div className="course-card-modern">
                  <div
                    className="card-img-banner"
                    onClick={() => { navigate(`/course-details/${c.courseId}`); window.scrollTo(0, 0); }}
                    style={{ cursor: "pointer" }}
                  >
                    <img src={getCourseImage(c)} alt={c.title} />
                  </div>

                  <div className="card-content-modern">
                    <h3
                      className="card-title-modern"
                      onClick={() => { navigate(`/course-details/${c.courseId}`); window.scrollTo(0, 0); }}
                      style={{ cursor: "pointer" }}
                    >
                      {c.title}
                    </h3>

                    <div className="card-footer-modern">
                      <div className="footer-info-left">
                        <div className="info-item">
                          <UserIcon size={14} />
                          <span>{c.trainer}</span>
                        </div>
                        <div className="info-item">
                          <Calendar size={14} />
                          <span>{c.startDate || "Upcoming"}</span>
                        </div>
                        <div className="info-item duration-highlight">
                          <Clock size={14} />
                          <span>{c.duration}</span>
                        </div>
                      </div>

                      <div className="details-action-wrapper">
                        <button
                          className="btn-view-details"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/course-details/${c.courseId}`);
                            window.scrollTo(0, 0);
                          }}
                          title="View Course Details"
                        >
                          <Eye size={20} />
                        </button>
                        <span className="action-label">View Course</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="cd-slider-nav next" onClick={() => setIndex((p) => p + 1)}>❯</button>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
