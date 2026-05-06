import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTrainerProfileAPI, updateTrainerProfileAPI, getPendingCounsellingCountAPI } from '../services/api';
import { io } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


const TrainerContext = createContext();

export const useTrainer = () => {
  const context = useContext(TrainerContext);
  if (!context) {
    throw new Error('useTrainer must be used within a TrainerProvider');
  }
  return context;
};

export const TrainerProvider = ({ children }) => {
  const [trainerData, setTrainerData] = useState(() => {
    const savedUser = localStorage.getItem('user');
    const savedLoggedUser = localStorage.getItem('loggedUser');
    const data = JSON.parse(savedUser || savedLoggedUser || '{}');
    return data;
  });

  const [profileImage, setProfileImage] = useState(() => {
    // Check if it's already in the userData object or separate key
    const savedUser = localStorage.getItem('user');
    const savedLoggedUser = localStorage.getItem('loggedUser');
    const userData = JSON.parse(savedUser || savedLoggedUser || '{}');

    return userData.profileImage || localStorage.getItem('trainerProfileImage') || null;
  });

  const [pendingCounsellingCount, setPendingCounsellingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [batchNotificationCount, setBatchNotificationCount] = useState(0);
  
  const fetchTrainerNotifications = async () => {
    try {
      const { getTrainerNotificationsAPI } = await import('../services/api');
      const res = await getTrainerNotificationsAPI();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching trainer notifications:", error);
    }
  };

  useEffect(() => {
    const batchUnread = (notifications || []).filter(n => 
      !n.read && 
      (n.title?.toLowerCase().includes('batch') || n.text?.toLowerCase().includes('batch'))
    );
    setBatchNotificationCount(batchUnread.length);
  }, [notifications]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch Profile
        const profileRes = await getTrainerProfileAPI();
        if (profileRes.success && profileRes.profile) {
          setTrainerData(prev => {
            const updated = { ...prev, ...profileRes.profile };
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updated }));
            return updated;
          });
          if (profileRes.profile.profileImage) {
            setProfileImage(profileRes.profile.profileImage);
            localStorage.setItem('trainerProfileImage', profileRes.profile.profileImage);
          }
        }

        // Fetch Pending Counselling Count
        const countRes = await getPendingCounsellingCountAPI();
        if (countRes.success) {
          setPendingCounsellingCount(countRes.count);
        }
      } catch (error) {
        console.error("Error fetching trainer initial data:", error);
      }
    };

    fetchInitialData();
    fetchTrainerNotifications();

    // ─── Socket.io Integration ─────────────────────────────────────────────
    const socket = io(API_BASE_URL);

    if (trainerData?.id || trainerData?._id) {
      const trainerId = trainerData.id || trainerData._id;
      socket.emit("join_trainer_room", trainerId);

      socket.on("NEW_COUNSELLING_ASSIGNED", (data) => {
        console.log("[Socket] New counselling session assigned:", data);
        setPendingCounsellingCount(prev => prev + 1);
      });

      socket.on("COUNSELLING_STATUS_UPDATED", (data) => {
        console.log("[Socket] Counselling status updated:", data);
        // Refresh count from API to be safe
        getPendingCounsellingCountAPI().then(res => {
          if (res.success) setPendingCounsellingCount(res.count);
        });
      });

      socket.on("NEW_NOTIFICATION", () => {
        console.log("[Socket] New notification received, refreshing...");
        fetchTrainerNotifications();
      });

      // Listen for batch specific updates if any
      socket.on("BATCH_UPDATED", () => {
        fetchTrainerNotifications();
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [trainerData?.id, trainerData?._id]);


  const updateTrainerProfile = async (newData, newImage) => {
    // 1. Update UI state immediately (optimistic update)
    setTrainerData(prev => {
      const updated = { ...prev, ...(newData || {}) };

      if (newImage !== undefined) {
        updated.profileImage = newImage;
        setProfileImage(newImage);
        if (newImage) {
          localStorage.setItem('trainerProfileImage', newImage);
        } else {
          localStorage.removeItem('trainerProfileImage');
        }
      }

      // Ensure we keep the token from the existing storage if it's not in updated
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const finalUser = { ...currentUser, ...updated };
      localStorage.setItem('user', JSON.stringify(finalUser));

      return updated;
    });

    try {
      const payload = { ...(newData || {}) };
      if (newImage !== undefined) payload.profileImage = newImage;

      const response = await updateTrainerProfileAPI(payload);
      if (response.success && response.profile) {
        // Sync state with the actual data from DB
        setTrainerData(prev => {
          const updated = { ...prev, ...response.profile, role: "trainer" };
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updated }));
          return updated;
        });
        return response;
      } else {
        throw new Error(response.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating trainer profile in backend:", error);
      throw error;
    }
  };

  const value = {
    trainerData,
    profileImage,
    updateTrainerProfile,
    pendingCounsellingCount,
    setPendingCounsellingCount,
    notifications,
    setNotifications,
    batchNotificationCount,
    setBatchNotificationCount,
    fetchTrainerNotifications
  };


  return (
    <TrainerContext.Provider value={value}>
      {children}
    </TrainerContext.Provider>
  );
};
