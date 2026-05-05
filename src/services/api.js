/**
 * api.js — Centralized API service for InfyCode frontend
 * Base URL is read from VITE_API_BASE_URL (set in .env)
 * Merged version: Includes advanced Auth (Student/Trainer/Admin) + Course Management + Test Results
 */

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const rawApiUrl = import.meta.env.VITE_API_BASE_URL ||
  (isLocalhost ? 'http://localhost:5000' : 'https://infycode-application.onrender.com');

const BASE_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

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

/**
 * POST /api/admin/move-students
 * Moves selected students to a batch.
 */
export const moveStudentsToBatchAPI = (batchId, studentIds) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/admin/move-students', {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify({ batchId, studentIds }),
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

export const markAllStudentResultsAsSeenAPI = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/admin/student-results/mark-seen', {
    method: 'PUT',
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

/**
 * GET /api/student/profile
 * Retrieves the current student's full profile.
 */
export const getStudentProfile = () => {
  const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('loggedUser') || '{}');
  return request('/api/student/profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

/**
 * PUT /api/student/profile
 * Updates student profile fields.
 */
export const updateStudentProfile = (profileData) => {
  const user = JSON.parse(localStorage.getItem('user') || localStorage.getItem('loggedUser') || '{}');
  return request('/api/student/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify(profileData),
  });
};

/**
 * Alias for Profile.jsx compatibility
 */
export const getMyResults = getStudentMyResults;


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

export const getTrainerBatchesAPI = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/trainer/batches', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

// ─────────────────────────────────────────────
// TRAINER NOTIFICATIONS
// ─────────────────────────────────────────────

/** GET /api/trainer/notifications — fetch all notifications for the logged-in trainer */
export const getTrainerNotificationsAPI = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/trainer/notifications', {
    method: 'GET',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};
/** PUT /api/trainer/notifications/mark-read — mark one (id) or all as read */
export const markTrainerNotificationsReadAPI = (id = null) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/trainer/notifications/mark-read', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify(id ? { id } : {}),
  });
};

/** DELETE /api/trainer/notifications/:id — remove a single notification */
export const deleteTrainerNotificationAPI = (id) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request(`/api/trainer/notifications/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

/** POST /api/trainer/notifications — send a notification to a trainer */
export const sendTrainerNotificationAPI = (payload) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/trainer/notifications', {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify(payload),
  });
};

/** POST /api/trainer/notifications/seed — seed sample notifications (dev helper) */
export const seedTrainerNotificationsAPI = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request('/api/trainer/notifications/seed', {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

export const startBatchAPI = (firebaseId) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request(`/api/trainer/batches/${firebaseId}/start`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

export const adminStartBatchAPI = (firebaseId) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request(`/api/admin/start-batch/${firebaseId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${user.token || ''}` },
  });
};

// ─────────────────────────────────────────────
// TRAINER APPLICATION WORKFLOW
// ─────────────────────────────────────────────

/**
 * POST /api/trainer/apply (public)
 */
export const applyToBecomeTrainer = (formData) =>
  request('/api/trainer/apply', {
    method: 'POST',
    body: JSON.stringify(formData),
  });

/**
 * PUT /api/admin/trainers/:id/status (protected)
 */
export const updateTrainerApplicationStatusAPI = (id, action) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return request(`/api/admin/trainers/${id}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${user.token || ''}` },
    body: JSON.stringify({ action }),
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
    body: JSON.stringify({ email, otp, role }),
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

// ─────────────────────────────────────────────
// SYLLABUSES
// ─────────────────────────────────────────────

export const createSyllabus = (syllabusData) =>
  request('/api/syllabuses', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(syllabusData),
  });

export const getAllSyllabuses = () =>
  request('/api/syllabuses', {
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

export const getStudentBatchesAPI = () =>
  request('/api/student/my-batches', {
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

export const updateCounsellingStatusAPI = (bookingId, status) =>
  request('/api/counselling/update-status', {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify({ bookingId, status }),
  });

// ─────────────────────────────────────────────
// CALENDAR
// ─────────────────────────────────────────────

export const getCalendarEventsAPI = () =>
  request('/api/calendar/events', {
    headers: getAuthHeader(),
  });

export const createCalendarEventAPI = (eventData) =>
  request('/api/calendar/events', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(eventData),
  });

export const updateCalendarEventAPI = (id, eventData) =>
  request(`/api/calendar/events/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(eventData),
  });

export const deleteCalendarEventAPI = (id) =>
  request(`/api/calendar/events/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });

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

export const getBatchStudentsAPI = (batchId) =>
  request(`/api/trainer/batches/${batchId}/students`, {
    headers: getAuthHeader(),
  });

export const getTrainerQueriesAPI = () =>
  request('/api/trainer/queries', {
    headers: getAuthHeader(),
  });

export const getQueryByIdAPI = (queryId) =>
  request(`/api/trainer/queries/${queryId}`, {
    headers: getAuthHeader(),
  });


export const solveTrainerQueryAPI = (queryId, solutionData) =>
  request(`/api/trainer/queries/${queryId}/solve`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify(solutionData),
  });

export const markQueryReadByTrainerAPI = (queryId) =>
  request(`/api/trainer/queries/${queryId}/read`, {
    method: 'PUT',
    headers: getAuthHeader(),
  });

export const getStudentQueriesAPI = () =>
  request('/api/student/queries', {
    headers: getAuthHeader(),
  });

export const createStudentQueryAPI = (queryData) =>
  request('/api/student/queries', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(queryData),
  });

export const markQueryReadByStudentAPI = (queryId) =>
  request(`/api/student/queries/${queryId}/read`, {
    method: 'PUT',
    headers: getAuthHeader(),
  });

export const getPendingCounsellingCountAPI = () =>
  request('/api/counselling/pending-count', {
    headers: getAuthHeader(),
  });

export const updateCounsellingStatusAPI = (bookingId, status) =>
  request('/api/counselling/update-status', {
    method: 'PUT',
    headers: getAuthHeader(),
    body: JSON.stringify({ bookingId, status }),
  });
