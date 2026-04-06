import db from "../config/firebase.js";

const studentsRef = db.ref("students");
const trainersRef = db.ref("trainers");
const batchesRef = db.ref("batch");
const coursesRef = db.ref("courses");



// Helper: Normalized status matching
const matchesStatus = (val, targetStatuses) => {
  if (!val) return false;
  return targetStatuses.some(status => status.toLowerCase() === val.toLowerCase());
};

/**
 * @desc Get real-time dashboard data (Counts and full lists) from Firebase
 * @route GET /api/admin/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [studentsSnap, trainersSnap, batchesSnap, coursesSnap] = await Promise.all([
      studentsRef.once("value"),
      trainersRef.once("value"),
      batchesRef.once("value"),
      coursesRef.once("value")
    ]);

    const studentsRaw = studentsSnap.val() || {};
    const trainersRaw = trainersSnap.val() || {};
    const batchesRaw = batchesSnap.val() || {};
    const coursesRaw = coursesSnap.val() || {};

    const students = Object.entries(studentsRaw).map(([id, data]) => ({
      id,
      ...data,
      name: data.fullname || data.fullName || data.username || data.name || "N/A",
      status: data.status || "Pending",
      createdAt: data.createdAt || new Date().toISOString()
    }));

    const trainers = Object.entries(trainersRaw).map(([id, data]) => ({
      id,
      ...data,
      name: data.fullName || data.fullname || data.username || data.name || "N/A",
      status: data.status || "Onboarded" // Default to Onboarded so they show up in dropdowns
    }));

    // Normalize batch data for the frontend (Map courseName -> course, trainerName -> trainer)
    const batches = Object.entries(batchesRaw).map(([id, data]) => ({
      id,
      batchId: data.batchId || id, // Prioritize formal batchId, fallback to Firebase id
      ...data,
      course: data.course || data.courseName || "Unknown Course",
      trainer: data.trainer || data.trainerName || "Unassigned",
      capacity: parseInt(data.capacity) || 30,
      enrolled: parseInt(data.enrolled) || 0,
      status: data.status || "Planned"
    }));

    const stats = {
      totalStudents: students.length,
      activeTrainers: trainers.filter(t => !t.status || matchesStatus(t.status, ["Active", "Onboarded"])).length,
      activeBatches: batches.filter(b => !matchesStatus(b.status, ["Completed"])).length, 
      pendingVerifications: students.filter(s => matchesStatus(s.status, ["Pending"])).length,
      coursesCount: Object.keys(coursesRaw).length
    };

    res.status(200).json({
      stats,
      students,
      trainers,
      batches
    });
  } catch (error) {
    console.error("Backend Error fetching dashboard stats:", error);
    res.status(500).json({ error: error.message });
  }
};
