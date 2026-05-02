import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEnrolledCourses } from '../../../services/api';
import { COURSE_MAP } from './data/extraCourses';
import { ALL_COURSES } from '../../../components/Courses/Courses';
import { useCourseContext } from '../../../context/CourseContext';
import { Play, BookOpen } from 'lucide-react';
import { getCourseImage } from '../../../utils/courseUtils';
import './Courses.css';

const getCurrentTopic = (course) => {
  const allTopics = course.modules.flatMap(m => m.topics);
  if (allTopics.length === 0) return null;
  const idx = Math.min(Math.floor((course.progress / 100) * allTopics.length), allTopics.length - 1);
  return allTopics[idx];
};

const EnrolledCourseCard = ({ course, onNavigate, index }) => {
  // Calculate dynamic progress
  const dynamicProgress = (() => {
    const saved = localStorage.getItem(`course_progress_${course.id}`);
    if (!saved) return course.progress || 0;

    const completedSet = new Set(JSON.parse(saved));
    const navList = [];
    course.modules.forEach((m) => {
      m.topics.forEach((t) => {
        navList.push({ type: 'topic_content', id: `topic_content::${m.id}::${t.id}` });
        navList.push({ type: 'topic_assignment', id: `topic_assignment::${m.id}::${t.id}` });
      });
    });
    
    if (navList.length === 0) return course.progress || 0;
    
    const doneCount = Array.from(completedSet).length;
    return Math.round((doneCount / navList.length) * 100);
  })();

  const currentTopic = getCurrentTopic({ ...course, progress: dynamicProgress });
  const courseImage = getCourseImage(course);

  return (
    <motion.div
      className="enrolled-course-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="ecc-header">
        <img src={courseImage} alt={course.title} className="ecc-image" />
      </div>

      <div className="ecc-body">
        <h3 className="ecc-title">{course.title}</h3>
        
        <div className="ecc-progress-wrap">
          <div className="ecc-progress-header">
            <span>Course Progress</span>
            <span className="ecc-progress-percent">{dynamicProgress}%</span>
          </div>
          <div className="ecc-progress-bar">
            <motion.div 
              className="ecc-progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${dynamicProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <div className="ecc-footer">
        <button
          className="ecc-btn ecc-resume-btn"
          onClick={() => {
            if (currentTopic) {
              onNavigate('/student-dashboard/course-explore', { courseId: course.id, topicId: currentTopic.id });
            } else {
              onNavigate('/student-dashboard/course-overview', course.id);
            }
          }}
        >
          <Play size={14} fill="currentColor" />
          <span>Resume</span>
        </button>
        
        <button
          className="ecc-btn ecc-join-btn"
          onClick={() => onNavigate('/student-dashboard/course-overview', course.id)}
        >
          <BookOpen size={14} />
          <span>Join Class</span>
        </button>
      </div>
    </motion.div>
  );
};

const EnrollCourses = ({ onNavigate }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { publishedCourses } = useCourseContext();

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        const data = await getEnrolledCourses();
        const enrolledIds = Array.isArray(data) ? data : (data.enrolledCourses || []);

        const enrolled = [];
        enrolledIds.forEach(id => {
          if (COURSE_MAP[id]) {
            enrolled.push(COURSE_MAP[id]);
          } else {
            const matchedAllCourse = ALL_COURSES.find(c => c.courseId === id);
            if (matchedAllCourse) {
              const matchedMapCourse = Object.values(COURSE_MAP).find(c => c.title === matchedAllCourse.title);
              if (matchedMapCourse) {
                enrolled.push(matchedMapCourse);
              } else {
                enrolled.push({ ...matchedAllCourse, id: matchedAllCourse.courseId, modules: [] });
              }
            } else {
              const matchedPublishedCourse = publishedCourses.find(c => c.courseId === id);
              if (matchedPublishedCourse) {
                 enrolled.push({ ...matchedPublishedCourse, id: matchedPublishedCourse.courseId, modules: [] });
              }
            }
          }
        });

        setEnrolledCourses(enrolled);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };
    if (publishedCourses) fetchEnrolled();
  }, [publishedCourses]);

  if (loading) {
    return (
      <div className="enroll-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div className="loader" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="enroll-page">
      <header className="page-header-centered">
        <h2>Enrolled Courses</h2>
        <p>Keep track of your progress and continue your learning journey where you left off.</p>
      </header>
      
      <div className="enroll-course-grid">
        <div className="enroll-cards-wrapper">
          {enrolledCourses.length > 0 ? (
            enrolledCourses.map((course, index) => (
              <EnrolledCourseCard 
                key={course.id} 
                course={course} 
                onNavigate={onNavigate} 
                index={index}
              />
            ))
          ) : (
            <div className="no-courses-container">
              <h2 className="no-courses-title">No Enrolled Courses Found</h2>
              <p className="no-courses-text">Explore our directory and start your learning journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollCourses;