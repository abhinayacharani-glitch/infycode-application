import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  BookOpen, 
  Star, 
  Zap, 
  ArrowLeft, 
  Target, 
  CheckCircle, 
  Calendar, 
  Briefcase, 
  FileText,
  User,
  Clock,
  Hash,
  Monitor,
  Download
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCourseContext } from '../../../context/CourseContext';
import { getStudentBatchesAPI, getBatchMaterialsAPI } from '../../../services/api';
import './CourseTopics.css';

const CourseTopics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { publishedCourses } = useCourseContext();
  const { courseId: stateCourseId } = location.state || {};

  const courseId = stateCourseId || 'java-fs-01';
  
  const course = useMemo(() => {
    if (!publishedCourses) return null;
    return publishedCourses.find(c => c.id === courseId || c.courseId === courseId) || publishedCourses[0];
  }, [publishedCourses, courseId]);

  const [myBatches, setMyBatches] = useState({});
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const [batchMaterials, setBatchMaterials] = useState([]);

  if (!course) return <div className="ct-viewport">Loading...</div>;

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await getStudentBatchesAPI();
        if (response.success) {
          setMyBatches(response.batches || {});
        }
      } catch (err) {
        console.error("Failed to fetch student batches:", err);
      } finally {
        setIsLoadingBatches(false);
      }
    };
    fetchBatches();
    const interval = setInterval(fetchBatches, 10000); // 10s interval is enough
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      const batchMatch = Object.values(myBatches).find(b => 
        b.courseId === courseId || 
        b.courseName === course.title ||
        b.batchName?.includes(course.title)
      );

      if (batchMatch) {
        try {
          const res = await getBatchMaterialsAPI(batchMatch.batchId || batchMatch.id);
          if (res.success) {
            setBatchMaterials(res.materials || []);
          }
        } catch (err) {
          console.error("Failed to fetch batch materials:", err);
        }
      }
    };
    if (Object.keys(myBatches).length > 0) {
      fetchMaterials();
    }
  }, [myBatches, courseId, course]);

  const dynamicData = useMemo(() => {
    const batchMatch = Object.values(myBatches).find(b => 
      b.courseId === courseId || 
      b.courseName === course.title ||
      b.batchName?.includes(course.title)
    );

    const isStarted = batchMatch && (
      batchMatch.status === 'started' || 
      batchMatch.status === 'Active' || 
      batchMatch.batchStatus === 'started' || 
      batchMatch.batchStatus === 'Active'
    );

    if (batchMatch) {
      return {
        isStarted,
        trainer: batchMatch.trainer ? {
          name: batchMatch.trainer.name,
          role: batchMatch.trainer.specialization || 'Lead Instructor',
          experience: batchMatch.trainer.experience || '10+ Years',
          specialization: batchMatch.trainer.specialization || course.category || 'Expert'
        } : course.trainer,
        batch: {
          id: batchMatch.batchId,
          name: batchMatch.batchName,
          startDate: batchMatch.startDate || course.batch?.startDate,
          timing: batchMatch.startTime || batchMatch.timing || course.batch?.timing || 'Flexible',
          duration: batchMatch.duration || course.batch?.duration || '6 Months',
          mode: batchMatch.mode || 'Online'
        }
      };
    }
    return { trainer: course.trainer, batch: course.batch, isStarted: false };
  }, [course, myBatches, courseId]);

  const topicsData = course.modules.map(m => ({
    level: m.subtitle,
    icon: m.id === 'beginner' ? <BookOpen className="level-icon beginner" /> : 
          m.id === 'intermediate' ? <Zap className="level-icon intermediate" /> : 
          <Star className="level-icon advanced" />,
    description: m.topics[0]?.content.replace(/<p>|<\/p>/g, '') || "Advanced curriculum topics.",
    topics: m.topics.map(t => t.title).slice(0, 5)
  }));

  const overview = course.objective;
  const objectives = [
    "Master the core fundamentals and advanced concepts.",
    "Develop robust, scalable, and secure applications.",
    "Implement best practices for performance optimization.",
    "Gain proficiency in modern tools and frameworks."
  ];

  const outcomes = [
    "Build a production-ready portfolio.",
    "Crack technical interviews with confidence.",
    "Understand enterprise-level system architectures.",
    "Collaborate effectively using agile methodologies."
  ];

  const syllabus = course.modules.map((m, i) => ({
    week: `Module ${i + 1}`,
    title: m.subtitle,
    content: m.duration
  }));

  const capstoneProjects = [
    { title: "E-Commerce Platform", desc: "A full-scale online store with payment gateway integration." },
    { title: "Real-time Chat Application", desc: "A scalable messaging app using WebSockets." },
    { title: "Data Analytics Dashboard", desc: "An interactive dashboard visualizing complex datasets." }
  ];

  return (
    <div className="ct-viewport">
      <motion.button 
        className="ct-back-btn"
        onClick={() => navigate(-1)}
        whileHover={{ x: -5 }}
      >
        <ArrowLeft size={18} /> Back to Courses
      </motion.button>

      <motion.div 
        className="ct-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="ct-category-tag">{course.category || "Technology"}</span>
        <h1 className="ct-main-title">{course.title}</h1>
        <p className="ct-main-subtitle">{course.description}</p>
      </motion.div>

      {/* Dynamic Trainer & Batch Info Section - Only show if batch is started */}
      {dynamicData.isStarted && (
        <div className="ct-info-row" style={{ marginBottom: '40px' }}>
            <motion.div className="ct-info-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="ct-card-header">
                <User className="ct-hdr-icon" />
                <h3>Assigned Trainer</h3>
              </div>
              <div className="ct-info-pill">
                 <div className="ct-avatar-sm">
                   {dynamicData.trainer?.name?.charAt(0)}
                 </div>
                 <div>
                   <div style={{ fontWeight: '800', color: '#0f172a' }}>{dynamicData.trainer?.name}</div>
                   <div style={{ fontSize: '13px', color: '#64748b' }}>{dynamicData.trainer?.role}</div>
                 </div>
              </div>
              <div className="ct-batch-mini-grid" style={{ marginTop: '15px' }}>
                 <div className="ct-mini-card">
                   <div className="ct-mini-label">Experience</div>
                   <div className="ct-mini-value">{dynamicData.trainer?.experience}</div>
                 </div>
                 <div className="ct-mini-card">
                   <div className="ct-mini-label">Specialization</div>
                   <div className="ct-mini-value">{dynamicData.trainer?.specialization?.split(',')[0]}</div>
                 </div>
              </div>
            </motion.div>

            <motion.div className="ct-info-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
              <div className="ct-card-header">
                <Calendar className="ct-hdr-icon" style={{ color: '#10b981' }} />
                <h3>Batch Schedule</h3>
              </div>
              <div className="ct-batch-mini-grid">
                 <div className="ct-mini-card">
                   <div className="ct-mini-label">Batch ID</div>
                   <div className="ct-mini-value">{dynamicData.batch?.id}</div>
                 </div>
                 <div className="ct-mini-card">
                   <div className="ct-mini-label">Timing</div>
                   <div className="ct-mini-value">{dynamicData.batch?.timing}</div>
                 </div>
                 <div className="ct-mini-card">
                   <div className="ct-mini-label">Start Date</div>
                   <div className="ct-mini-value">{dynamicData.batch?.startDate}</div>
                 </div>
                 <div className="ct-mini-card">
                   <div className="ct-mini-label">Mode</div>
                   <div className="ct-mini-value">{(() => {
                        const dur = dynamicData.batch?.duration || '4 Months';
                        const mod = (dynamicData.batch?.mode || 'Online').toLowerCase();
                        const durationStr = /weeks|months|days/i.test(dur) ? dur : `${dur} weeks`;
                        return `${durationStr} - ${mod}`;
                      })()}</div>
                 </div>
              </div>
            </motion.div>

            <motion.div className="ct-info-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <div className="ct-card-header">
                <Target className="ct-hdr-icon" style={{ color: '#f59e0b' }} />
                <h3>Current Progress</h3>
              </div>
              <div className="ct-progress-container">
                 <div className="ct-progress-labels">
                   <span>Curriculum Completion</span>
                   <span>{course.progress || 0}%</span>
                 </div>
                 <div className="ct-progress-bar-wrap">
                   <div className="ct-progress-fill" style={{ width: `${course.progress || 0}%` }}></div>
                 </div>
              </div>
            </motion.div>
        </div>
      )}

      <div className="ct-topics-grid">
        {topicsData.map((section, idx) => (
          <motion.div 
            key={section.level}
            className="ct-level-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
          >
            <div className="ct-level-header">
              <div className="ct-icon-box">{section.icon}</div>
              <div>
                <h2 className="ct-level-title">{section.level}</h2>
                <p className="ct-level-desc">{section.description}</p>
              </div>
            </div>

            <ul className="ct-topic-menu">
              {section.topics.map((topic, i) => (
                <motion.li 
                  key={i}
                  className="ct-topic-item"
                  whileHover={{ x: 8, color: "#2563eb" }}
                >
                  <ChevronRight size={16} className="ct-item-arrow" />
                  <span>{topic}</span>
                </motion.li>
              ))}
            </ul>

            {/* Added Section for Materials */}
            {(() => {
              const modMaterial = batchMaterials.find(m => m.moduleName === section.level || section.level.includes(m.moduleName));
              if (modMaterial) {
                return (
                  <div className="ct-material-box">
                    <div className="ct-mat-header">
                      <FileText size={14} />
                      <span>Study Resources</span>
                    </div>
                    <div className="ct-mat-content">
                      <span className="ct-mat-name">{modMaterial.fileName}</span>
                      <button 
                        className="ct-mat-download"
                        onClick={() => window.open(modMaterial.fileUrl, '_blank')}
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                );
              }
              return (
                <div className="ct-material-box pending">
                  <div className="ct-mat-header">
                    <Clock size={14} />
                    <span>Resources Coming Soon</span>
                  </div>
                </div>
              );
            })()}

            <button className="ct-enroll-btn">Unlock {section.level}</button>
          </motion.div>
        ))}
      </div>

      <div className="ct-detailed-info">
        <div className="ct-info-row">
          <motion.div className="ct-info-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="ct-card-header">
              <FileText className="ct-hdr-icon" />
              <h3>Course Overview</h3>
            </div>
            <p className="ct-overview-text">{overview}</p>
          </motion.div>

          <motion.div className="ct-info-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="ct-card-header">
              <Target className="ct-hdr-icon" />
              <h3>Objectives</h3>
            </div>
            <ul className="ct-list">
              {objectives.map((obj, i) => (
                <li key={i}><ChevronRight size={16} className="ct-list-arrow"/> {obj}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="ct-info-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="ct-card-header">
              <CheckCircle className="ct-hdr-icon" />
              <h3>Learning Outcomes</h3>
            </div>
            <ul className="ct-list">
              {outcomes.map((out, i) => (
                 <li key={i}><ChevronRight size={16} className="ct-list-arrow"/> {out}</li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div className="ct-syllabus-section" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="ct-section-title">
            <Calendar className="ct-section-icon" />
            <h2>Curriculum Roadmap</h2>
          </div>
          <div className="ct-syllabus-grid">
            {syllabus.map((mod, i) => (
              <div key={i} className="ct-syllabus-card">
                <div className="ct-week-badge">{mod.week}</div>
                <h4>{mod.title}</h4>
                <p>{mod.content}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="ct-capstone-section" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <div className="ct-section-title">
            <Briefcase className="ct-section-icon" />
            <h2>Real-Time Capstone Projects</h2>
          </div>
          <div className="ct-capstone-grid">
            {capstoneProjects.map((proj, i) => (
              <div key={i} className="ct-capstone-card">
                <div className="ct-capstone-icon"><Star size={24} /></div>
                <div>
                  <h4>{proj.title}</h4>
                  <p>{proj.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseTopics;
