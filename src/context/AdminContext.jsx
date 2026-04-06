import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBatch, getAdminStats } from '../services/api';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // --- MOCK DATA ---
  const [students, setStudents] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New student registration: Harvey Specter', type: 'info', read: false, time: '2 mins ago' },
    { id: 2, message: 'Trainer Charlie Brown moved to Interview stage', type: 'success', read: false, time: '1 hour ago' },
    { id: 3, message: 'Batch React Alpha is reaching capacity', type: 'warning', read: true, time: '3 hours ago' },
  ]);

  const [stats, setStats] = useState({
    totalStudents: { pending: 0, verified: 0, assigned: 0 },
    activeBatches: 0,
    trainers: { active: 0, pending: 0 },
    coursesCount: 0,
  });

  // --- ACTIONS ---

  const approveStudent = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'Verified' } : s));
  };

  const rejectStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const updateTrainerStatus = (id, action) => {
    const stages = ['Applied', 'Screening', 'Interview', 'Selected', 'Onboarded'];
    setTrainers(prev => prev.map(t => {
      if (t.id === id) {
        if (action === 'hold') {
          if (t.status === 'Hold') {
            const restoredStatus = t.prevStatus || 'Applied';
            const restoredIndex = stages.indexOf(restoredStatus);
            return { ...t, status: restoredStatus, progress: (restoredIndex / (stages.length - 1)) * 100 };
          } else {
            return { ...t, prevStatus: t.status, status: 'Hold' };
          }
        }
        const baseStatus = t.status === 'Hold' ? (t.prevStatus || 'Applied') : t.status;
        const currentIndex = stages.indexOf(baseStatus);
        const nextIndex = action === 'next' 
          ? Math.min(currentIndex + 1, stages.length - 1) 
          : Math.max(currentIndex - 1, 0);
        return { ...t, status: stages[nextIndex], progress: (nextIndex / (stages.length - 1)) * 100, prevStatus: stages[nextIndex] };
      }
      return t;
    }));
  };

  const toggleCourseStatus = (id) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c));
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addBatch = async (batch) => {
    try {
      const data = await createBatch(batch);
      setBatches(prev => [...prev, data.batch]);
      fetchDashboardStats(); // Refresh stats after creation
    } catch (error) {
      console.error("Error creating batch:", error.message);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const data = await getAdminStats();
      const { stats: apiStats, students: apiStudents, trainers: apiTrainers, batches: apiBatches } = data;
      
      setStats({
        totalStudents: {
          pending: apiStats?.pendingVerifications || 0,
          verified: (apiStats?.totalStudents || 0) - (apiStats?.pendingVerifications || 0),
          assigned: 0
        },
        activeBatches: apiStats?.activeBatches || 0,
        trainers: {
          active: apiStats?.activeTrainers || 0,
          pending: (apiTrainers?.length || 0) - (apiStats?.activeTrainers || 0)
        },
        coursesCount: apiStats?.coursesCount || 3,
      });

      if (apiStudents) setStudents(apiStudents);
      if (apiTrainers) setTrainers(apiTrainers);
      if (apiBatches) setBatches(apiBatches);

      console.log("Frontend: Successfully synchronized with Live Firebase data.");
    } catch (error) {
      console.error("Frontend: Error fetching live dashboard data:", error.message);
    }
  };

  useEffect(() => {
    fetchDashboardStats(); // Fetch on mount

    // Poll for real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    students,
    trainers,
    courses,
    batches,
    notifications,
    stats,
    approveStudent,
    rejectStudent,
    updateTrainerStatus,
    toggleCourseStatus,
    markNotificationRead,
    addBatch,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
