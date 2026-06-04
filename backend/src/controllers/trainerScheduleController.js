import db from "../config/firebase.js";

const scheduleRef = db.collection("trainerSchedule");

/**
 * GET /api/trainer/schedule
 * Fetch all sessions scheduled by the logged-in trainer
 */
export const getTrainerSchedule = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const snapshot = await scheduleRef.where("trainerId", "==", trainerId).get();

    const schedule = [];
    snapshot.forEach((doc) => {
      schedule.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json({ success: true, schedule });
  } catch (error) {
    console.error("Error fetching trainer schedule:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * POST /api/trainer/schedule
 * Create a new scheduled session/holiday
 */
export const createTrainerSchedule = async (req, res) => {
  try {
    const { batchId, courseName, topic, date, startTime, endTime, duration, mode, type, holidayReason } = req.body;
    const trainerId = req.user.id;

    if (!type || !date) {
      return res.status(400).json({ success: false, message: "Type and date are required" });
    }

    const docRef = scheduleRef.doc();
    const sessionData = {
      id: docRef.id,
      trainerId,
      batchId: batchId || "GEN",
      courseName: courseName || "General",
      topic: type === 'Holiday' ? 'Holiday' : (topic || ''),
      date,
      startTime: type === 'Holiday' ? '--:--' : (startTime || ''),
      endTime: type === 'Holiday' ? '--:--' : (endTime || ''),
      duration: type === 'Holiday' ? 0 : (parseInt(duration) || 0),
      mode: mode || "Online",
      type,
      holidayReason: type === 'Holiday' ? (holidayReason || '') : '',
      createdAt: Date.now()
    };

    await docRef.set(sessionData);

    res.status(201).json({
      success: true,
      message: "Session scheduled successfully",
      session: sessionData
    });
  } catch (error) {
    console.error("Error creating trainer schedule session:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * PUT /api/trainer/schedule/:id
 * Update an existing schedule session/holiday
 */
export const updateTrainerSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { batchId, courseName, topic, date, startTime, endTime, duration, mode, type, holidayReason } = req.body;
    const trainerId = req.user.id;

    const docRef = scheduleRef.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    const existingSession = doc.data();
    if (existingSession.trainerId !== trainerId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const updatedData = {
      batchId: batchId !== undefined ? batchId : existingSession.batchId,
      courseName: courseName !== undefined ? courseName : existingSession.courseName,
      topic: topic !== undefined ? topic : existingSession.topic,
      date: date !== undefined ? date : existingSession.date,
      startTime: startTime !== undefined ? startTime : existingSession.startTime,
      endTime: endTime !== undefined ? endTime : existingSession.endTime,
      duration: duration !== undefined ? duration : existingSession.duration,
      mode: mode !== undefined ? mode : existingSession.mode,
      type: type !== undefined ? type : existingSession.type,
      holidayReason: holidayReason !== undefined ? holidayReason : existingSession.holidayReason,
      updatedAt: Date.now()
    };

    await docRef.update(updatedData);

    res.status(200).json({
      success: true,
      message: "Session updated successfully",
      session: { id, ...existingSession, ...updatedData }
    });
  } catch (error) {
    console.error("Error updating trainer schedule session:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * DELETE /api/trainer/schedule/:id
 * Delete a schedule session/holiday
 */
export const deleteTrainerSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const trainerId = req.user.id;

    const docRef = scheduleRef.doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (doc.data().trainerId !== trainerId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await docRef.delete();
    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainer schedule session:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
