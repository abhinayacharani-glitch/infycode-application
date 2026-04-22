/**
 * api.js — Centralized API service for InfyCode frontend
 * Base URL is read from VITE_API_BASE_URL (set in .env)
 * Merged version: Includes advanced Auth (Student/Trainer/Admin) + Course Management
 */

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                (isLocalhost ? 'http://localhost:5000' : 'https://infycode-application.onrender.com');

/**
 * Internal helper — wraps fetch + JSON parsing + error extraction
 */
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // Backend returns either { message } or { error }
    throw new Error(data.message || data.error || 'Something went wrong. Please try again.');
  }

  return data;
};

// ─────────────────────────────────────────────
// UNIFIED LOGIN  (admin / trainer / student)
// ─────────────────────────────────────────────

/**
 * POST /api/login
 * Single endpoint that resolves role by email:
 *   admin@charani.in           → role: "admin"
 *   *@trainer.in               → role: "trainer"
 *   anything else              → role: "student"
 * @returns {{ success, role, token, email, fullName, message }}
 */
export const unifiedLogin = (email, password) =>
  request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// ─────────────────────────────────────────────
// ADMIN AUTH
// ─────────────────────────────────────────────

/**
 * POST /api/login  (admin credentials)
 * Alias kept so AdminLogin.jsx import continues to work without changes.
 * @returns {{ success, role, token, email, fullName }}
 */
export const adminLogin = (email, password) =>
  request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

/**
 * Admin register — not used (admin is seeded; kept for API completeness)
 */
export const adminRegister = (fullName, email, phone, password, confirmPassword) =>
  request('/api/admin/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, phone, password, confirmPassword }),
  });

/**
 * GET /api/admin/stats
 * Retrieves live Firebase stats for the dashboard.
 */
export const getAdminStats = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/admin/stats', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

/**
 * POST /api/admin/batches
 * Creates a new batch record.
 */
export const createBatch = (batchData) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/admin/batches', {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify(batchData),
  });
};

// ─────────────────────────────────────────────
// STUDENT AUTH
// ─────────────────────────────────────────────

/**
 * POST /api/login  (student credentials)
 * Alias kept so student Login.jsx import continues to work without changes.
 */
export const studentLogin = (email, password) =>
  request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

/**
 * POST /api/student/register
 * @param {string} fullname
 * @param {string} email
 * @param {string} phno
 * @param {string} password
 * @param {string} confirmPassword
 */
export const studentRegister = (fullname, email, phno, password, confirmPassword) =>
  request('/api/student/register', {
    method: 'POST',
    body: JSON.stringify({ fullname, email, phno, password, confirmPassword }),
  });


/**
 * POST /api/password/forgot-password
 * (For Student Password Reset)
 */
export const studentForgotPassword = (email) =>
  request('/api/password/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email, role: 'student' }),
  });

/**
 * POST /api/password/verify-otp
 * (For Student Password Reset)
 */
export const studentVerifyResetOTP = (email, otp) =>
  request('/api/password/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp, role: 'student' }),
  });

/**
 * POST /api/auth/verify-registration-otp
 * (For Student Registration Verification)
 */
export const studentVerifyRegistrationOTP = (email, otp) =>
  request('/api/auth/verify-registration-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp, role: 'student' }),
  });


/**
 * POST /api/password/reset-password
 * (For Student Password Reset)
 */
export const studentResetPassword = (token, newPassword, confirmPassword) =>
  request('/api/password/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });


// ─────────────────────────────────────────────
// TRAINER AUTH
// ─────────────────────────────────────────────

/**
 * POST /api/login  (trainer credentials — email must end with @trainer.in)
 * Alias kept so trainer Login.jsx import continues to work without changes.
 * @returns {{ success, role, token, fullName, email }}
 */
export const trainerLogin = (email, password) =>
  request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

/**
 * POST /api/trainer/register
 * Email MUST end with @trainer.in.
 * DEV MODE: registration completes immediately — no real OTP validation.
 * @returns {{ success, message, email, trainerId }}
 */
export const trainerRegister = (fullName, email, phone, password, confirmPassword) =>
  request('/api/trainer/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, phone, password, confirmPassword }),
  });

/**
 * POST /api/trainer/verify-otp
 * DEV MODE: always returns success regardless of otp value.
 */
export const trainerVerifyOtp = (email, otp) =>
  request('/api/trainer/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });

// ─────────────────────────────────────────────
// PASSWORD RESET FLOW  (shared — admin & trainer)
// Backend checks both "admins" and "trainers" collections
// ─────────────────────────────────────────────

/**
 * POST /api/password/forgot-password
 * Generates + emails a 6-digit OTP (5-minute expiry).
 * Also used as "resend OTP" — calling it again replaces the previous OTP.
 * @returns {{ message }}
 */
export const sendOTP = (email, role) =>
  request('/api/password/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });

/**
 * POST /api/password/verify-otp
 * Validates the OTP and returns a short-lived reset token (15 minutes).
 * @returns {{ message, token }}  ← use `token` in resetPassword()
 */
export const verifyOTP = (email, otp, role) =>
  request('/api/password/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp, role }),
  });

/**
 * POST /api/password/reset-password
 * Updates the user's password using the token issued by verifyOTP.
 * @returns {{ message }}
 */
export const resetPassword = (token, newPassword, confirmPassword) =>
  request('/api/password/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });

// ─────────────────────────────────────────────
// REGISTRATION OTP FLOW  (admin & trainer)
// ─────────────────────────────────────────────

/**
 * POST /api/auth/verify-registration-otp
 */
export const verifyRegistrationOTP = (email, otp, role) =>
  request('/api/auth/verify-registration-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp,  role }),
  });

/**
 * POST /api/auth/resend-registration-otp
 * Handles both object { email, role } and separate arguments (email, role)
 */
export const resendRegistrationOTP = (emailOrObj, role) => {
  const payload = typeof emailOrObj === 'object' 
    ? emailOrObj 
    : { email: emailOrObj, role };
    
  return request('/api/auth/resend-registration-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

// ─────────────────────────────────────────────
// COURSES
// ─────────────────────────────────────────────

/** Helper to get the stored auth token */
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return { Authorization: `Bearer ${user.token || ''}` };
};

/**
 * POST /api/courses
 * Creates (publishes) a new course.
 * @param {{ title, description, instructor, category, duration, level, imageUrl }} courseData
 * @returns {{ message, course }}
 */
export const createCourse = (courseData) =>
  request('/api/courses', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(courseData),
  });

/**
 * GET /api/courses
 * Retrieves all published courses (newest first).
 * @returns {{ courses: Course[] }}
 */
export const getAllCourses = () =>
  request('/api/courses', {
    headers: getAuthHeader(),
  });

/**
 * GET /api/courses/:id
 * Retrieves a single course by Firebase key.
 * @returns {{ course: Course }}
 */
export const getCourseById = (id) =>
  request(`/api/courses/${id}`, {
    headers: getAuthHeader(),
  });

/**
 * PUT /api/courses/:id
 * Updates allowed fields on an existing course.
 * @param {string} id — Firebase key
 * @param {{ title?, description?, instructor?, category?, duration?, level?, imageUrl? }} fields
 * @returns {{ message, course }}
 */
export const updateCourse = (id, fields) =>
  request(`/api/courses/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(fields),
  });

/**
 * DELETE /api/courses/:id
 * Permanently removes a course from Firebase.
 * @returns {{ message }}
 */
export const deleteCourse = (id) =>
  request(`/api/courses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });

/**
 * PUT /api/courses/:id/like
 * Toggles the like status and count on a course.
 * @returns {{ message, isLiked, likes }}
 */
export const toggleCourseLike = (id) =>
  request(`/api/courses/${id}/like`, {
    method: 'PUT',
    headers: getAuthHeader(),
  });

// ─────────────────────────────────────────────
// DASHBOARDS
// ─────────────────────────────────────────────

export const getAdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/admin/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

export const getTrainerDashboard = () => {
  const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/trainer/dashboard', {
    method: 'GET',
    headers: { Authorization: `Bearer ${loggedUser.token || ''}` },
  });
};