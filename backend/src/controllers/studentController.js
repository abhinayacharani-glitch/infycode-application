import db from "../config/firebase.js";

const studentsRef = db.collection("students");
const enrollmentsRef = db.collection("enrollments");

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
      const studentSnap = await studentsRef.where("email", "==", email).limit(1).get();
      if (!studentSnap.empty) {
        studentId = studentSnap.docs[0].id;
      }
    }

    if (!studentId) {
      console.error("[saveTestResult] Student ID not found in token or database");
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const studentDocRef = studentsRef.doc(studentId);

    const updates = {};
    if (testType === "foundational") {
      updates["testResults.aptitude"] = scores.aptitude || 0;
      updates["testResults.reasoning"] = scores.reasoning || 0;
      updates["testResults.communication"] = scores.communication || 0;
      updates["testResults.foundationalCompleted"] = true;
    } else if (testType === "core") {
      updates["testResults.coreTechnical"] = scores.coreTechnical || 0;
      updates["testResults.coreCompleted"] = true;
    } else {
      return res.status(400).json({ success: false, message: "Invalid testType" });
    }

    // Set isSeen to false so admin gets a notification
    updates["testResults.isSeen"] = false;

    await studentDocRef.update(updates);

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
    const snapshot = await studentsRef.get();
    
    const results = snapshot.docs.map(doc => {
      const data = doc.data();
      const results = data.testResults || {};
      const aptitude = results.aptitude || 0;
      const reasoning = results.reasoning || 0;
      const communication = results.communication || 0;
      const coreTechnical = results.coreTechnical || null;
      const foundationalCompleted = results.foundationalCompleted || false;
      const coreCompleted = results.coreCompleted || false;

      return {
        id: doc.id,
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
      const snapshot = await studentsRef.where("email", "==", email).limit(1).get();
      if (!snapshot.empty) {
        finalId = snapshot.docs[0].id;
      }
    }

    if (!finalId) {
      console.warn(`[getMyResults] Student not found for email: ${email}`);
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const snapshot = await studentsRef.doc(finalId).get();
    if (!snapshot.exists) {
      console.warn(`[getMyResults] Student data not found for ID: ${finalId}`);
      return res.status(404).json({ success: false, message: "Student data not found" });
    }
    
    const data = snapshot.data();

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

    // Add courseId to student's enrollment list (Firestore uses map within document)
    await enrollmentsRef.doc(sanitizedEmail).set({
      [courseId]: {
        enrolledAt: new Date().toISOString(),
        status: "active"
      }
    }, { merge: true });

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

    const doc = await enrollmentsRef.doc(sanitizedEmail).get();
    const data = doc.exists ? doc.data() : {};

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
      const snap = await studentsRef.doc(idFromToken).get();
      if (snap.exists) studentData = { id: idFromToken, ...snap.data() };
    }
    if (!studentData && email) {
      const snapshot = await studentsRef.where("email", "==", email).limit(1).get();
      if (!snapshot.empty) {
        studentData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
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
    const batchesCollection = db.collection("batches");
    const trainersCollection = db.collection("trainers");
    const result = {};

    // Pre-fetch all trainers for robust in-memory matching (avoids Firebase case-sensitivity issues)
    const trainersSnap = await trainersCollection.get();
    const trainersList = trainersSnap.docs.map(doc => ({ key: doc.id, ...doc.data() }));

    for (const [courseName, batchKey] of Object.entries(batchesMap)) {
      try {
        const directSnap = await batchesCollection.doc(batchKey).get();
        let batchData = null;
        if (directSnap.exists) {
          batchData = { firebaseKey: batchKey, ...directSnap.data() };
        } else {
          const qSnap = await batchesCollection.where("batchId", "==", batchKey).limit(1).get();
          if (!qSnap.empty) {
            batchData = { firebaseKey: qSnap.docs[0].id, ...qSnap.docs[0].data() };
          }
        }
        if (!batchData) continue;

        // 4. Fetch full trainer profile (Case-insensitive matching)
        const trainerNameStr = (batchData.trainerName || batchData.trainer || "").trim().toLowerCase();
        let trainerDetails = null;

        if (trainerNameStr) {
          const matchedTrainer = trainersList.find(t => {
            const tName = (t.fullName || t.fullname || t.name || "").trim().toLowerCase();
            return tName === trainerNameStr || t.email?.toLowerCase() === trainerNameStr;
          });

          if (matchedTrainer) {
            trainerDetails = {
              name: matchedTrainer.fullName || matchedTrainer.fullname || matchedTrainer.name,
              email: matchedTrainer.email || "",
              phone: matchedTrainer.phone || matchedTrainer.mobile || "",
              specialization: matchedTrainer.specialization || matchedTrainer.domain || "",
              expertise: matchedTrainer.expertise || "",
              experience: matchedTrainer.experience || "",
              profileImage: matchedTrainer.profileImage || ""
            };
          } else {
            trainerDetails = { name: batchData.trainerName || batchData.trainer, email: "", phone: "", specialization: "", experience: "", profileImage: "" };
          }
        }

        // 5. Extract start date/time
        let startDate = "", startTime = "";
        if (batchData.startDateTime) {
          const d = new Date(batchData.startDateTime);
          startDate = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          startTime = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
        } else if (batchData.name && batchData.name.includes(" - ")) {
          startDate = batchData.name.split(" - ").pop();
        }

        result[courseName] = {
          batchId: batchData.batchId || batchKey,
          batchName: batchData.name || courseName,
          courseName: batchData.courseName || batchData.course || courseName,
          courseId: batchData.courseId || "",
          status: batchData.status || "Scheduled",
          batchStatus: batchData.batchStatus || batchData.status || "Scheduled",
          startDateTime: batchData.startDateTime || "",
          startDate,
          startTime,
          duration: batchData.duration || "",
          mode: batchData.mode || "Online",
          capacity: batchData.capacity || 30,
          enrolled: batchData.enrolled || 0,
          liveClassLink: batchData.liveClassLink || batchData.meetLink || "",
          trainer: trainerDetails
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
      const snap = await studentsRef.doc(idFromToken).get();
      if (snap.exists) {
        studentData = { id: idFromToken, ...snap.data() };
      }
    }

    // 2. Try email fallback
    if (!studentData && email) {
      const snapshot = await studentsRef.where("email", "==", email).limit(1).get();
      if (!snapshot.empty) {
        studentData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      }
    }

    if (!studentData) {
      return res.status(404).json({ success: false, message: "Student record not found in database." });
    }

    // Auto-migrate: Generate studentId if missing or non-numeric
    if (!studentData.studentId || isNaN(studentData.studentId)) {
      const snapshot = await studentsRef.get();
      const count = snapshot.size;
      // Generate a more robust unique number
      const newStudentId = (1001 + count).toString();

      await studentsRef.doc(studentData.id).update({ studentId: newStudentId });
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
      const snapshot = await studentsRef.where("email", "==", email).limit(1).get();
      if (!snapshot.empty) {
        studentId = snapshot.docs[0].id;
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
      // Allow clearing profileImage
      if (key === 'profileImage' && (val === null || val === "")) {
        sanitized[key] = admin.firestore.FieldValue.delete(); // Correct way to remove field in Firestore
      } else if (val !== undefined && val !== null && val !== "") {
        sanitized[key] = val;
      }
    }

    console.log(`[updateStudentProfile] Saving ${Object.keys(sanitized).length} fields for student ${studentId}`);

    if (Object.keys(sanitized).length === 0) {
      return res.status(200).json({ success: true, message: "No changes to save." });
    }

    // ── 3. Write to Firebase ──────────────────────────────────────────────
    await studentsRef.doc(studentId).update(sanitized);

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
    const snapshot = await studentsRef.get();
    
    const batch = db.batch();
    let hasUpdates = false;

    snapshot.forEach((doc) => {
      const student = doc.data();
      if (student.testResults && student.testResults.isSeen === false) {
        batch.update(doc.ref, { "testResults.isSeen": true });
        hasUpdates = true;
      }
    });

    if (hasUpdates) {
      await batch.commit();
    }

    res.json({ success: true, message: "All student results marked as seen" });
  } catch (error) {
    console.error("Error marking student results as seen:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/student/queries
// ═══════════════════════════════════════════════════════════════════════════
export const createStudentQuery = async (req, res) => {
  try {
    const { title, text, code, type, trainerName, batchId } = req.body;
    const studentId = req.user.id;
    
    const snap = await studentsRef.doc(studentId).get();
    const studentData = snap.data();

    const newQuery = {
      studentId,
      studentName: studentData.fullname || studentData.fullName || studentData.name || "Student",
      title,
      text,
      code: code || "",
      type: type || "chat", // chat, code, meet
      trainerName,
      batchId,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      readByTrainer: false,
      readByStudent: true
    };

    const queriesRef = db.collection("queries");
    const docRef = await queriesRef.add(newQuery);

    return res.status(201).json({ success: true, queryId: docRef.id });
  } catch (error) {
    console.error("[createStudentQuery] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// GET /api/student/queries
// ═══════════════════════════════════════════════════════════════════════════
export const getStudentQueries = async (req, res) => {
  try {
    const studentId = req.user.id;
    const queriesRef = db.collection("queries");
    const snapshot = await queriesRef.where("studentId", "==", studentId).get();
    
    const queries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    queries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ success: true, queries });
  } catch (error) {
    console.error("[getStudentQueries] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PUT /api/student/queries/:queryId/read
// ═══════════════════════════════════════════════════════════════════════════
export const markQueryReadByStudent = async (req, res) => {
  try {
    const { queryId } = req.params;
    await db.collection("queries").doc(queryId).update({ readByStudent: true });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



