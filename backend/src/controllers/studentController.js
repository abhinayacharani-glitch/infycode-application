import db from "../config/firebase.js";

const enrollmentsRef = db.ref("enrollments");

/**
 * @desc Enroll student in a course
 * @route POST /api/student/enroll/:courseId
 */
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { email } = req.user;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    const sanitizedEmail = email.replace(/\./g, ",");
    
    // Add courseId to student's enrollment list
    await enrollmentsRef.child(sanitizedEmail).child(courseId).set({
      enrolledAt: new Date().toISOString(),
      status: "active"
    });

    res.status(200).json({ message: "Enrolled successfully", courseId });
  } catch (error) {
    console.error("Enrollment Error:", error);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
};

/**
 * @desc Get all enrolled courses for a student
 * @route GET /api/student/enrolled-courses
 */
export const getEnrolledCourses = async (req, res) => {
  try {
    const { email } = req.user;
    const sanitizedEmail = email.replace(/\./g, ",");

    const snapshot = await enrollmentsRef.child(sanitizedEmail).once("value");
    const data = snapshot.val() || {};
    
    // Return just the keys (course IDs)
    const enrolledIds = Object.keys(data);
    
    res.status(200).json(enrolledIds);
  } catch (error) {
    console.error("Fetch Enrolled Error:", error);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
};
