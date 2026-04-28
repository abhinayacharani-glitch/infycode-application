/**
 * api.js — Centralized API service for InfyCode frontend
 * Base URL is read from VITE_API_BASE_URL (set in .env)
 * Merged version: Includes advanced Auth (Student/Trainer/Admin) + Course Management + Test Results
 */

const VITE_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const BASE_URL = VITE_API_URL.endsWith('/') ? VITE_API_URL.slice(0, -1) : VITE_API_URL;

console.log(`[API Service] Using BASE_URL: ${BASE_URL}`);

/**
 * Internal helper — wraps fetch + JSON parsing + error extraction
 */
const request = async (endpoint, options = {}) => {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${normalizedEndpoint}`;
  console.log(`[API Request] ${options.method || 'GET'} ${url}`);

  const { headers, ...otherOptions } = options;

  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(headers || {}) },
      ...otherOptions,
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Something went wrong. Please try again.');
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${error.message}`);
    throw error;
  }
};

// ─────────────────────────────────────────────
// UNIFIED LOGIN  (admin / trainer / student)
// ─────────────────────────────────────────────

/**
 * POST /api/login
 * Single endpoint that resolves role by email:
 *   admin@charani.in           → role: "admin"
 *   *@outlook.com               → role: "trainer"
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

export const getAdminProfileAPI = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/admin/profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

export const updateAdminProfileAPI = (profileData) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/admin/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify(profileData),
  });
};

/**
 * GET /api/student/admin/results
 * Retrieves all student test results for the admin dashboard.
 */
export const getAdminStudentResults = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/student/admin/results', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
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

/**
 * POST /api/student/test-results
 * Saves foundational or core test results for the current student.
 */
export const saveStudentTestResults = (testType, scores) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/student/test-results', {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify({ testType, scores }),
  });
};

/**
 * GET /api/student/my-results
 * Retrieves the current student's test results.
 */
export const getStudentMyResults = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/student/my-results', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};


// ─────────────────────────────────────────────
// TRAINER AUTH
// ─────────────────────────────────────────────

/**
 * POST /api/login  (trainer credentials — email must end with @outlook.com)
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
 */
export const trainerRegister = (fullName, email, phone, password, confirmPassword) =>
  request('/api/trainer/register', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, phone, password, confirmPassword }),
  });

/**
 * POST /api/trainer/verify-otp
 */
export const trainerVerifyOtp = (email, otp) =>
  request('/api/trainer/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });

// ─────────────────────────────────────────────
// TRAINER PROFILE
// ─────────────────────────────────────────────

export const getTrainerProfileAPI = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/trainer/profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

export const updateTrainerProfileAPI = (profileData) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/trainer/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify(profileData),
  });
};

// ─────────────────────────────────────────────
// PASSWORD RESET FLOW  (shared — admin & trainer)
// Backend checks both "admins" and "trainers" collections
// ─────────────────────────────────────────────

export const sendOTP = (email, role) =>
  request('/api/password/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });

export const verifyOTP = (email, otp, role) =>
  request('/api/password/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp, role }),
  });

export const resetPassword = (token, newPassword, confirmPassword) =>
  request('/api/password/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword, confirmPassword }),
  });

// ─────────────────────────────────────────────
// REGISTRATION OTP FLOW  (admin & trainer)
// ─────────────────────────────────────────────

export const verifyRegistrationOTP = (email, otp, role) =>
  request('/api/auth/verify-registration-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp,  role }),
  });

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

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return { Authorization: `Bearer ${user.token || ''}` };
};

export const createCourse = (courseData) =>
  request('/api/courses', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(courseData),
  });

export const getAllCourses = () =>
  request('/api/courses', {
    headers: getAuthHeader(),
  });

export const getCourseById = (id) =>
  request(`/api/courses/${id}`, {
    headers: getAuthHeader(),
  });

export const updateCourse = (id, fields) =>
  request(`/api/courses/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(fields),
  });

export const deleteCourse = (id) =>
  request(`/api/courses/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });

export const toggleCourseLike = (id) =>
  request(`/api/courses/${id}/like`, {
    method: 'PUT',
    headers: getAuthHeader(),
  });

export const enrollInCourse = (courseId) =>
  request(`/api/student/enroll/${courseId}`, {
    method: 'POST',
    headers: getAuthHeader(),
  });

export const getEnrolledCourses = () =>
  request('/api/student/enrolled-courses', {
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

// ─────────────────────────────────────────────
// FAQS
// ─────────────────────────────────────────────

export const getPublishedFAQs = () =>
  request('/api/faqs');

export const submitFAQ = (faqData) =>
  request('/api/faqs', {
    method: 'POST',
    body: JSON.stringify(faqData),
  });

export const getPendingFAQs = () =>
  request('/api/faqs/pending', {
    headers: getAuthHeader(),
  });

export const updateFAQStatus = (id, updateData) =>
  request(`/api/faqs/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(updateData),
  });

export const deleteFAQ = (id) =>
  request(`/api/faqs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });

export const publishNewFAQ = (data) =>
  request('/api/faqs/publish', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const getNewPublishedFAQs = () =>
  request('/api/faqs/published', { cache: 'no-store' });

// ─────────────────────────────────────────────
// COUNSELLING
// ─────────────────────────────────────────────

export const bookCounsellingSlot = (bookingData) =>
  request('/api/counselling/book', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(bookingData),
  });

export const getAdminCounsellingRequests = () =>
  request('/api/counselling/requests', {
    headers: getAuthHeader(),
  });

export const assignCounsellingTrainer = (assignmentData) =>
  request('/api/counselling/assign-trainer', {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(assignmentData),
  });

export const getTrainerCounsellingSessions = () =>
  request('/api/counselling/trainer-sessions', {
    headers: getAuthHeader(),
  });

export const getStudentCounsellingSessions = () =>
  request('/api/counselling/student-sessions', {
    headers: getAuthHeader(),
  });
