import db from "../config/firebase.js";

const studentsRef = db.ref("students");
const enrollmentsRef = db.ref("enrollments");

/**
 * @desc Save student test results
 * @route POST /api/student/test-results
 */
export const saveTestResult = async (req, res) => {
  try {
    const { testType, scores } = req.body;
    let studentId = req.user?.id; 
    const email = req.user?.email;

    console.log(`[saveTestResult] Attempting save for: ${email || "unknown email"}, ID: ${studentId || "unknown ID"}`);
    console.log(`[saveTestResult] Data: type=${testType}, scores=`, scores);

    if (!testType || !scores) {
      console.warn("[saveTestResult] Missing testType or scores");
      return res.status(400).json({ success: false, message: "testType and scores are required" });
    }

    // If ID is not in token, look up by email
    if (!studentId && email) {
      console.log(`[saveTestResult] No ID in token, searching by email: ${email}`);
      const studentSnap = await studentsRef.orderByChild("email").equalTo(email).once("value");
      if (studentSnap.exists()) {
        studentSnap.forEach(child => { studentId = child.key; });
      }
    }

    if (!studentId) {
      console.error("[saveTestResult] Student ID not found in token or database");
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const studentRef = studentsRef.child(studentId);

    const updates = {};
    if (testType === "foundational") {
      updates["testResults/aptitude"] = scores.aptitude || 0;
      updates["testResults/reasoning"] = scores.reasoning || 0;
      updates["testResults/communication"] = scores.communication || 0;
      updates["testResults/foundationalCompleted"] = true;
    } else if (testType === "core") {
      updates["testResults/coreTechnical"] = scores.coreTechnical || 0;
      updates["testResults/coreCompleted"] = true;
    } else {
      return res.status(400).json({ success: false, message: "Invalid testType" });
    }

    await studentRef.update(updates);

    res.status(200).json({ success: true, message: "Test results saved successfully" });
  } catch (error) {
    console.error("[saveTestResult] Error:", error);
    res.status(500).json({ success: false, message: error.message, error: error.message });
  }
};

/**
 * @desc Get all student results (Admin only)
 * @route GET /api/student/admin/results
 */
export const getStudentResults = async (req, res) => {
  try {
    const snapshot = await studentsRef.once("value");
    const studentsData = snapshot.val() || {};

    const results = Object.entries(studentsData).map(([id, data]) => {
      const results = data.testResults || {};
      const aptitude = results.aptitude || 0;
      const reasoning = results.reasoning || 0;
      const communication = results.communication || 0;
      const coreTechnical = results.coreTechnical || null;
      const foundationalCompleted = results.foundationalCompleted || false;
      const coreCompleted = results.coreCompleted || false;

      return {
        id,
        name: data.fullname || data.fullName || data.username || "N/A",
        email: data.email,
        aptitude,
        reasoning,
        communication,
        overallScore: aptitude + reasoning + communication,
        coreTechnical: coreCompleted ? coreTechnical : null,
        foundationalCompleted,
        coreCompleted
      };
    });

    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error("Get Student Results Error:", error);
    res.status(500).json({ success: false, message: error.message, error: error.message });
  }
};

/**
 * @desc Get current student results
 * @route GET /api/student/my-results
 */
export const getMyResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    const email = req.user.email;

    console.log(`[getMyResults] Fetching results for ID: ${studentId}, Email: ${email}`);

    let finalId = studentId;
    if (!finalId) {
      console.log(`[getMyResults] No ID in token, searching by email: ${email}`);
      const snapshot = await studentsRef.orderByChild("email").equalTo(email).once("value");
      if (snapshot.exists()) {
        snapshot.forEach(child => { finalId = child.key; });
      }
    }

    if (!finalId) {
      console.warn(`[getMyResults] Student not found for email: ${email}`);
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const snapshot = await studentsRef.child(finalId).once("value");
    const data = snapshot.val();
    
    if (!data) {
      console.warn(`[getMyResults] Student data is null for ID: ${finalId}`);
      return res.status(404).json({ success: false, message: "Student data not found" });
    }

    console.log(`[getMyResults] Success. testResults:`, data.testResults || "None");
    res.status(200).json({ 
      success: true, 
      testResults: data.testResults || {} 
    });
  } catch (error) {
    console.error("[getMyResults] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Enroll student in a course
 * @route POST /api/student/enroll/:courseId
 */
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const email = req.user?.email;

    console.log(`[enrollInCourse] Request for course: ${courseId} from user: ${email}`);

    if (!email) {
      console.error("[enrollInCourse] Unauthorized: No email in token");
      return res.status(401).json({ error: "Unauthorized: No email in token" });
    }

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const sanitizedEmail = email.trim().toLowerCase().replace(/\./g, ",");
    
    // Add courseId to student's enrollment list
    await enrollmentsRef.child(sanitizedEmail).child(courseId).set({
      enrolledAt: new Date().toISOString(),
      status: "active"
    });

    console.log(`[enrollInCourse] Successfully enrolled ${email} in ${courseId}`);
    res.status(200).json({ message: "Enrolled successfully", courseId });
  } catch (error) {
    console.error("[enrollInCourse] Error:", error);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
};

/**
 * @desc Get all enrolled courses for a student
 * @route GET /api/student/enrolled-courses
 */
export const getEnrolledCourses = async (req, res) => {
  try {
    const email = req.user?.email;
    console.log(`[getEnrolledCourses] Fetching for user: ${email}`);

    if (!email) {
      console.error("[getEnrolledCourses] Unauthorized: No email in token");
      return res.status(401).json({ error: "Unauthorized: No email in token" });
    }
    const sanitizedEmail = email.trim().toLowerCase().replace(/\./g, ",");

    const snapshot = await enrollmentsRef.child(sanitizedEmail).once("value");
    const data = snapshot.val() || {};
    
    // Return just the keys (course IDs)
    const enrolledIds = Object.keys(data);
    
    console.log(`[getEnrolledCourses] Found ${enrolledIds.length} courses for ${email}`);
    res.status(200).json(enrolledIds);
  } catch (error) {
    console.error("[getEnrolledCourses] Error:", error);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
};
