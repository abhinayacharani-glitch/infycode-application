/**
 * trainerNotificationController.js
 *
 * Manages notifications for trainers.
 * Firebase path: trainerNotifications/{trainerKey}/items/{notifId}
 *
 * Routes (all protected):
 *   GET  /api/trainer/notifications            → fetch trainer's notifications
 *   PUT  /api/trainer/notifications/mark-read  → mark one or all as read
 *   POST /api/trainer/notifications            → send notification TO a trainer (admin/student)
 *   DELETE /api/trainer/notifications/:id      → delete a single notification
 */

import db from "../config/firebase.js";

const trainersRef = db.ref("trainers");
const notificationsRef = db.ref("trainerNotifications");

// ─── Helper: resolve trainer Firebase key from req.user ─────────────────────
const resolveTrainerKey = async ({ id, email }) => {
  // 1. Try direct ID first
  const snap = await trainersRef.child(id).once("value");
  if (snap.exists()) return id;

  // 2. Fallback to email lookup
  const emailSnap = await trainersRef
    .orderByChild("email")
    .equalTo(email)
    .once("value");

  let key = null;
  emailSnap.forEach((child) => { key = child.key; });
  return key;
};

// ─── GET /api/trainer/notifications ─────────────────────────────────────────
export const getTrainerNotifications = async (req, res) => {
  try {
    const trainerKey = await resolveTrainerKey(req.user);
    if (!trainerKey)
      return res.status(404).json({ success: false, message: "Trainer not found" });

    const snap = await notificationsRef
      .child(trainerKey)
      .child("items")
      .once("value");

    const raw = snap.val() || {};
    const notifications = Object.entries(raw)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // newest first

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("[getTrainerNotifications] Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/trainer/notifications/mark-read ────────────────────────────────
// Body: { id: "notifId" }  — OR omit id to mark ALL as read
export const markNotificationsRead = async (req, res) => {
  try {
    const trainerKey = await resolveTrainerKey(req.user);
    if (!trainerKey)
      return res.status(404).json({ success: false, message: "Trainer not found" });

    const { id } = req.body;
    const itemsRef = notificationsRef.child(trainerKey).child("items");

    if (id) {
      // Mark single notification read
      await itemsRef.child(id).update({ read: true });
    } else {
      // Mark ALL as read
      const snap = await itemsRef.once("value");
      const raw = snap.val() || {};
      const updates = {};
      Object.keys(raw).forEach((k) => { updates[`${k}/read`] = true; });
      if (Object.keys(updates).length > 0) await itemsRef.update(updates);
    }

    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    console.error("[markNotificationsRead] Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/trainer/notifications ─────────────────────────────────────────
// Body: { trainerEmail, title, text, type, senderName, senderRole }
// Used by Admin (or Student) to push a notification to a trainer
export const sendTrainerNotification = async (req, res) => {
  try {
    const { trainerEmail, trainerId, title, text, type, senderName, senderRole } = req.body;

    if (!title || !text)
      return res.status(400).json({ success: false, message: "title and text are required" });

    // Resolve target trainer
    let trainerKey = trainerId || null;

    if (!trainerKey && trainerEmail) {
      const emailSnap = await trainersRef
        .orderByChild("email")
        .equalTo(trainerEmail.trim().toLowerCase())
        .once("value");

      emailSnap.forEach((child) => { trainerKey = child.key; });
    }

    if (!trainerKey)
      return res.status(404).json({ success: false, message: "Target trainer not found" });

    const newRef = notificationsRef.child(trainerKey).child("items").push();
    await newRef.set({
      title:       title.trim(),
      text:        text.trim(),
      type:        type || "info",         // info | success | warning | student
      senderName:  senderName || "System",
      senderRole:  senderRole || "admin",  // admin | student
      read:        false,
      createdAt:   Date.now(),
    });

    return res.status(201).json({
      success: true,
      message: "Notification sent",
      notificationId: newRef.key,
    });
  } catch (error) {
    console.error("[sendTrainerNotification] Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/trainer/notifications/:id ────────────────────────────────────
export const deleteTrainerNotification = async (req, res) => {
  try {
    const trainerKey = await resolveTrainerKey(req.user);
    if (!trainerKey)
      return res.status(404).json({ success: false, message: "Trainer not found" });

    const { id } = req.params;
    await notificationsRef.child(trainerKey).child("items").child(id).remove();

    return res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("[deleteTrainerNotification] Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/trainer/notifications/seed ─────────────────────────────────────
// Dev helper: seeds some sample notifications for the logged-in trainer
export const seedTrainerNotifications = async (req, res) => {
  try {
    const trainerKey = await resolveTrainerKey(req.user);
    if (!trainerKey)
      return res.status(404).json({ success: false, message: "Trainer not found" });

    const itemsRef = notificationsRef.child(trainerKey).child("items");
    const now = Date.now();

    const samples = [
      {
        title: "Batch Schedule Updated",
        text: "Admin has updated the schedule for Batch B-0003. Please review the new timings.",
        type: "info",
        senderName: "Admin",
        senderRole: "admin",
        read: false,
        createdAt: now - 600000,
      },
      {
        title: "New Doubt Raised",
        text: "Student Priya Sharma posted a doubt in the React Advanced module discussion.",
        type: "student",
        senderName: "Priya Sharma",
        senderRole: "student",
        read: false,
        createdAt: now - 1800000,
      },
      {
        title: "Session Report Pending",
        text: "Please submit the session report for yesterday's class before 6 PM.",
        type: "warning",
        senderName: "Admin",
        senderRole: "admin",
        read: false,
        createdAt: now - 3600000,
      },
      {
        title: "Attendance Marked ✓",
        text: "Batch B-0002 attendance has been successfully recorded for today's session.",
        type: "success",
        senderName: "System",
        senderRole: "admin",
        read: true,
        createdAt: now - 7200000,
      },
      {
        title: "Doubt Session Requested",
        text: "Student Arjun K. has requested a 1-on-1 doubt clearing session for Python OOPs.",
        type: "student",
        senderName: "Arjun K.",
        senderRole: "student",
        read: true,
        createdAt: now - 86400000,
      },
    ];

    for (const notif of samples) {
      await itemsRef.push(notif);
    }

    return res.status(201).json({ success: true, message: "Sample notifications seeded" });
  } catch (error) {
    console.error("[seedTrainerNotifications] Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
