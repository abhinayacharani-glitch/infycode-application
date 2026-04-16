import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const updateTrainerProfile = (newData, newImage) => {
    setTrainerData(prev => {
      const updated = { ...prev, ...newData };
      
      // If image is provided, include it in the object
      if (newImage) {
        updated.profileImage = newImage;
        setProfileImage(newImage);
        localStorage.setItem('trainerProfileImage', newImage);
      }
      
      localStorage.setItem('user', JSON.stringify(updated));
      localStorage.setItem('loggedUser', JSON.stringify(updated));
      return updated;
    });
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
