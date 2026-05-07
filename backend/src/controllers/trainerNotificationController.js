/**
 * trainerNotificationController.js
 *
 * Manages notifications for trainers.
 * Firestore path: trainerNotifications/{trainerId}/items/{notifId}
 *
 * Routes (all protected):
 *   GET  /api/trainer/notifications            → fetch trainer's notifications
 *   PUT  /api/trainer/notifications/mark-read  → mark one or all as read
 *   POST /api/trainer/notifications            → send notification TO a trainer (admin/student)
 *   DELETE /api/trainer/notifications/:id      → delete a single notification
 */

import db from "../config/firebase.js";

const trainersCollection = db.collection("trainers");
const notificationsCollection = db.collection("trainerNotifications");

// ─── Helper: resolve trainer Firestore ID from req.user ─────────────────────
const resolveTrainerId = async ({ id, email }) => {
  // 1. Try direct ID first
  const doc = await trainersCollection.doc(id).get();
  if (doc.exists) return id;

  // 2. Fallback to email lookup
  const snapshot = await trainersCollection
    .where("email", "==", email)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }
  return null;
};

// ─── GET /api/trainer/notifications ─────────────────────────────────────────
export const getTrainerNotifications = async (req, res) => {
  try {
    const trainerId = await resolveTrainerId(req.user);
    if (!trainerId)
      return res.status(404).json({ success: false, message: "Trainer not found" });

    const snapshot = await notificationsCollection
      .doc(trainerId)
      .collection("items")
      .orderBy("createdAt", "desc")
      .get();

    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

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
    const trainerId = await resolveTrainerId(req.user);
    if (!trainerId)
      return res.status(404).json({ success: false, message: "Trainer not found" });

    const { id } = req.body;
    const itemsCollection = notificationsCollection.doc(trainerId).collection("items");

    if (id) {
      // Mark single notification read
      await itemsCollection.doc(id).update({ read: true });
    } else {
      // Mark ALL as read
      const snapshot = await itemsCollection.where("read", "==", false).get();
      if (!snapshot.empty) {
        const batch = db.batch();
        snapshot.forEach((doc) => {
          batch.update(doc.ref, { read: true });
        });
        await batch.commit();
      }
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
    let resolvedTrainerId = trainerId || null;

    if (!resolvedTrainerId && trainerEmail) {
      const snapshot = await trainersCollection
        .where("email", "==", trainerEmail.trim().toLowerCase())
        .limit(1)
        .get();

      if (!snapshot.empty) {
        resolvedTrainerId = snapshot.docs[0].id;
      }
    }

    if (!resolvedTrainerId)
      return res.status(404).json({ success: false, message: "Target trainer not found" });

    const newNotif = {
      title:       title.trim(),
      text:        text.trim(),
      type:        type || "info",         // info | success | warning | student
      senderName:  senderName || "System",
      senderRole:  senderRole || "admin",  // admin | student
      read:        false,
      createdAt:   Date.now(),
    };

    const docRef = await notificationsCollection.doc(resolvedTrainerId).collection("items").add(newNotif);

    return res.status(201).json({
      success: true,
      message: "Notification sent",
      notificationId: docRef.id,
    });
  } catch (error) {
    console.error("[sendTrainerNotification] Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/trainer/notifications/:id ────────────────────────────────────
export const deleteTrainerNotification = async (req, res) => {
  try {
    const trainerId = await resolveTrainerId(req.user);
    if (!trainerId)
      return res.status(404).json({ success: false, message: "Trainer not found" });

    const { id } = req.params;
    await notificationsCollection.doc(trainerId).collection("items").doc(id).delete();

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
    const trainerId = await resolveTrainerId(req.user);
    if (!trainerId)
      return res.status(404).json({ success: false, message: "Trainer not found" });

    const itemsCollection = notificationsCollection.doc(trainerId).collection("items");
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

    const batch = db.batch();
    for (const notif of samples) {
      const docRef = itemsCollection.doc();
      batch.set(docRef, notif);
    }
    await batch.commit();

    return res.status(201).json({ success: true, message: "Sample notifications seeded" });
  } catch (error) {
    console.error("[seedTrainerNotifications] Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

