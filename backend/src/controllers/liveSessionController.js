import db from "../config/firebase.js";
import sendEmail from "../utils/sendEmail.js";

const liveSessionConfigRef = db.collection("liveSessionConfig");
const batchesRef = db.collection("batches");
const trainersCollection = db.collection("trainers");
const studentsCollection = db.collection("students");
const studentNotificationsCollection = db.collection("studentNotifications");

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Get all students in a batch (returns [{id, name, email}])
// ─────────────────────────────────────────────────────────────────────────────
const getStudentsInBatch = async (batchId) => {
  try {
    let batchData = null;

    const directSnap = await batchesRef.doc(batchId).get();
    if (directSnap.exists) {
      batchData = directSnap.data();
    } else {
      const qSnap = await batchesRef.where("batchId", "==", batchId).limit(1).get();
      if (!qSnap.empty) batchData = qSnap.docs[0].data();
    }

    if (!batchData || !batchData.students) return [];

    const studentsRaw = batchData.students;
    const allStudentsSnap = await studentsCollection.get();
    const allStudents = {};
    allStudentsSnap.forEach(doc => { allStudents[doc.id] = doc.data(); });

    return Object.entries(studentsRaw).map(([id, data]) => {
      const s = allStudents[id] || {};
      return {
        id,
        name: data.name || s.fullname || s.fullName || "Student",
        email: data.email || s.email || "",
      };
    });
  } catch (error) {
    console.error("[getStudentsInBatch] Error:", error.message);
    return [];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Resolve trainer name from their profile collection
// ─────────────────────────────────────────────────────────────────────────────
const resolveTrainerName = async (trainerId) => {
  try {
    const snap = await trainersCollection.doc(trainerId).get();
    if (snap.exists) {
      const d = snap.data();
      return d.fullName || d.fullname || d.name || "Your Trainer";
    }
  } catch (_) {}
  return "Your Trainer";
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/trainer/live-session
// Save/update live session config and IMMEDIATELY email all batch students.
// ─────────────────────────────────────────────────────────────────────────────
export const saveLiveSessionConfig = async (req, res) => {
  try {
    const { batchId, meetingLink, weeklySchedule } = req.body;
    const trainerId = req.user.id;

    if (!batchId) {
      return res.status(400).json({ success: false, message: "batchId is required" });
    }
    if (!meetingLink || !meetingLink.trim()) {
      return res.status(400).json({ success: false, message: "meetingLink is required" });
    }

    const docId = `${trainerId}_${batchId}`;
    const docRef = liveSessionConfigRef.doc(docId);

    // Fetch previous weekly schedule to detect newly cancelled/holiday days
    const prevDoc = await docRef.get();
    const prevWeeklySchedule = prevDoc.exists ? (prevDoc.data().weeklySchedule || []) : [];

    const updatedConfig = {
      trainerId,
      batchId,
      sessionLink: meetingLink.trim(),
      weeklySchedule: weeklySchedule || [],
      lastSaved: new Date().toISOString(),
    };

    await docRef.set(updatedConfig, { merge: true });

    // ── Resolve names ──────────────────────────────────────────────────────
    let batchName = batchId;
    let trainerName = await resolveTrainerName(trainerId);

    try {
      const batchSnap = await batchesRef.doc(batchId).get();
      if (batchSnap.exists) {
        const bd = batchSnap.data();
        if (bd.courseName && bd.startDateTime) {
          const formattedDate = new Date(bd.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          const formattedTime = new Date(bd.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
          batchName = `${bd.courseName} - ${formattedDate}, ${formattedTime}`;
        } else {
          batchName = bd.name || batchId;
        }
        if (trainerName === "Your Trainer") {
          trainerName = bd.trainerName || bd.trainer || "Your Trainer";
        }
      } else {
        const qSnap = await batchesRef.where("batchId", "==", batchId).limit(1).get();
        if (!qSnap.empty) {
          const bd = qSnap.docs[0].data();
          if (bd.courseName && bd.startDateTime) {
            const formattedDate = new Date(bd.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const formattedTime = new Date(bd.startDateTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
            batchName = `${bd.courseName} - ${formattedDate}, ${formattedTime}`;
          } else {
            batchName = bd.name || batchId;
          }
          if (trainerName === "Your Trainer") {
            trainerName = bd.trainerName || bd.trainer || "Your Trainer";
          }
        }
      }
    } catch (err) {
      console.error("Error fetching batch details:", err.message);
    }

    // ── Detect newly cancelled days ────────────────────────────────────────
    const cancelledDaysToAlert = [];
    for (const item of (weeklySchedule || [])) {
      if (!item.enabled && item.reason && item.reason.trim()) {
        const prevItem = prevWeeklySchedule.find(p => p.day === item.day);
        const wasPreviouslyEnabled = !prevItem || prevItem.enabled;
        const reasonChanged = prevItem && prevItem.reason !== item.reason;

        if (wasPreviouslyEnabled || reasonChanged) {
          cancelledDaysToAlert.push(item);
        }
      }
    }

    const students = await getStudentsInBatch(batchId);

    // ── Process cancellations (Emails + Dashboard Notifications) ────────────
    if (cancelledDaysToAlert.length > 0 && students.length > 0) {
      for (const item of cancelledDaysToAlert) {
        const cancelSubject = `⚠️ Class Cancelled / Holiday Alert: ${item.day} — ${batchName}`;
        const cancelHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 700;">⚠️ Class Cancelled / Holiday Alert</h2>
              <p style="margin: 5px 0 0; opacity: 0.9; font-size: 14px;">Batch: <strong>${batchName}</strong></p>
            </div>
            <div style="padding: 24px;">
              <p style="font-size: 15px; color: #1f2937;">Dear Student,</p>
              <p style="font-size: 15px; color: #4b5563; line-height: 1.6;">
                Please note that the class scheduled for <strong style="color: #dc2626;">${item.day}</strong> has been cancelled or marked as a holiday by the trainer.
              </p>
              <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #991b1b; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Reason:</p>
                <p style="margin: 6px 0 0; color: #7f1d1d; font-size: 15px; font-style: italic;">"${item.reason}"</p>
              </div>
              <p style="color: #4b5563; font-size: 14px; margin-top: 24px;">
                Trainer: <strong>${trainerName}</strong>
              </p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
                This is an automated notification from InfyCode Learning Platform.
              </p>
            </div>
          </div>
        `.trim();

        // 1. Email blast to all batch students for this cancelled day
        const emailPromises = students.map(student => {
          if (!student.email) return Promise.resolve();
          return sendEmail({
            to: student.email,
            subject: cancelSubject,
            html: cancelHtml
          }).catch(err => console.error(`[saveLiveSessionConfig] Cancel email error → ${student.email}:`, err.message));
        });
        await Promise.allSettled(emailPromises);

        // 2. Write custom class_cancellation notifications into student collection
        const notifPromises = students.map(student => {
          const notifId = `cancel_${item.day}_${Date.now()}`;
          return studentNotificationsCollection
            .doc(student.id)
            .collection("items")
            .doc(notifId)
            .set({
              id: notifId,
              title: `📅 Class Update: ${item.day}`,
              text: `Please be informed that the class for "${batchName}" scheduled on ${item.day} has been cancelled or marked as a holiday. Reason: "${item.reason}".`,
              type: "class_cancellation",
              batchId,
              batchName,
              createdAt: Date.now(),
              read: false
            });
        });
        await Promise.allSettled(notifPromises);
        console.log(`[saveLiveSessionConfig] Cancellation alert dispatched to ${students.length} students for ${item.day}`);
      }
    }

    // ── Build schedule details (enabled days only) ─────────────────────────
    const enabledDays = (weeklySchedule || []).filter(item => item.enabled);
    const cancelledDays = (weeklySchedule || []).filter(item => !item.enabled && item.reason);

    const scheduleRows = enabledDays
      .map(item => `
        <tr>
          <td style="padding:6px 12px;color:#374151;font-weight:600;white-space:nowrap;">${item.day}</td>
          <td style="padding:6px 12px;color:#1e293b;">${item.start} – ${item.end}</td>
        </tr>`)
      .join("");

    const cancelledRows = cancelledDays
      .map(item => `
        <tr>
          <td style="padding:6px 12px;color:#dc2626;font-weight:600;">${item.day}</td>
          <td style="padding:6px 12px;color:#dc2626;">Holiday / Cancelled — ${item.reason}</td>
        </tr>`)
      .join("");

    // ── Compose professional HTML email ────────────────────────────────────
    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Live Class Details — InfyCode</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a73e8,#0d47a1);padding:28px 32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">
                🎓 InfyCode Live Class Details
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
                Your trainer has configured the live class for your batch.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">
                Dear Student,
              </p>
              <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                Your trainer has updated the live session details for batch
                <strong style="color:#1a73e8;">${batchName}</strong>.
                Here's everything you need to join:
              </p>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f0f7ff;border-left:4px solid #1a73e8;border-radius:0 8px 8px 0;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:6px 0;font-weight:700;color:#475569;width:130px;vertical-align:top;">👨‍💼 Trainer:</td>
                        <td style="padding:6px 0;color:#1e293b;font-size:15px;"><strong>${trainerName}</strong></td>
                      </tr>
                      <tr>
                        <td style="padding:6px 0;font-weight:700;color:#475569;vertical-align:top;">📚 Batch:</td>
                        <td style="padding:6px 0;color:#1e293b;font-size:15px;">${batchName}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Schedule Table -->
              ${enabledDays.length > 0 ? `
              <p style="margin:0 0 10px;font-weight:700;color:#1e293b;font-size:15px;">📅 Class Timings</p>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:24px;border-collapse:collapse;">
                <thead>
                  <tr style="background:#f8fafc;">
                    <th style="padding:10px 12px;text-align:left;color:#475569;font-size:13px;font-weight:700;border-bottom:1px solid #e2e8f0;">Day</th>
                    <th style="padding:10px 12px;text-align:left;color:#475569;font-size:13px;font-weight:700;border-bottom:1px solid #e2e8f0;">Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${scheduleRows}
                  ${cancelledRows}
                </tbody>
              </table>
              ` : ""}

              <!-- Join Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${meetingLink.trim()}"
                       target="_blank"
                       style="display:inline-block;background:linear-gradient(135deg,#1a73e8,#0d47a1);color:#ffffff;
                              text-decoration:none;font-weight:700;font-size:15px;
                              padding:14px 36px;border-radius:8px;letter-spacing:0.2px;">
                      🔗 Join Live Class
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#64748b;font-size:13px;line-height:1.6;">
                Log in to your <strong>InfyCode student dashboard</strong> and go to your enrolled course to see
                the live Join button. It becomes active when your class is live.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:11px;line-height:1.5;">
                This is an automated notification from <strong>InfyCode Learning Platform</strong>.<br/>
                Please do not reply directly to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // ── Send email to every student in the batch ───────────────────────────
    let emailsSent = 0;

    if (students.length > 0) {
      const emailPromises = students.map(async (student) => {
        if (!student.email) return;
        try {
          await sendEmail({
            to: student.email,
            subject: `📅 Live Class Details — ${batchName} | InfyCode`,
            html: emailHtml,
          });
          emailsSent++;
        } catch (err) {
          console.error(`[saveLiveSessionConfig] Failed to email ${student.email}:`, err.message);
        }
      });
      await Promise.all(emailPromises);
      console.log(`[saveLiveSessionConfig] Emails sent: ${emailsSent}/${students.length} for batch ${batchName}`);
    }

    return res.status(200).json({
      success: true,
      message: `Live session config saved. Emails sent to ${emailsSent} student(s).`,
      config: updatedConfig,
    });
  } catch (error) {
    console.error("[saveLiveSessionConfig] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/student/live-session/:batchId
// Student fetches their batch's live session config
// ─────────────────────────────────────────────────────────────────────────────
export const getLiveSessionConfigByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    if (!batchId) {
      return res.status(400).json({ success: false, message: "batchId is required" });
    }

    let snapshot = await liveSessionConfigRef.where("batchId", "==", batchId).limit(1).get();
    
    // If empty, let's also query batches collection to find corresponding document key or batchId mappings
    if (snapshot.empty) {
      const directBatchSnap = await batchesRef.doc(batchId).get();
      if (directBatchSnap.exists) {
        const bd = directBatchSnap.data();
        if (bd.batchId) {
          snapshot = await liveSessionConfigRef.where("batchId", "==", bd.batchId).limit(1).get();
        }
      }
    }

    if (snapshot.empty) {
      // Also try fallback where batchId parameter might be the human-readable batchId, and we need to check if config is saved under firebaseId
      const qSnap = await batchesRef.where("batchId", "==", batchId).limit(1).get();
      if (!qSnap.empty) {
        const firebaseId = qSnap.docs[0].id;
        snapshot = await liveSessionConfigRef.where("batchId", "==", firebaseId).limit(1).get();
      }
    }

    if (snapshot.empty) {
      return res.status(200).json({ success: true, config: null });
    }

    const config = snapshot.docs[0].data();
    return res.status(200).json({ success: true, config });
  } catch (error) {
    console.error("[getLiveSessionConfigByBatch] Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
