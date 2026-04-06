export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: minLength && hasUpper && hasNumber && hasSpecial,
    errors: {
      minLength,
      hasUpper,
      hasNumber,
      hasSpecial
    }
  };
};

export const validateFullName = (name) => {
  return name.trim().length >= 3;
};
