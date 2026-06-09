/**
 * CourseContext.jsx
 * Provides admin-published courses (from Firebase via backend API)
 * to the entire application so that the homepage, student dashboards,
 * and external course-details pages always reflect the latest data.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getAllCourses } from '../services/api';

const CourseContext = createContext();

export const useCourseContext = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourseContext must be used inside <CourseProvider>');
  return ctx;
};

export const CourseProvider = ({ children }) => {
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const loadCourses = useCallback(async () => {
    try {
      const data = await getAllCourses();
      // Normalise: every admin course gets a `courseId` equal to its Firebase `id`
      const normalised = (data.courses || []).map(c => ({
        ...c,
        courseId: c.id,           // make courseId available for enroll calls
        category: c.category || 'Development',
        level: c.level || 'Beginner',
        image: c.imageUrl || '',
        trainer: c.instructor || c.trainer || 'Instructor',
        rating: c.rating || 4.5,
        students: c.students || '0',
        badge: c.badge || 'NEW',
        color: '#2563eb',
        duration: c.duration || '3 Months',
        startDate: c.startDate || 'Upcoming',
      }));
      setPublishedCourses(normalised);
    } catch (err) {
      console.error('[CourseContext] Failed to load courses:', err.message);
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return (
    <CourseContext.Provider value={{ publishedCourses, loadingCourses, refreshCourses: loadCourses }}>
      {children}
    </CourseContext.Provider>
  );
};
