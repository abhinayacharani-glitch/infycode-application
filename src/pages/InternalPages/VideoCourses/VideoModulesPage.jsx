import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, PlayCircle, ArrowLeft, CheckCircle2, Video, ChevronDown } from 'lucide-react';
import '../../StudentDashboard/pages/CourseTopics.css'; 
import './VideoCourses.css';

const chaptersByCourse = {
  java: [
    { id: 1, title: "Introduction & Foundations", lessons: [{ id: "j-1", title: "Setup", duration: "12m", desc: "Setting up Java." }, { id: "j-2", title: "Syntax", duration: "18m", desc: "Core syntax." }] },
    { id: 2, title: "Core Java Syntax", lessons: [{ id: "j-3", title: "Variables", duration: "20m", desc: "Data types." }, { id: "j-4", title: "Operators", duration: "15m", desc: "Math." }] },
    { id: 3, title: "OOP Principles", lessons: [{ id: "j-5", title: "Classes & Objects", duration: "35m", desc: "OOP foundations." }] },
    { id: 4, title: "Inheritance & Poly", lessons: [{ id: "j-6", title: "Advanced OOP", duration: "45m", desc: "Extending code." }] },
    { id: 5, title: "Collections", lessons: [{ id: "j-7", title: "Data Handling", duration: "1h", desc: "Lists & Maps." }] },
    { id: 6, title: "Exceptions", lessons: [{ id: "j-8", title: "Robust Apps", duration: "30m", desc: "Error handling." }] },
    { id: 7, title: "Multithreading", lessons: [{ id: "j-9", title: "Parallel Tasks", duration: "1h 10m", desc: "Concurrency." }] },
    { id: 8, title: "Spring Boot", lessons: [{ id: "j-10", title: "Modern Java", duration: "2h", desc: "REST APIs." }] },
  ],
  python: [
    { id: 1, title: "Python Intro & Setup", lessons: [{ id: "p-1", title: "Installation", duration: "10m", desc: "Pips and Venvs." }] },
    { id: 2, title: "Programming Logic", lessons: [{ id: "p-2", title: "If-Else Blocks", duration: "20m", desc: "Core logic." }] },
    { id: 3, title: "Data Structures", lessons: [{ id: "p-3", title: "Lists & Dicts", duration: "45m", desc: "Python collections." }] },
    { id: 4, title: "Functions", lessons: [{ id: "p-4", title: "Reusable Code", duration: "30m", desc: "Writing def." }] },
    { id: 5, title: "OOP Python", lessons: [{ id: "p-5", title: "Classes & Methods", duration: "1h", desc: "OOP basics." }] },
    { id: 6, title: "Automation", lessons: [{ id: "p-6", title: "Scripting", duration: "1h 15m", desc: "Real world automation." }] },
    { id: 7, title: "Data Science (Pandas)", lessons: [{ id: "p-7", title: "DataFrames", duration: "1h 30m", desc: "Data cleaning." }] },
    { id: 8, title: "Machine Learning Intro", lessons: [{ id: "p-8", title: "AI Foundations", duration: "2h 30m", desc: "Model basics." }] },
  ],
  cybersecurity: [
    { id: 1, title: "Network Basics", lessons: [{ id: "c-1", title: "OSI Model", duration: "25m", desc: "Protocols." }] },
    { id: 2, title: "Ethical Hacking Flow", lessons: [{ id: "c-2", title: "PenTesting", duration: "35m", desc: "Mindset." }] },
    { id: 3, title: "OWASP Top 10", lessons: [{ id: "c-3", title: "SQLi & XSS", duration: "1h", desc: "Exploits." }] },
    { id: 4, title: "Wireless Security", lessons: [{ id: "c-4", title: "WPA2 Breaking", duration: "45m", desc: "Wi-Fi defense." }] },
    { id: 5, title: "Cryptography", lessons: [{ id: "c-5", title: "AES & RSA", duration: "1h 15m", desc: "Data protection." }] },
    { id: 6, title: "IAM basics", lessons: [{ id: "c-6", title: "OAuth & AD", duration: "1h", desc: "Identity logic." }] },
    { id: 7, title: "Cloud Security", lessons: [{ id: "c-7", title: "AWS Ops", duration: "1h 30m", desc: "Cloud defense." }] },
    { id: 8, title: "Incident Response", lessons: [{ id: "c-8", title: "Post-Breach", duration: "2h", desc: "Disaster recovery." }] },
  ]
};

const courseTitles = {
  java: "Java Full Stack Mastery",
  python: "Python Data Science Pro",
  cybersecurity: "Ethical Hacking & Cyber Ops"
};

const VideoModulesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  // Standardize ID to lowercase to ensure match with object keys
  const standardizedId = courseId?.toLowerCase() || 'java';
  
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // GLOBAL LOCK LOGIC: Use a common flag for all courses as requested
    const isPaid = localStorage.getItem('video_all_unlocked') === 'true';
    setIsUnlocked(isPaid);
  }, []);

  const chapters = chaptersByCourse[standardizedId] || chaptersByCourse.java;
  const title = courseTitles[standardizedId] || "Technical Training";

  const toggleModule = (id, isLocked) => {
    if (isLocked) {
        document.getElementById('unlock-section')?.scrollIntoView({ behavior: 'smooth' });
        return;
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const handleLessonClick = (lesson, shouldLock) => {
    if (shouldLock) return;
    navigate(`/video-courses/${standardizedId}/${lesson.id}`, { 
        state: { 
            lessonTitle: lesson.title, 
            courseTitle: title,
            description: lesson.desc 
        } 
    });
  };

  return (
    <div className="ct-viewport" style={{ background: '#f8fafc' }}>
      <div className="vc-centered-container">
        <motion.button 
            className="ct-back-btn" 
            onClick={() => navigate('/video-courses')}
            whileHover={{ x: -5 }}
        >
            <ArrowLeft size={18} /> Back to Courses
        </motion.button>

        <div className="ct-header" style={{ marginBottom: '40px' }}>
            <span className="ct-category-tag">Full Curriculum</span>
            <h1 className="ct-main-title">{title}</h1>
            <p className="ct-main-subtitle">
                Master the topics with step-by-step guidance. Only first 2 chapters are open.
            </p>
        </div>

        <div className="ct-detailed-info" style={{ marginTop: 0 }}>
            <div className="ct-syllabus-section">
                <div className="ct-section-title">
                    <Video className="ct-section-icon" />
                    <h2>Course Roadmap & Progressive Training</h2>
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                    {chapters.map((chapter, index) => {
                        const isOpen = expandedId === chapter.id;
                        // GLOBAL LOCK LOGIC: Chapters 1 & 2 (index 0, 1) are free for EVERY course. Index >= 2 is locked.
                        const isChapterLocked = index >= 2 && !isUnlocked;
                        
                        return (
                            <div key={chapter.id} className="vc-module-wrapper" style={{ opacity: isChapterLocked ? 0.85 : 1 }}>
                                <div 
                                    className="vc-module-header"
                                    style={{ 
                                        cursor: 'pointer',
                                        background: 'white',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                        border: isOpen ? '1px solid #3b82f6' : '1px solid #f1f5f9',
                                        borderRadius: '16px',
                                        padding: '20px 25px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => toggleModule(chapter.id, isChapterLocked)}
                                >
                                    <div className="vc-hdr-main">
                                        {isChapterLocked ? <Lock size={18} color="#94a3b8" /> : <PlayCircle size={18} color="#2563eb" />}
                                        <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: isChapterLocked ? '#64748b' : '#1e293b' }}>
                                            Chapter {index + 1}: {chapter.title}
                                        </h4>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#64748b' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1px', color: isChapterLocked ? '#94a3b8' : '#10b981' }}>
                                            {!isChapterLocked ? "FREE ACCESS" : "ENROLL TO UNLOCK"}
                                        </span>
                                        {!isChapterLocked && (
                                            <ChevronDown className={`vc-module-arrow ${isOpen ? 'open' : ''}`} size={20} />
                                        )}
                                    </div>
                                </div>

                                <AnimatePresence>
                                {isOpen && (
                                    <motion.div 
                                        className="vc-module-content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        style={{ background: 'transparent', marginTop: '10px', padding: '0 10px' }}
                                    >
                                        <div className="vc-lesson-list">
                                            {chapter.lessons.map((lesson) => (
                                                <div 
                                                    key={lesson.id}
                                                    className={`vc-lesson-item ${isChapterLocked ? 'locked' : ''}`}
                                                    onClick={() => handleLessonClick(lesson, isChapterLocked)}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <Video size={16} />
                                                        <span>{lesson.title}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span className="vc-lesson-duration">{lesson.duration}</span>
                                                        {isChapterLocked && <Lock size={14} />}
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {/* Locked overlay removed, scroll to bottom instead */}
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {!isUnlocked && (
                    <div id="unlock-section" style={{ marginTop: '50px', background: 'white', padding: '50px 40px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 50px rgba(37, 99, 235, 0.08)', border: '1px solid #eef2f6' }}>
                        <div style={{ background: '#eff6ff', width: '60px', height: '60px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Lock size={30} color="#2563eb" />
                        </div>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: '#1e293b' }}>Unlock the Complete Mastery</h3>
                        <p style={{ color: '#64748b', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
                            Join the program to unlock all {chapters.length} chapters, source files, and a professional certificate.
                        </p>
                        <button 
                            className="btn-primary" 
                            style={{ padding: '20px 60px', fontSize: '1.1rem', borderRadius: '18px', fontWeight: 700, border: 'none', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.2)' }}
                            onClick={() => navigate(`/video-courses/payment/${courseId}`)}
                        >
                            Enroll to Unlock Full Course
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModulesPage;
