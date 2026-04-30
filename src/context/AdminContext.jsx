import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createBatch, getAdminStats, getAllCourses,
  createCourse as apiCreateCourse,
  updateCourse as apiUpdateCourse,
  deleteCourse as apiDeleteCourse,
  toggleCourseLike as apiToggleCourseLike,
  getPendingFAQs as apiGetPendingFAQs,
  updateFAQStatus as apiUpdateFAQStatus,
  deleteFAQ as apiDeleteFAQ,
  publishNewFAQ,
  getAdminProfileAPI,
  updateAdminProfileAPI,
  updateTrainerApplicationStatusAPI,
  markAllStudentResultsAsSeenAPI,
  moveStudentsToBatchAPI,
  createSyllabus as apiCreateSyllabus,
  getAllSyllabuses as apiGetAllSyllabuses
} from '../services/api';

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
  const [syllabuses, setSyllabuses] = useState([]);
  const [pendingFAQs, setPendingFAQs] = useState([]);
  const [adminData, setAdminData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return JSON.parse(savedUser || '{}');
  });

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
    pendingCounsellingRequests: 0,
    pendingStudentResults: 0
  });

  // --- ACTIONS ---

  const approveStudent = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: 'Verified' } : s));
  };

  const rejectStudent = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const updateTrainerStatus = async (id, action) => {
    const targetTrainer = trainers.find(t => t.id === id);
    if (!targetTrainer) return;

    const stages = ['Applied', 'Screening', 'Interview', 'Selected', 'Onboarded'];
    let newStatus = targetTrainer.status;
    let newPrevStatus = targetTrainer.prevStatus;

    if (action === 'hold') {
      if (targetTrainer.status === 'Hold') {
        newStatus = targetTrainer.prevStatus || 'Applied';
      } else {
        newPrevStatus = targetTrainer.status;
        newStatus = 'Hold';
      }
    } else if (action === 'reject') {
      newStatus = 'Rejected';
    } else if (action === 'next') {
      const baseStatus = targetTrainer.status === 'Hold' ? (targetTrainer.prevStatus || 'Applied') : targetTrainer.status;
      const currentIndex = stages.indexOf(baseStatus);
      if (currentIndex < stages.length - 1) {
        newStatus = stages[currentIndex + 1];
        newPrevStatus = newStatus;
      }
    }

    // Apply Optimistic Update
    setTrainers(prev => prev.map(t => t.id === id ? { ...t, status: newStatus, prevStatus: newPrevStatus } : t));
    
    if (targetTrainer.status === 'Applied' && newStatus !== 'Applied') {
      setStats(prev => ({
        ...prev,
        trainers: { ...prev.trainers, pending: Math.max(0, prev.trainers.pending - 1) }
      }));
    }

    try {
      // Fire API call in background
      updateTrainerApplicationStatusAPI(id, action).then(() => {
        // Sync full stats silently in the background after success
        fetchDashboardStats();
      }).catch(error => {
        throw error;
      });
    } catch (error) {
      console.error('Error updating trainer status:', error);
      // Revert Optimistic Update on failure
      setTrainers(prev => prev.map(t => t.id === id ? { ...t, status: targetTrainer.status, prevStatus: targetTrainer.prevStatus } : t));
      alert(error.message || 'Failed to update trainer status');
    }
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

  /* --- Course Actions --- */
  const addCourse = async (courseData) => {
    try {
      const data = await apiCreateCourse(courseData);
      setCourses(prev => [data.course, ...prev]);
      fetchDashboardStats();
      return data.course;
    } catch (error) {
      console.error("DEBUG: AdminContext.addCourse failed:", error);
      throw error;
    }
  };

  const updateCourse = async (id, fields) => {
    try {
      const data = await apiUpdateCourse(id, fields);
      setCourses(prev => prev.map(c => c.id === id ? data.course : c));
      return data.course;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  };

  const deleteCourse = async (id) => {
    try {
      await apiDeleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      fetchDashboardStats();
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  };

  const toggleCourseLike = async (id) => {
    try {
      const data = await apiToggleCourseLike(id);
      setCourses(prev => prev.map(c =>
        c.id === id ? { ...c, isLiked: data.isLiked, likes: data.likes } : c
      ));
    } catch (error) {
      console.error("Error toggling like:", error);
      throw error;
    }
  };

  /* --- Syllabus Actions --- */
  const loadSyllabuses = async () => {
    try {
      const data = await apiGetAllSyllabuses();
      setSyllabuses(data.syllabuses || []);
    } catch (error) {
      console.error("Error loading syllabuses:", error);
    }
  };

  const addSyllabus = async (syllabusData) => {
    try {
      const data = await apiCreateSyllabus(syllabusData);
      setSyllabuses(prev => [...prev, data.syllabus]);
      return data.syllabus;
    } catch (error) {
      console.error("Error adding syllabus:", error);
      throw error;
    }
  };

  /* --- FAQ Actions --- */
  const loadPendingFAQs = async () => {
    try {
      const data = await apiGetPendingFAQs();
      const currentPending = data.faqs || [];

      // Check for new questions to add to notifications
      if (currentPending.length > pendingFAQs.length) {
        const newOnes = currentPending.filter(q => !pendingFAQs.find(p => p.id === q.id));
        newOnes.forEach(q => {
          setNotifications(prev => [
            {
              id: Date.now() + Math.random(),
              message: `New FAQ Query from ${q.userName}: ${q.question.substring(0, 30)}...`,
              type: 'info',
              read: false,
              time: 'Just now'
            },
            ...prev
          ]);
        });
      }

      setPendingFAQs(currentPending);
    } catch (error) {
      console.error("Error loading pending FAQs:", error.message);
    }
  };

  const approveFAQ = async (id, answer) => {
    try {
      const faqToApprove = pendingFAQs.find(f => f.id === id);
      if (!faqToApprove) return false;

      // Step 1: Publish to the live node and send email
      // This is the most critical part
      await publishNewFAQ({
        question: faqToApprove.question,
        answer: answer,
        userEmail: faqToApprove.userEmail
      });

      // Step 2: Update status in the original node (try-catch internally so it doesn't block)
      try {
        await apiUpdateFAQStatus(id, { answer, status: 'published' });
      } catch (updateError) {
        console.warn("FAQ published, but failed to update status in original node:", updateError);
        // We continue anyway because the primary goal (publishing) succeeded
      }

      // Step 3: Remove from the UI list
      setPendingFAQs(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (error) {
      console.error("Error approving FAQ:", error);
      throw error;
    }
  };

  const deleteFAQ = async (id) => {
    try {
      await apiDeleteFAQ(id);
      setPendingFAQs(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      throw error;
    }
  };

  const fetchAdminProfile = async () => {
    try {
      const response = await getAdminProfileAPI();
      if (response.success && response.profile) {
        setAdminData(prev => ({ ...prev, ...response.profile }));
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.profile }));
        window.dispatchEvent(new Event('adminProfileUpdate'));
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  const updateAdminProfile = async (newData, newImage) => {
    try {
      const payload = { ...(newData || {}) };
      if (newImage) payload.profileImage = newImage;
      
      const response = await updateAdminProfileAPI(payload);
      if (response.success && response.profile) {
        setAdminData(prev => ({ ...prev, ...response.profile }));
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...response.profile }));
        
        // Notify other components (Sidebar, Topbar) that profile has changed
        window.dispatchEvent(new Event('adminProfileUpdate'));
        
        return response;
      }
    } catch (error) {
      console.error("Error updating admin profile:", error);
      throw error;
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
          pending: apiStats?.pendingTrainers || 0
        },
        coursesCount: apiStats?.coursesCount || 0,
        pendingCounsellingRequests: apiStats?.pendingCounsellingRequests || 0,
        pendingStudentResults: apiStats?.pendingStudentResults || 0
      });

      if (apiStudents) setStudents(apiStudents);
      if (apiTrainers) setTrainers(apiTrainers);
      if (apiBatches) setBatches(apiBatches);
      // NOTE: courses are loaded separately via loadCourses()

      console.log("Frontend: Successfully synchronized with Live Firebase data.");
    } catch (error) {
      console.log("Frontend: Error fetching live dashboard data:", error.message);
    }
  };

  const markAllStudentResultsAsSeen = async () => {
    try {
      if (stats.pendingStudentResults > 0) {
        await markAllStudentResultsAsSeenAPI();
        fetchDashboardStats();
      }
    } catch (error) {
      console.error("Error marking student results as seen:", error);
    }
  };

  const moveStudentsToBatch = async (batchId, studentIds) => {
    try {
      const response = await moveStudentsToBatchAPI(batchId, studentIds);
      if (response.success) {
        fetchDashboardStats();
        return response;
      }
    } catch (error) {
      console.error("Error moving students:", error);
      throw error;
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Frontend: Error loading courses:", error.message);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    loadCourses(); 
    loadSyllabuses();
    loadPendingFAQs();
    fetchAdminProfile();

    const interval = setInterval(() => {
      fetchDashboardStats();
      loadCourses();
      loadSyllabuses();
      loadPendingFAQs();
    }, 30000);
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
    addCourse,
    updateCourse,
    deleteCourse,
    toggleCourseLike,
    fetchDashboardStats,
    pendingFAQs,
    approveFAQ,
    deleteFAQ,
    loadPendingFAQs,
    adminData,
    updateAdminProfile,
    fetchAdminProfile,
    markAllStudentResultsAsSeen,
    moveStudentsToBatch,
    syllabuses,
    addSyllabus,
    loadSyllabuses
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
