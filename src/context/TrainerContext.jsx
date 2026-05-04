import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTrainerProfileAPI, updateTrainerProfileAPI } from '../services/api';

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getTrainerProfileAPI();
        if (response.success && response.profile) {
          setTrainerData(prev => {
            const updated = { ...prev, ...response.profile };
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updated }));
            return updated;
          });
          if (response.profile.profileImage) {
            setProfileImage(response.profile.profileImage);
            localStorage.setItem('trainerProfileImage', response.profile.profileImage);
          }
        }
      } catch (error) {
        console.error("Error fetching trainer profile:", error);
      }
    };
    fetchProfile();
  }, []);

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
    updateTrainerProfile
  };

  return (
    <TrainerContext.Provider value={value}>
      {children}
    </TrainerContext.Provider>
  );
};
