import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getTrainerBatchesAPI, saveTrainerLiveSessionAPI } from "../../../services/api";
import { ArrowLeft } from "lucide-react";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, date, time } = location.state || {};

  const getTodayName = () => days[(new Date().getDay() + 6) % 7];
  const todayName = getTodayName();

  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [savedHint, setSavedHint] = useState(false);
  const [topTimings, setTopTimings] = useState({ start: "09:00 AM", end: "10:00 AM" });
  const [lastEditedDay, setLastEditedDay] = useState(todayName);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [schedule, setSchedule] = useState(
    days.map(day => ({
      day,
      enabled: true,
      start: "09:00 AM",
      end: "10:00 AM",
      reason: ""
    }))
  );

  // Fetch trainer's batches
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await getTrainerBatchesAPI();
        if (res.success) {
          // getTrainerBatchesAPI returns an array under `batches`
          const batchList = Array.isArray(res.batches) ? res.batches : Object.values(res.batches || {});
          setBatches(batchList);
          if (batchList.length > 0) {
            setSelectedBatchId(batchList[0].firebaseId || batchList[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching batches:", err.message);
      }
    };
    fetchBatches();
  }, []);

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
  const isDisabled = !hasMeetingLink || isMeetingLinkInvalid || hasMissingReason || !selectedBatchId || loading;

  const handleSave = async () => {
    if (isDisabled) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await saveTrainerLiveSessionAPI({
        batchId: selectedBatchId,
        meetingLink: meetingLink.trim(),
        weeklySchedule: schedule.map(item => ({
          day: item.day,
          enabled: item.enabled,
          start: item.start,
          end: item.end,
          reason: item.enabled ? "" : item.reason.trim()
        }))
      });

      if (res.success) {
        setSavedHint(true);
        const activeDaySchedule = schedule.find((item) => item.day === todayName) || schedule[0];
        setTopTimings({ start: activeDaySchedule.start, end: activeDaySchedule.end });
        setTimeout(() => setSavedHint(false), 2500);
      } else {
        setErrorMessage(res.message || "Failed to save live session details.");
      }
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-session-container">

      <div className="back-btn-wrapper">
        <button className="back-btn" onClick={() => navigate('/trainer-dashboard/schedule')}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      {/* 🔥 HEADER */}
      <div className="page-header" style={{ width: "100%", maxWidth: "450px" }}>
        <h1>Live Session</h1>
        <p>
          Manage and start your live classroom sessions
        </p>
      </div>

      {/* 🔥 SESSION OUTPUT BANNER */}
      <div className={`session-output-banner ${topic ? 'active' : 'inactive'}`}>
        <div className="banner-left">
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            {topic ? "Live Content" : "No Session Selected"}
          </div>
          <h2 className="banner-topic">{topic || "No Active Session Overview"}</h2>
          <div className="banner-meta">
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <span>{date || "-- -- --"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⏰</span>
              <span>{time || "-- : --"}</span>
            </div>
          </div>
        </div>
        <div className="banner-right">
          <button
            className="banner-cta"
            disabled={!meetingLink || isMeetingLinkInvalid}
            onClick={() => window.open(meetingLink, '_blank')}
          >
            Launch Classroom
          </button>
        </div>
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

        {/* Batch Selector */}
        <div className="form-group">
          <label>Select Batch</label>
          <div className="input-wrapper">
            <span className="icon">🎓</span>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="batch-selector"
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "14px",
                padding: "8px 0",
                color: "#1e293b"
              }}
            >
              <option value="" disabled>-- Select a Batch --</option>
              {batches.map((batch) => (
                <option key={batch.firebaseId || batch.id} value={batch.firebaseId || batch.id}>
                  {batch.name || batch.batchName} ({batch.course || batch.courseName})
                </option>
              ))}
            </select>
          </div>
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

        {errorMessage && (
          <div className="error-text" style={{ color: "#ef4444", marginBottom: "10px", fontSize: "14px" }}>
            {errorMessage}
          </div>
        )}

        {/* Save */}
        <button className="save-btn" disabled={isDisabled} onClick={handleSave}>
          {loading ? "Saving..." : "Save Details"}
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
              animation: "fade-in 0.3s ease-in-out",
              marginTop: "10px",
              textAlign: "center"
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