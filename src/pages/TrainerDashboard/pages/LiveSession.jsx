import React, { useState } from "react";
import "./LiveSession.css";

const timeOptions = [
  "08:00 AM", "09:00 AM", "10:00 AM",
  "11:00 AM", "12:00 PM", "01:00 PM",
  "02:00 PM", "03:00 PM", "04:00 PM"
];

const days = [
  "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday", "Sunday"
];

const LiveSession = () => {
  const [meetingLink, setMeetingLink] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [schedule, setSchedule] = useState(
    days.map(day => ({
      day,
      enabled: true,
      start: "09:00 AM",
      end: "10:00 AM"
    }))
  );

  const handleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const isDisabled = !meetingLink;

  return (
    <div className="live-session-container">

      {/* 🔥 CENTERED HEADER */}
      <div className="page-header">
        <h1>Live Session Manager</h1>
        <p>Set up and control your live class schedule efficiently</p>
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
          <div className="input-wrapper">
            <span className="icon">🔗</span>
            <input
              type="text"
              placeholder="Paste Google Meet / Teams link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
        </div>

        {/* Time Buttons */}
        <div className="top-time-row">
          <button className="time-btn">Start: 9:00 AM</button>
          <button className="time-btn">End: 10:00 AM</button>
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

              </div>
            ))}
          </div>
        )}

        {/* Save */}
        <button className="save-btn" disabled={isDisabled}>
          Save Details
        </button>

      </div>
    </div>
  );
};

export default LiveSession;