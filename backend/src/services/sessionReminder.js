import db from "../config/firebase.js";

const liveSessionConfigRef = db.collection("liveSessionConfig");
const batchesRef = db.collection("batches");
const studentNotificationsCollection = db.collection("studentNotifications");

/**
 * Helper to get all students in a batch
 */
const getStudentsInBatch = async (batchId) => {
  try {
    let batchData = null;
    const directSnap = await batchesRef.doc(batchId).get();
    if (directSnap.exists) {
      batchData = directSnap.data();
    } else {
      const qSnap = await batchesRef.where("batchId", "==", batchId).limit(1).get();
      if (!qSnap.empty) {
        batchData = qSnap.docs[0].data();
      }
    }

    if (!batchData || !batchData.students) return [];

    const studentsRaw = batchData.students;
    const studentsCollection = db.collection("students");
    const allStudentsSnap = await studentsCollection.get();
    const allStudents = {};
    allStudentsSnap.forEach(doc => { allStudents[doc.id] = doc.data(); });

    return Object.entries(studentsRaw).map(([id, data]) => {
      const mainStudentData = allStudents[id] || {};
      return {
        id,
        name: data.name || mainStudentData.fullname || mainStudentData.fullName || "Student",
        email: data.email || mainStudentData.email || "",
      };
    });
  } catch (error) {
    console.error("[getStudentsInBatch] Error:", error.message);
    return [];
  }
};

/**
 * Convert 12h time string (e.g. "09:00 AM") to 24h "HH:MM" 
 */
const to24Hour = (time12) => {
  if (!time12 || !time12.includes(" ")) return "09:00";
  const [time, suffix] = time12.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (suffix === "PM" && hours !== 12) hours += 12;
  if (suffix === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

/**
 * Run session reminders:
 * - 1 hour before class: Push a popup notification to each student's dashboard in Firestore.
 *   Students will see: "Class starts in 1 hour — [Batch] — [Time] — Join link ready"
 *
 * NOTE: Emails are sent IMMEDIATELY when the trainer saves the live session details
 *       (handled in liveSessionController.js → saveLiveSessionConfig).
 *       This cron only handles the 1-hour-before dashboard popup notifications.
 */
export const checkAndSendSessionReminders = async () => {
  try {
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = dayNames[now.getDay()];

    console.log(`[sessionReminder] Tick at ${now.toISOString()} — Today: ${todayName}`);

    const configsSnap = await liveSessionConfigRef.get();
    if (configsSnap.empty) return;

    const todayDateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

    for (const doc of configsSnap.docs) {
      const config = doc.data();
      const { batchId, weeklySchedule, sessionLink } = config;

      if (!batchId || !weeklySchedule) continue;

      // Find today's schedule for this batch
      const todaySchedule = weeklySchedule.find(item => item.day === todayName);
      if (!todaySchedule || !todaySchedule.enabled) continue;

      // Compute how many hours until class starts
      const startTime24 = todaySchedule.start.includes(" ")
        ? to24Hour(todaySchedule.start)
        : todaySchedule.start;

      const [hours, minutes] = startTime24.split(":").map(Number);
      const classStartTime = new Date(now);
      classStartTime.setHours(hours, minutes, 0, 0);

      const msDiff = classStartTime.getTime() - now.getTime();
      const hoursDiff = msDiff / (1000 * 60 * 60);

      // ── 1 Hour Before Class: Dashboard Popup Notification ──────────────────
      // Window: between 55 minutes and 65 minutes before class start
      if (hoursDiff > 0.9 && hoursDiff <= 1.1) {
        let batchStudents = await getStudentsInBatch(batchId);
        
        // If not found directly, resolve document ID via batchId field mapping
        if (batchStudents.length === 0) {
          const qSnap = await batchesRef.where("batchId", "==", batchId).limit(1).get();
          if (!qSnap.empty) {
            batchStudents = await getStudentsInBatch(qSnap.docs[0].id);
          }
        }

        if (batchStudents.length === 0) continue;

        // Resolve batch name from Firestore
        let batchName = batchId;
        try {
          const batchSnap = await batchesRef.doc(batchId).get();
          if (batchSnap.exists) {
            batchName = batchSnap.data().name || batchId;
          } else {
            const qSnap = await batchesRef.where("batchId", "==", batchId).limit(1).get();
            if (!qSnap.empty) {
              batchName = qSnap.docs[0].data().name || batchId;
            }
          }
        } catch (_) {}

        for (const student of batchStudents) {
          const notifId = `reminder_1h_${batchId}_${todayDateStr}_${student.id}`;
          const notifRef = studentNotificationsCollection
            .doc(student.id)
            .collection("items")
            .doc(notifId);

          const notifDoc = await notifRef.get();
          if (notifDoc.exists) continue; // Already sent — skip

          try {
            await notifRef.set({
              id: notifId,
              title: "⏰ Class Starts in 1 Hour!",
              text: `Your live class for batch "${batchName}" starts at ${todaySchedule.start} and ends at ${todaySchedule.end}. Open your course dashboard and click "Join Live Class" when class begins.`,
              type: "class_reminder_1h",
              batchId,
              sessionLink: sessionLink || "",
              startTime: todaySchedule.start,
              endTime: todaySchedule.end,
              read: false,
              createdAt: Date.now(),
            });
            console.log(
              `[sessionReminder] ✅ Created 1h popup notification for ${student.name} (${student.id}) — batch ${batchName}`
            );
          } catch (err) {
            console.error(
              `[sessionReminder] ❌ Failed to create notification for ${student.name}:`,
              err.message
            );
          }
        }
      }
    }
  } catch (error) {
    console.error("[checkAndSendSessionReminders] Unhandled error:", error.message);
  }
};

/**
 * Start cron — checks every 5 minutes
 */
export const startSessionReminderCron = () => {
  console.log("[sessionReminder] Starting 1h-before-class popup cron (every 5 minutes)...");
  checkAndSendSessionReminders(); // Run immediately on boot
  setInterval(checkAndSendSessionReminders, 5 * 60 * 1000); // Every 5 minutes
};
