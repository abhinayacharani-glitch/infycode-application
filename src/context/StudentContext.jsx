import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStudentQueriesAPI, getStudentProfile } from '../services/api';

const StudentContext = createContext();

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  const [studentQueries, setStudentQueries] = useState([]);
  const [unreadQueryCount, setUnreadQueryCount] = useState(0);
  const [loadingQueries, setLoadingQueries] = useState(false);
  const [studentData, setStudentData] = useState({});

  const fetchStudentQueries = async () => {
    setLoadingQueries(true);
    try {
      const res = await getStudentQueriesAPI();
      if (res.success && res.queries) {
        setStudentQueries(res.queries);
        const unread = res.queries.filter(q => q.readByStudent === false && q.solution).length;
        setUnreadQueryCount(unread);
      }
    } catch (err) {
      console.error('[StudentContext] fetchStudentQueries error:', err);
    } finally {
      setLoadingQueries(false);
    }
  };

  const fetchStudentData = async () => {
    try {
      const res = await getStudentProfile();
      if (res.success && res.profile) {
        setStudentData(res.profile);
      }
    } catch (err) {
      console.error('[StudentContext] fetchStudentData error:', err);
    }
  };

  useEffect(() => {
    // Only fetch if a student is logged in
    const userString = localStorage.getItem('loggedUser') || localStorage.getItem('user');
    if (userString) {
      fetchStudentQueries();
      fetchStudentData();

      // Poll queries every 30 seconds for real-time notifications
      const interval = setInterval(fetchStudentQueries, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <StudentContext.Provider
      value={{
        studentQueries,
        unreadQueryCount,
        loadingQueries,
        studentData,
        fetchStudentQueries,
        fetchStudentData,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
