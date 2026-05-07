import db from "../config/firebase.js";
import { sendCalendarEventEmail } from "../services/emailService.js";

const calendarRef = db.collection("trainerCalendarEvents");

/**
 * Helper to check if event is completed
 */
const checkCompletion = (event) => {
  if (event.status === "COMPLETED") return true;
  const now = new Date();
  const eventEndTime = new Date(`${event.date}T${event.endTime}`);
  return now > eventEndTime;
};

/**
 * POST /api/calendar/events
 */
export const createEvent = async (req, res) => {
  try {
    const { title, type, date, startTime, endTime, meetingLink, description } = req.body;
    const trainerId = req.user.id;
    const trainerEmail = req.user.email;
    const trainerName = req.user.fullName || "Trainer";

    // Restriction: Only Admin Interaction allowed
    if (type !== "meeting") {
      return res.status(400).json({
        success: false,
        message: "Only 'Admin Interaction' events are allowed to be scheduled."
      });
    }

    const docRef = calendarRef.doc();
    const eventData = {
      id: docRef.id,
      title,
      type,
      date,
      startTime,
      endTime,
      meetingLink: meetingLink || "",
      description: description || "",
      trainerId,
      trainerName,
      status: "ACTIVE",
      createdAt: Date.now()
    };

    await docRef.set(eventData);

    // Trigger Email
    await sendCalendarEventEmail(eventData, false, trainerEmail);

    res.status(201).json({
      success: true,
      message: "Event scheduled successfully",
      event: eventData
    });
  } catch (error) {
    console.error("Error creating calendar event:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * GET /api/calendar/events
 */
export const getEvents = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const snapshot = await calendarRef.where("trainerId", "==", trainerId).get();

    if (snapshot.empty) {
      return res.status(200).json({ success: true, events: [] });
    }

    const events = [];
    const batch = db.batch();
    let hasBatchUpdates = false;

    snapshot.forEach((doc) => {
      const event = doc.data();
      
      // Automatic completion handling
      if (event.status === "ACTIVE" && checkCompletion(event)) {
        event.status = "COMPLETED";
        batch.update(doc.ref, { status: "COMPLETED" });
        hasBatchUpdates = true;
      }

      // Return only ACTIVE events (as per requirement 6)
      if (event.status === "ACTIVE") {
        events.push({ id: doc.id, ...event });
      }
    });

    if (hasBatchUpdates) {
      await batch.commit();
    }

    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * PUT /api/calendar/events/:id
 */
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, date, startTime, endTime, meetingLink, description } = req.body;
    const trainerId = req.user.id;
    const trainerEmail = req.user.email;

    const eventDocRef = calendarRef.doc(id);
    const doc = await eventDocRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const existingEvent = doc.data();
    if (existingEvent.trainerId !== trainerId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Restriction: Only Admin Interaction allowed
    if (type && type !== "meeting") {
      return res.status(400).json({
        success: false,
        message: "Only 'Admin Interaction' events are allowed."
      });
    }

    const updatedData = {
      title: title || existingEvent.title,
      type: type || existingEvent.type,
      date: date || existingEvent.date,
      startTime: startTime || existingEvent.startTime,
      endTime: endTime || existingEvent.endTime,
      meetingLink: meetingLink !== undefined ? meetingLink : existingEvent.meetingLink,
      description: description !== undefined ? description : existingEvent.description,
      status: "ACTIVE", // Reset status if updated, or keep ACTIVE
      updatedAt: Date.now()
    };

    await eventDocRef.update(updatedData);

    const fullUpdatedEvent = { id, ...existingEvent, ...updatedData };

    // Trigger Email
    await sendCalendarEventEmail(fullUpdatedEvent, true, trainerEmail);

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: fullUpdatedEvent
    });
  } catch (error) {
    console.error("Error updating calendar event:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * DELETE /api/calendar/events/:id
 */
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const trainerId = req.user.id;

    const eventDocRef = calendarRef.doc(id);
    const doc = await eventDocRef.get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (doc.data().trainerId !== trainerId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await eventDocRef.delete();
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

