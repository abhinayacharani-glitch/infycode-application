import db from "../config/firebase.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

const adminsRef = db.ref("admins");
const tempRegistrationsRef = db.ref("tempRegistrations");
const batchesRef = db.ref("batch");
const studentsRef = db.ref("students");
const trainersRef = db.ref("trainers");
const coursesRef = db.ref("courses");
const enrollmentsRef = db.ref("enrollments");

// Helper: Normalized status matching
const matchesStatus = (val, targetStatuses) => {
  if (!val) return false;
  return targetStatuses.some(status => status.toLowerCase() === val.toLowerCase());
};

// Helper: Generate next Batch ID (B-0001)
const generateNextBatchID = async () => {
  const snapshot = await batchesRef.once("value");
  const count = snapshot.numChildren();
  return `B-${String(count + 1).padStart(4, "0")}`;
};

// ✅ ADMIN REGISTER
export const adminRegister = async (req, res) => {
  try {
    const { fullName, fullname, name, email, phone, phno, password, confirmPassword } = req.body;
    const resolvedName = fullName || fullname || name;
    const resolvedPhone = phone || phno;

    if (!resolvedName || !email || !resolvedPhone || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if admin already exists
    const adminSnapshot = await adminsRef.orderByChild("email").equalTo(email.trim().toLowerCase()).once("value");
    if (adminSnapshot.exists()) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 1 * 60 * 1000; // 1 minute
    const sessionExpiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    const hashedPassword = await bcrypt.hash(password, 10);
    const sanitizedEmail = email.trim().toLowerCase().replace(/\./g, ",");
    const tempKey = `admin_${sanitizedEmail}`;

    await tempRegistrationsRef.child(tempKey).set({
      fullName: resolvedName.trim(),
      email: email.trim().toLowerCase(),
      phone: resolvedPhone.trim(),
      password: hashedPassword,
      role: "admin",
      otp,
      expiresAt: otpExpiresAt,
      sessionExpiresAt: sessionExpiresAt,
      createdAt: new Date().toISOString(),
    });

    // Send OTP email
    await sendEmail({
      to: email.trim().toLowerCase(),
      subject: "Registration OTP for Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #1a73e8;">Admin Registration OTP</h2>
          <p>Hi <strong>${resolvedName.trim()}</strong>,</p>
          <p>Your OTP for completing admin registration is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 5px; margin: 20px 0; text-align: center; background: #f0f0f0;">
            ${otp}
          </div>
          <p>This OTP is valid for <strong>1 minute</strong>. Do not share it with anyone.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    if (error.message.includes("550") || error.responseCode === 550) {
      return res.status(400).json({
        success: false,
        message: "Email does not exist. Please enter a valid email"
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to send OTP email. Please try again."
    });
  }
};


// ✅ ADMIN LOGIN
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // 1. Step 1 — Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // 2. Step 2 — Check Email Exists in Database
    const snapshot = await adminsRef
      .orderByChild("email")
      .equalTo(email.trim().toLowerCase())
      .once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, message: "Email not found" });
    }

    let userData;
    let adminId;
    snapshot.forEach((child) => {
      userData = child.val();
      adminId = child.key;
    });
    userData.id = adminId;

    // 3. Step 3 — Check Password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(userData);

    res.json({
      message: "Admin login successful",
      token,
      role: userData.role,
      fullName: userData.fullName,
      email: userData.email,
    });
  } catch (error) {
    console.error("Admin Login Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ ADMIN DASHBOARD
export const adminDashboard = async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome to the Admin Dashboard" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get real-time dashboard data (Counts and full lists) from Firebase
 * @route GET /api/admin/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const [studentsSnap, trainersSnap, batchesSnap, coursesSnap, enrollmentsSnap] = await Promise.all([
      studentsRef.once("value"),
      trainersRef.once("value"),
      batchesRef.once("value"),
      coursesRef.once("value"),
      enrollmentsRef.once("value")
    ]);

    const studentsRaw = studentsSnap.val() || {};
    const trainersRaw = trainersSnap.val() || {};
    const batchesRaw = batchesSnap.val() || {};
    const coursesRaw = coursesSnap.val() || {};
    const enrollmentsRaw = enrollmentsSnap.val() || {};

    const students = Object.entries(studentsRaw).map(([id, data]) => {
      const rawEmail = (data.email || "").trim().toLowerCase();
      const sanitizedEmail = rawEmail.replace(/\./g, ",");
      const hasEnrollments = enrollmentsRaw[sanitizedEmail] && Object.keys(enrollmentsRaw[sanitizedEmail]).length > 0;
      
      return {
        id,
        ...data,
        name: data.fullname || data.fullName || data.username || data.name || "N/A",
        status: hasEnrollments ? "Enrolled" : "Pending",
        createdAt: data.createdAt || new Date().toISOString()
      };
    });

    const trainers = Object.entries(trainersRaw).map(([id, data]) => ({
      id,
      ...data,
      name: data.fullName || data.fullname || data.username || data.name || "N/A",
      status: data.status || "Onboarded"
    }));

    const batches = Object.entries(batchesRaw).map(([id, data]) => ({
      id,
      batchId: data.batchId || id,
      ...data,
      course: data.course || data.courseName || "Unknown Course",
      trainer: data.trainer || data.trainerName || "Unassigned",
      capacity: parseInt(data.capacity) || 30,
      enrolled: parseInt(data.enrolled) || 0,
      studentIdFrom: data.studentIdFrom || "N/A",
      studentIdTo: data.studentIdTo || "N/A",
      status: data.status || "Planned"
    }));

    const stats = {
      totalStudents: students.length,
      activeTrainers: trainers.filter(t => !t.status || matchesStatus(t.status, ["Active", "Onboarded"])).length,
      activeBatches: batches.filter(b => matchesStatus(b.status, ["Active"])).length, 
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

/**
 * @desc Create a new training batch in Firebase
 * @route POST /api/admin/batches
 **/
export const createBatch = async (req, res) => {
  try {
    const { name, course, trainer, capacity, status, studentIdFrom, studentIdTo } = req.body;

    if (!name || !course || !trainer) {
      return res.status(400).json({ message: "Name, course, and trainer are required." });
    }

    const nextBID = await generateNextBatchID();
    const newBatchRef = batchesRef.push();
    const batchData = {
      batchId: nextBID, // Assign unique sequential Batch ID
      name,
      courseName: course,
      trainerName: trainer,
      capacity: parseInt(capacity) || 30,
      enrolled: 0,
      studentIdFrom: studentIdFrom || "N/A",
      studentIdTo: studentIdTo || "N/A",
      status: status || 'Draft',
      createdAt: new Date().toISOString()
    };

    await newBatchRef.set(batchData);

    res.status(201).json({
      message: "Batch created correctly and synced with Firebase.",
      batch: { id: newBatchRef.key, ...batchData, course, trainer } // Return normalized for immediate frontend use
    });
  } catch (error) {
    console.error("Backend Error creating batch:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ success: false, message: "User ID not found in token" });
    }
    const adminSnap = await adminsRef.child(req.user.id).once("value");
    if (!adminSnap.exists()) return res.status(404).json({ success: false, message: "Admin not found" });
    
    const adminData = adminSnap.val();
    delete adminData.password;
    adminData.id = req.user.id;
    
    res.status(200).json({ success: true, profile: adminData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  try {
    const updateData = req.body;
    if (!req.user || !req.user.id) {
      return res.status(400).json({ success: false, message: "User ID not found in token" });
    }
    const allowedFields = ["fullName", "profileImage", "phone"];
    const filteredData = {};
    allowedFields.forEach(field => { if (updateData[field] !== undefined) filteredData[field] = updateData[field]; });

    await adminsRef.child(req.user.id).update(filteredData);
    const updatedSnap = await adminsRef.child(req.user.id).once("value");
    const fullProfile = updatedSnap.val();
    delete fullProfile.password;

    res.status(200).json({ success: true, message: "Profile updated successfully", profile: fullProfile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
