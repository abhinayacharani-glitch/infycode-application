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

    // Set isSeen to false so admin gets a notification
    updates["testResults/isSeen"] = false;

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

    // Return unique, active enrollment IDs
    const enrolledIds = Object.keys(data).filter(id => data[id].status === "active");
    const uniqueIds = [...new Set(enrolledIds)];

    console.log(`[getEnrolledCourses] Found ${uniqueIds.length} active courses for ${email}`);
    res.status(200).json(uniqueIds);
  } catch (error) {
    console.error("[getEnrolledCourses] Error:", error);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
};

/**
 * @desc  Get per-course batch + full trainer details for the logged-in student
 * @route GET /api/student/my-batches
 */
export const getStudentBatches = async (req, res) => {
  try {
    const email = req.user?.email?.toLowerCase();
    const idFromToken = req.user?.id;

    // 1. Resolve student record
    let studentData = null;
    if (idFromToken) {
      const snap = await studentsRef.child(idFromToken).once("value");
      if (snap.exists()) studentData = { id: idFromToken, ...snap.val() };
    }
    if (!studentData && email) {
      const allSnap = await studentsRef.once("value");
      const all = allSnap.val() || {};
      for (const key in all) {
        if (all[key].email?.toLowerCase() === email) {
          studentData = { id: key, ...all[key] };
          break;
        }
      }
    }
    if (!studentData) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // 2. Get batches map: { "Course Name": "batchFirebaseKey" }
    const batchesMap = studentData.batches || {};
    if (Object.keys(batchesMap).length === 0) {
      return res.status(200).json({ success: true, batches: {} });
    }

    // 3. Fetch batch + trainer for each course
    const batchesRef = db.ref("batch");
    const trainersRef = db.ref("trainers");
    const result = {};

    for (const [courseName, batchKey] of Object.entries(batchesMap)) {
      try {
        // Try direct key lookup first (most reliable)
        const directSnap = await batchesRef.child(batchKey).once("value");
        let batchData = null;
        if (directSnap.exists()) {
          batchData = { firebaseKey: batchKey, ...directSnap.val() };
        } else {
          // Fallback: query by batchId field
          const qSnap = await batchesRef.orderByChild("batchId").equalTo(batchKey).once("value");
          if (qSnap.exists()) qSnap.forEach(c => { batchData = { firebaseKey: c.key, ...c.val() }; });
        }
        if (!batchData) continue;

        // 4. Fetch full trainer profile
        const trainerName = batchData.trainerName || batchData.trainer || "";
        let trainerDetails = null;
        if (trainerName) {
          const tSnap = await trainersRef.orderByChild("fullName").equalTo(trainerName).once("value");
          if (tSnap.exists()) {
            tSnap.forEach(c => {
              const t = c.val();
              trainerDetails = {
                name:           t.fullName || t.fullname || trainerName,
                email:          t.email || "",
                phone:          t.phone || t.mobile || "",
                specialization: t.specialization || t.domain || "",
                experience:     t.experience || "",
                profileImage:   t.profileImage || ""
              };
            });
          }
          if (!trainerDetails) {
            trainerDetails = { name: trainerName, email: "", phone: "", specialization: "", experience: "", profileImage: "" };
          }
        }

        // 5. Extract start date/time
        let startDate = "", startTime = "";
        if (batchData.startDateTime) {
          const d = new Date(batchData.startDateTime);
          startDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          startTime = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        } else if (batchData.name && batchData.name.includes(" - ")) {
          startDate = batchData.name.split(" - ").pop();
        }

        result[courseName] = {
          batchId:       batchData.batchId || batchKey,
          batchName:     batchData.name || courseName,
          courseName:    batchData.courseName || batchData.course || courseName,
          courseId:      batchData.courseId || "",
          status:        batchData.status || "Scheduled",
          startDateTime: batchData.startDateTime || "",
          startDate,
          startTime,
          duration:      batchData.duration || "",
          capacity:      batchData.capacity || 30,
          enrolled:      batchData.enrolled || 0,
          liveClassLink: batchData.liveClassLink || batchData.meetLink || "",
          trainer:       trainerDetails
        };
      } catch (err) {
        console.error(`[getStudentBatches] Error for "${courseName}":`, err.message);
      }
    }

    return res.status(200).json({ success: true, batches: result });
  } catch (error) {
    console.error("[getStudentBatches] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStudentProfile = async (req, res) => {
  try {

    const email = req.user?.email?.toLowerCase();
    const idFromToken = req.user?.id;

    if (!email && !idFromToken) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing identity in token" });
    }

    let studentData = null;

    // 1. Try direct ID lookup
    if (idFromToken) {
      const snapshot = await studentsRef.child(idFromToken).once("value");
      if (snapshot.exists()) {
        studentData = { id: idFromToken, ...snapshot.val() };
      }
    }

    // 2. Try email fallback
    if (!studentData && email) {
      const allStudentsSnap = await studentsRef.once("value");
      const allStudents = allStudentsSnap.val() || {};
      for (const key in allStudents) {
        if (allStudents[key].email?.toLowerCase() === email) {
          studentData = { id: key, ...allStudents[key] };
          break;
        }
      }
    }

    if (!studentData) {
      return res.status(404).json({ success: false, message: "Student record not found in database." });
    }

    // Auto-migrate: Generate studentId if missing or non-numeric
    if (!studentData.studentId || isNaN(studentData.studentId)) {
      const snapshot = await studentsRef.once("value");
      const count = snapshot.numChildren();
      // Generate a more robust unique number
      const newStudentId = (1001 + count).toString();

      await studentsRef.child(studentData.id).update({ studentId: newStudentId });
      studentData.studentId = newStudentId;
    }

    res.status(200).json({ success: true, profile: studentData });
  } catch (error) {
    console.error("[getStudentProfile] Error:", error);
    res.status(500).json({ success: false, message: "Database error. Please try again later." });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const email = req.user?.email?.toLowerCase();
    const idFromToken = req.user?.id;
    const body = req.body;

    console.log(`[updateStudentProfile] Called — email: ${email}, id: ${idFromToken}`);

    if (!email && !idFromToken) {
      return res.status(401).json({ success: false, message: "Unauthorized: no identity in token" });
    }

    // ── 1. Resolve student Firebase key ──────────────────────────────────
    let studentId = idFromToken;

    if (!studentId && email) {
      console.log(`[updateStudentProfile] ID not in token, searching by email: ${email}`);
      const snap = await studentsRef.once("value");
      const all = snap.val() || {};
      for (const key in all) {
        const stored = all[key].email?.toLowerCase();
        if (stored === email) { studentId = key; break; }
      }
    }

    if (!studentId) {
      console.error("[updateStudentProfile] Student not found in DB");
      return res.status(404).json({ success: false, message: "Student record not found in database." });
    }

    // ── 2. Build a clean, allowlisted payload ─────────────────────────────
    const ALLOWED = [
      "fullName", "fullname", "phone", "location",
      "dob", "gender", "college", "degree",
      "branch", "passOutYear", "cgpa", "profileImage"
    ];

    const sanitized = {};
    for (const key of ALLOWED) {
      const val = body[key];
      // Only include truthy strings (skip null, undefined, empty string)
      if (val !== undefined && val !== null && val !== "") {
        sanitized[key] = val;
      }
    }

    console.log(`[updateStudentProfile] Saving ${Object.keys(sanitized).length} fields for student ${studentId}`);

    if (Object.keys(sanitized).length === 0) {
      return res.status(200).json({ success: true, message: "No changes to save." });
    }

    // ── 3. Write to Firebase ──────────────────────────────────────────────
    await studentsRef.child(studentId).update(sanitized);

    console.log(`[updateStudentProfile] SUCCESS for student ${studentId}`);
    res.status(200).json({ success: true, message: "Profile updated successfully." });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
};

/**
 * @desc Mark all student test results as seen (Admin only)
 * @route PUT /api/admin/student-results/mark-seen
 */
export const markAllStudentResultsAsSeen = async (req, res) => {
  try {
    const snapshot = await studentsRef.once("value");
    if (!snapshot.exists()) {
      return res.json({ success: true, message: "No students found" });
    }

    const updates = {};
    snapshot.forEach((child) => {
      const student = child.val();
      if (student.testResults && student.testResults.isSeen === false) {
        updates[`${child.key}/testResults/isSeen`] = true;
      }
    });

    if (Object.keys(updates).length > 0) {
      await studentsRef.update(updates);
    }

    res.json({ success: true, message: "All student results marked as seen" });
  } catch (error) {
    console.error("Error marking student results as seen:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

