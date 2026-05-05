import db from "../config/firebase.js";
import sendEmail from "../utils/sendEmail.js";
import { emitToTrainer } from "../utils/socket.js";


const counsellingRef = db.ref("counsellingBookings");

const BACKEND_TIME_SLOTS = [
  { id: 'slot1', label: '10:00 AM – 11:00 AM', startHour: 10 },
  { id: 'slot2', label: '11:00 AM – 12:00 PM', startHour: 11 },
  { id: 'slot3', label: '2:00 PM – 3:00 PM',   startHour: 14 },
  { id: 'slot4', label: '3:00 PM – 4:00 PM',   startHour: 15 },
];

const getNextSlot = (currentDate, currentSlotId) => {
  const currentIndex = BACKEND_TIME_SLOTS.findIndex(s => s.id === currentSlotId);
  if (currentIndex < BACKEND_TIME_SLOTS.length - 1) {
    return { date: currentDate, ...BACKEND_TIME_SLOTS[currentIndex + 1] };
  } else {
    // Move to next day (skip Sat/Sun)
    let nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    if (nextDate.getDay() === 6) nextDate.setDate(nextDate.getDate() + 2); // Sat -> Mon
    if (nextDate.getDay() === 0) nextDate.setDate(nextDate.getDate() + 1); // Sun -> Mon
    
    return { date: nextDate.toISOString().split('T')[0], ...BACKEND_TIME_SLOTS[0] };
  }
};

/**
 * @desc Book a counselling slot (Student)
 * @route POST /api/counselling/book
 */
export const bookSlot = async (req, res) => {
  try {
    const { serviceId, serviceTitle, slotId, slotLabel, slotDate, startHour } = req.body;
    const { id: studentId, email: studentEmail, fullName, name } = req.user;
    const studentName = fullName || name || "Student";

    if (serviceId === undefined || !serviceTitle || !slotId || !slotLabel || !slotDate || !startHour) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const bookingData = {
      studentId,
      studentName,
      studentEmail,
      serviceId,
      serviceTitle,
      slotId,
      slotLabel,
      slotDate,
      startHour,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    const newBookingRef = counsellingRef.push();
    await newBookingRef.set(bookingData);

    res.status(201).json({
      success: true,
      message: "Slot request submitted! Awaiting admin approval.",
      booking: { id: newBookingRef.key, ...bookingData },
    });
  } catch (error) {
    console.error("Book Slot Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get all counselling requests (Admin)
 * @route GET /api/counselling/requests
 */
export const getAdminRequests = async (req, res) => {
  try {
    const snapshot = await counsellingRef.once("value");
    const data = snapshot.val() || {};

    const requests = Object.entries(data).map(([id, val]) => ({
      id,
      ...val,
    }));

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Get Admin Requests Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Assign trainer and approve/reject slot (Admin)
 * @route PUT /api/counselling/assign-trainer
 */
export const assignTrainer = async (req, res) => {
  try {
    const { bookingId, trainerId, trainerName, status } = req.body;

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: "Booking ID and status are required" });
    }

    // Fetch the booking to get details
    const bookingSnapshot = await counsellingRef.child(bookingId).once("value");
    if (!bookingSnapshot.exists()) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    const booking = bookingSnapshot.val();

    // Determine session type
    const sessionType = booking.serviceId === 1 ? "1-many" : "1-1";

    const updates = { 
      status: "pending", // Always set to pending for trainer to accept/reject
      sessionType 
    };
    if (trainerId) updates.assignedTrainerId = trainerId;
    if (trainerName) updates.assignedTrainerName = trainerName;

    await counsellingRef.child(bookingId).update(updates);

    // ─── Create Notification for Trainer ────────────────────────────────────
    if (trainerId) {
      const notificationsRef = db.ref("trainerNotifications");
      const notifText = sessionType === "1-1" 
        ? "New counselling session assigned (1-1)" 
        : "New group counselling session assigned (1-many)";
      
      const newNotifRef = notificationsRef.child(trainerId).child("items").push();
      await newNotifRef.set({
        title: "New Counselling Session",
        text: notifText,
        type: "info",
        senderName: "Admin",
        senderRole: "admin",
        read: false,
        createdAt: Date.now(),
      });

      // ─── Real-Time Update (Socket) ─────────────────────────────────────────
      emitToTrainer(trainerId, "NEW_COUNSELLING_ASSIGNED", {
        message: notifText,
        bookingId
      });
    }

    if (status === "accepted" && booking.studentEmail) {
      const meetingLink = "https://meet.google.com/wxs-wifp-tti"; // Standard meeting link for now
      
      await sendEmail({
        to: booking.studentEmail,
        subject: "Counselling Slot Approved - InfyCode",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #1a73e8; color: white; padding: 20px; text-align: center;">
              <h1>Slot Approved!</h1>
            </div>
            <div style="padding: 20px; color: #333;">
              <p>Hi <strong>${booking.studentName}</strong>,</p>
              <p>Your counselling slot request for <strong>${booking.serviceTitle}</strong> has been approved.</p>
              <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Time Slot:</strong> ${booking.slotLabel}</p>
                <p style="margin: 5px 0;"><strong>Trainer:</strong> ${trainerName || "Assigned Mentor"}</p>
                <p style="margin: 5px 0;"><strong>Meeting Link:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
              </div>
              <p>Please click the button below to view your session details in the dashboard:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/student-dashboard/counselling/${booking.serviceId}" 
                   style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  View Session
                </a>
              </div>
              <p>Make sure to join on time!</p>
              <p>Best Regards,<br/>Team InfyCode</p>
            </div>
          </div>
        `,
      });
    }

    res.status(200).json({ success: true, message: `Request assigned and set to pending successfully.` });
  } catch (error) {
    console.error("Assign Trainer Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * @desc Get assigned sessions for Trainer
 * @route GET /api/counselling/trainer-sessions
 */
export const getTrainerSessions = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const snapshot = await counsellingRef.orderByChild("assignedTrainerId").equalTo(trainerId).once("value");
    const data = snapshot.val() || {};

    const sessions = Object.entries(data).map(([id, val]) => ({
      id,
      ...val,
    }));

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("Get Trainer Sessions Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get my sessions (Student)
 * @route GET /api/counselling/student-sessions
 */
export const getStudentSessions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const snapshot = await counsellingRef.orderByChild("studentId").equalTo(studentId).once("value");
    const data = snapshot.val() || {};

    const sessions = Object.entries(data).map(([id, val]) => ({
      id,
      ...val,
    }));

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("Get Student Sessions Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * @desc Logic to shift slots if min 10 students not met (1 hour before)
 * This should be called by a cron job or a dedicated route
 * @route POST /api/counselling/process-shifts (Admin only)
 */
export const checkAndShiftSlots = async (req, res) => {
  try {
    const now = new Date();
    const snapshot = await counsellingRef.once("value");
    const allBookings = snapshot.val() || {};
    
    const groupBookings = Object.entries(allBookings)
      .map(([id, val]) => ({ id, ...val }))
      .filter(b => b.serviceId === 1 && b.status === "pending");

    const slotsMap = {};
    groupBookings.forEach(b => {
      const key = `${b.slotDate}_${b.slotId}`;
      if (!slotsMap[key]) {
        slotsMap[key] = { 
          date: b.slotDate, 
          slotId: b.slotId, 
          startHour: b.startHour, 
          label: b.slotLabel,
          students: [] 
        };
      }
      slotsMap[key].students.push(b);
    });

    let shiftedCount = 0;

    for (const key in slotsMap) {
      const slot = slotsMap[key];
      const slotStartTime = new Date(slot.date);
      slotStartTime.setHours(slot.startHour, 0, 0, 0);

      const diffInHours = (slotStartTime - now) / (1000 * 60 * 60);
      
      // If slot starts in <= 1 hour and count < 10
      if (diffInHours > 0 && diffInHours <= 1 && slot.students.length < 10) {
        const nextSlot = getNextSlot(slot.date, slot.slotId);
        
        for (const booking of slot.students) {
          await counsellingRef.child(booking.id).update({
            slotDate: nextSlot.date,
            slotId: nextSlot.id,
            slotLabel: nextSlot.label,
            startHour: nextSlot.startHour,
            rescheduled: true,
            originalSlot: `${slot.date} ${slot.label}`
          });

          // Send Email
          await sendEmail({
            to: booking.studentEmail,
            subject: "Counselling Session Rescheduled",
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #f59e0b;">Session Rescheduled</h2>
                <p>Hi ${booking.studentName},</p>
                <p>Your 1-Many Counselling session originally scheduled for <strong>${slot.date} at ${slot.label}</strong> has been rescheduled because the minimum requirement of 10 students was not met.</p>
                <p><strong>New Schedule:</strong> ${nextSlot.date} at ${nextSlot.label}</p>
                <p>We apologize for the inconvenience.</p>
                <p>Best Regards,<br/>InfyCode Team</p>
              </div>
            `
          });
          shiftedCount++;
        }
      }
    }

    if (res) res.status(200).json({ success: true, message: `Processed slots. Shifted ${shiftedCount} students.` });
  } catch (error) {
    console.error("Shift Slots Error:", error);
    if (res) res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get pending counselling sessions count for Trainer
 * @route GET /api/counselling/pending-count
 */
export const getPendingCount = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const snapshot = await counsellingRef
      .orderByChild("assignedTrainerId")
      .equalTo(trainerId)
      .once("value");
    
    const data = snapshot.val() || {};
    const pendingCount = Object.values(data).filter(b => b.status === "pending").length;

    res.status(200).json({ success: true, count: pendingCount });
  } catch (error) {
    console.error("Get Pending Count Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Update counselling session status (Trainer)
 * @route PUT /api/counselling/update-status
 */
export const updateSessionStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const trainerId = req.user.id;

    if (!bookingId || !status) {
      return res.status(400).json({ success: false, message: "Booking ID and status are required" });
    }

    // Verify booking belongs to this trainer
    const snap = await counsellingRef.child(bookingId).once("value");
    if (!snap.exists()) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    const booking = snap.val();
    if (booking.assignedTrainerId !== trainerId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this session" });
    }

    await counsellingRef.child(bookingId).update({ status });

    // ─── Real-Time Update (Socket) ─────────────────────────────────────────
    emitToTrainer(trainerId, "COUNSELLING_STATUS_UPDATED", {
      bookingId,
      newStatus: status
    });

    res.status(200).json({ success: true, message: `Status updated to ${status}` });
  } catch (error) {
    console.error("Update Session Status Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

