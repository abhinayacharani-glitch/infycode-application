import { useEffect } from 'react';

/**
 * Custom hook to intercept the browser's back button/navigation.
 * When a user tries to go back, it pushes the state back and calls the callback.
 * Useful for showing "Are you sure you want to logout?" modals.
 */
export const useNavigationLock = (isActive, onBackAttempt) => {
  useEffect(() => {
    if (!isActive) return;

    // Push a dummy state to the history to "trap" the back button
    window.history.pushState(null, null, window.location.pathname);

    const handlePopState = (event) => {
      // Re-push the state to prevent actual navigation
      window.history.pushState(null, null, window.location.pathname);
      
      // Trigger the custom modal
      if (onBackAttempt) {
        onBackAttempt();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isActive, onBackAttempt]);
};
