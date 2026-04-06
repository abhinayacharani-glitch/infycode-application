// student-auth/utils/validation.js
// Mirrors trainer-auth/utils/validation.js

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  const minLength  = password.length >= 8;
  const hasUpper   = /[A-Z]/.test(password);
  const hasNumber  = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return {
    isValid: minLength && hasUpper && hasNumber && hasSpecial,
    errors:  { minLength, hasUpper, hasNumber, hasSpecial },
  };
};

export const validateFullName = (name) => name.trim().length >= 3;

export const validatePhone = (phone) => /^\d{10}$/.test(phone);
