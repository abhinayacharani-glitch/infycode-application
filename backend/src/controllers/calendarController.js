import db from "../config/firebase.js";
import { sendCalendarEventEmail } from "../services/emailService.js";

const calendarRef = db.ref("trainerCalendarEvents");

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

    const newEventRef = calendarRef.push();
    const eventData = {
      id: newEventRef.key,
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

    await newEventRef.set(eventData);

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
    const snapshot = await calendarRef.orderByChild("trainerId").equalTo(trainerId).once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({ success: true, events: [] });
    }

    const events = [];
    const updates = {};
    const now = Date.now();

    snapshot.forEach((child) => {
      const event = child.val();
      
      // Automatic completion handling
      if (event.status === "ACTIVE" && checkCompletion(event)) {
        event.status = "COMPLETED";
        updates[`${child.key}/status`] = "COMPLETED";
      }

      // Return only ACTIVE events (as per requirement 6)
      if (event.status === "ACTIVE") {
        events.push(event);
      }
    });

    if (Object.keys(updates).length > 0) {
      await calendarRef.update(updates);
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
    const trainerName = req.user.fullName || "Trainer";

    const eventRef = calendarRef.child(id);
    const snapshot = await eventRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const existingEvent = snapshot.val();
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
      ...existingEvent,
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

    await eventRef.set(updatedData);

    // Trigger Email
    await sendCalendarEventEmail(updatedData, true, trainerEmail);

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: updatedData
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

    const eventRef = calendarRef.child(id);
    const snapshot = await eventRef.once("value");

    if (!snapshot.exists()) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    if (snapshot.val().trainerId !== trainerId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await eventRef.remove();
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
