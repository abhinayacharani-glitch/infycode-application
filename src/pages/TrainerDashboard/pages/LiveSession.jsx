import React, { useState } from "react";
import "./LiveSession.css";

const timeOptions = Array.from({ length: 14 }, (_, i) => {
  const hour24 = i + 8; // 08:00 AM to 09:00 PM
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(hour12).padStart(2, "0")}:00 ${suffix}`;
});

const days = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday", "Sunday"
];

const LiveSession = () => {
  const getTodayName = () => days[(new Date().getDay() + 6) % 7];
  const todayName = getTodayName();
  const [meetingLink, setMeetingLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [savedHint, setSavedHint] = useState(false);
  const [topTimings, setTopTimings] = useState({ start: "09:00 AM", end: "10:00 AM" });
  const [lastEditedDay, setLastEditedDay] = useState(todayName);

  const [schedule, setSchedule] = useState(
    days.map(day => ({
      day,
      enabled: true,
      start: "09:00 AM",
      end: "10:00 AM",
      reason: ""
    }))
  );

  const isValidMeetingLink = (link) => {
    if (!link.trim()) return false;
    return /^https:\/\/(meet\.google\.com\/|teams\.microsoft\.com\/|zoom\.us\/)/i.test(link.trim());
  };

  const to24Hour = (time12) => {
    const [time, suffix] = time12.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (suffix === "PM" && hours !== 12) hours += 12;
    if (suffix === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  };

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
    setLastEditedDay(updated[index].day);
  };

  const hasMeetingLink = meetingLink.trim().length > 0;
  const isMeetingLinkInvalid = hasMeetingLink && !isValidMeetingLink(meetingLink);
  const todaySchedule = schedule.find((item) => item.day === todayName) || schedule[0];
  const hasMissingReason = !todaySchedule.enabled && !todaySchedule.reason.trim();
  const isDisabled = !hasMeetingLink || isMeetingLinkInvalid || hasMissingReason;

  const getStatusForDay = (item) => {
    if (!item.enabled) return "cancelled";
    const now = new Date();
    const weekDayIndex = (now.getDay() + 6) % 7; // Monday = 0
    const itemDayIndex = days.indexOf(item.day);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const [endHour, endMinute] = to24Hour(item.end).split(":").map(Number);
    const endMinutes = endHour * 60 + endMinute;
    if (itemDayIndex === weekDayIndex && nowMinutes > endMinutes) return "completed";
    return "scheduled";
  };

  const handleSave = () => {
    if (isDisabled) return;
    const existingConfig = JSON.parse(localStorage.getItem("live_session_config") || "{}");
    const previousSchedule = Array.isArray(existingConfig.schedule) ? existingConfig.schedule : [];
    const selectedDaySchedule = schedule.find((item) => item.day === lastEditedDay) || todaySchedule;
    const updatedToday = {
      ...selectedDaySchedule,
      status: getStatusForDay(selectedDaySchedule),
      cancellationReason: selectedDaySchedule.enabled ? "" : selectedDaySchedule.reason.trim()
    };
    const scheduleWithStatus = previousSchedule.length > 0
      ? previousSchedule.map((item) => (item.day === todayName ? updatedToday : item))
      : schedule.map((item) => (item.day === todayName ? updatedToday : item));
    const cancellationReason = updatedToday.status === "cancelled"
      ? `${updatedToday.day}: ${updatedToday.cancellationReason}`
      : "";
    const previousTiming = JSON.stringify(
      previousSchedule.map((item) => ({ day: item.day, start: item.start, end: item.end, enabled: item.enabled }))
    );
    const currentTiming = JSON.stringify(
      scheduleWithStatus.map((item) => ({ day: item.day, start: item.start, end: item.end, enabled: item.enabled }))
    );
    const notification = updatedToday.status === "cancelled"
      ? { type: "cancelled", message: `Class Cancelled for ${updatedToday.day}` }
      : previousTiming && previousTiming !== currentTiming
        ? { type: "success", message: "Timing Updated Successfully" }
        : { type: "info", message: "Schedule Updated" };

    localStorage.setItem(
      "live_session_config",
      JSON.stringify({
        ...existingConfig,
        sessionLink: meetingLink.trim(),
        startTime: to24Hour(updatedToday.start),
        endTime: to24Hour(updatedToday.end),
        schedule: scheduleWithStatus,
        cancellationReason,
        notification,
        lastSaved: new Date().toISOString(),
        duration: existingConfig.duration || "1 Month"
      })
    );
    const existingDayWise = JSON.parse(localStorage.getItem("liveSessionData") || "{}");
    existingDayWise[updatedToday.day] = {
      status: updatedToday.enabled ? "scheduled" : "cancelled",
      startTime: updatedToday.start,
      endTime: updatedToday.end,
      reason: updatedToday.enabled ? "" : (updatedToday.cancellationReason || ""),
      updatedAt: new Date().getTime()
    };
    localStorage.setItem("liveSessionData", JSON.stringify(existingDayWise));
    setTopTimings({ start: updatedToday.start, end: updatedToday.end });
    setSavedHint(true);
    setTimeout(() => setSavedHint(false), 2500);
  };

  return (
    <div className="live-session-container">

      {/* 🔥 HEADER */}
      <div className="page-header">
        <h1>Live Session</h1>
        <p>Manage and start your live classroom sessions</p>
      </div>

      <div className="live-session-card">

        {/* Image */}
        <div className="image-container">
          <img
            src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b"
            alt="Live Session"
            className="live-session-image"
          />
        </div>

        {/* Meeting Link */}
        <div className="form-group">
          <label>Meeting Link</label>
          <div className={`input-wrapper ${isMeetingLinkInvalid ? "input-error" : ""}`}>
            <span className="icon">🔗</span>
            <input
              type="text"
              placeholder="Paste Google Meet / Teams link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
          {isMeetingLinkInvalid && (
            <p className="error-text">
              Enter a valid meeting link (Google Meet / Teams / Zoom)
            </p>
          )}
        </div>

        {/* Time Buttons */}
        <div className="top-time-row">
          <button className="time-btn">Start: {topTimings.start}</button>
          <button className="time-btn">End: {topTimings.end}</button>
        </div>

        {/* 🔥 NEW SIDE HEADING */}
        <div className="section-heading">
          Manage Weekly Availability
        </div>

        {/* Dropdown */}
        <div
          className="dropdown-header"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>Edit Session Timings</span>
          <span>{isOpen ? "▲" : "▼"}</span>
        </div>

        {isOpen && (
          <div className="schedule-container">
            {schedule.map((item, index) => (
              <div key={index} className="schedule-row">

                <div className="day">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={(e) =>
                      handleChange(index, "enabled", e.target.checked)
                    }
                  />
                  <span>{item.day}</span>
                </div>

                <select
                  disabled={!item.enabled}
                  value={item.start}
                  onChange={(e) =>
                    handleChange(index, "start", e.target.value)
                  }
                >
                  {timeOptions.map((time, i) => (
                    <option key={i}>{time}</option>
                  ))}
                </select>

                <select
                  disabled={!item.enabled}
                  value={item.end}
                  onChange={(e) =>
                    handleChange(index, "end", e.target.value)
                  }
                >
                  {timeOptions.map((time, i) => (
                    <option key={i}>{time}</option>
                  ))}
                </select>
                {!item.enabled && (
                  <textarea
                    className="reason-input"
                    placeholder="Enter reason for cancelling the session"
                    value={item.reason}
                    onChange={(e) => handleChange(index, "reason", e.target.value)}
                    required
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Save */}
        <button className="save-btn" disabled={isDisabled} onClick={handleSave}>
          Save Details
        </button>
        {savedHint && (
          <div
            style={{
              background: "#eaf9ee",
              color: "#166534",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "8px 10px",
              fontSize: "12px",
              fontWeight: 600,
              animation: "fade-in 0.3s ease-in-out"
            }}
          >
            Data Saved Successfully
          </div>
        )}

      </div>
    </div>
  );
};

export default LiveSession;