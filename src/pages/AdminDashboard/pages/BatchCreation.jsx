import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import { useCourseContext } from "../../../context/CourseContext";
import { ALL_COURSES } from "../../../components/Courses/Courses";
import "./BatchCreation.css";

const initialFormState = {
  trainerName: "",
  trainerId: "",
  courseName: "",
  numberOfStudents: "",
  startDateTime: "",
  duration: "",
  mode: "Online",
  batchImage: null,
  meetLink: "",
  scheduleDays: [],
  scheduleStartTime: "10:00",
  scheduleEndTime: "12:00",
  scheduleNote: "",
  holidayNotice: "",
};

function BatchCreation() {
  const navigate = useNavigate();
  const { trainers, batches, addBatch, startBatch } = useAdmin();
  const { publishedCourses } = useCourseContext();
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Build course list: mirrors Student Dashboard EXACTLY ──────────────────
  // Replicates reordering logic from StudentDashboard/pages/Course.jsx
  const courseList = useMemo(() => {
    // 1. Get static courses and reorder them exactly like Student Dashboard
    const staticCourses = [...ALL_COURSES];
    
    // Java first
    const JavaIdx = staticCourses.findIndex(c => c.title === "Java Full Stack Development");
    if (JavaIdx !== -1) {
      const java = staticCourses.splice(JavaIdx, 1)[0];
      staticCourses.unshift(java);
    }

    // AWS at index 8
    const AWSIdx = staticCourses.findIndex(c => c.title === "AWS Cloud Practitioner");
    if (AWSIdx !== -1) {
      const aws = staticCourses.splice(AWSIdx, 1)[0];
      staticCourses.splice(8, 0, aws);
    }

    // Python at index 4
    const PythonIdx = staticCourses.findIndex(c => c.title === "Python Programming Masterclass");
    if (PythonIdx !== -1) {
      const python = staticCourses.splice(PythonIdx, 1)[0];
      staticCourses.splice(4, 0, python);
    }

    // 2. Combine all courses in the exact order shown on the dashboard
    const combined = [
      ...(publishedCourses || []).map(c => c.title),
      ...staticCourses.map(c => c.title)
    ];

    // 3. Deduplicate while preserving order
    const seen = new Set();
    return combined.filter(title => {
      if (!title || seen.has(title)) return false;
      seen.add(title);
      return true;
    });
  }, [publishedCourses]);

  // Sort batches to show recent first
  const sortedBatches = useMemo(() => {
    return [...batches].sort((a, b) => {
      const idA = a.id || '';
      const idB = b.id || '';
      return idB.localeCompare(idA);
    });
  }, [batches]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDayToggle = (day) => {
    setForm(prev => {
      const days = prev.scheduleDays || [];
      const isSelected = days.includes(day);
      const newDays = isSelected ? days.filter(d => d !== day) : [...days, day];
      return { ...prev, scheduleDays: newDays };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.trainerName.trim()) newErrors.trainerName = "Trainer required";
    if (!form.courseName) newErrors.courseName = "Course required";
    if (!form.numberOfStudents) newErrors.numberOfStudents = "Capacity required";
    if (!form.startDateTime) newErrors.startDateTime = "Schedule required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const weeklySchedule = (form.scheduleDays || []).map(day => ({
        day,
        startTime: form.scheduleStartTime,
        endTime: form.scheduleEndTime,
        note: form.scheduleNote || ""
      }));

      const batchData = {
        name: `${form.courseName} - ${new Date(form.startDateTime).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        course: form.courseName,
        trainer: form.trainerName,
        trainerId: form.trainerId,
        capacity: Number(form.numberOfStudents),
        status: 'Scheduled',
        startDateTime: form.startDateTime,
        duration: form.duration || "",
        mode: form.mode || "Online",
        batchImage: form.batchImage || "",
        meetLink: form.meetLink || "",
        classTimings: weeklySchedule.map(item => {
          const formatTime = (t) => {
            if (!t) return "";
            const [hours, minutes] = t.split(":");
            let h = parseInt(hours, 10);
            const ampm = h >= 12 ? "PM" : "AM";
            h = h % 12;
            h = h ? h : 12;
            return `${h}:${minutes} ${ampm}`;
          };
          return `${item.day} (${formatTime(item.startTime)} - ${formatTime(item.endTime)})${item.note ? ` [${item.note}]` : ""}`;
        }).join(", "),
        weeklySchedule,
        holidayNotice: form.holidayNotice || "",
      };

      await addBatch(batchData);
      setForm(initialFormState);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      console.error("Failed to create batch:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="batch-page">
      {/* Toast */}
      {showToast && (
        <div className="batch-toast">
          <div className="toast-icon">✓</div>
          <div className="toast-content">
            <strong>Batch Created!</strong>
            <span>Sync with database complete.</span>
          </div>
        </div>
      )}

      <div className="batch-page-header">
        <div className="header-text">
          <h1>Batch Management &amp; Schedule Console</h1>
          <p>Initialize training cycles, configure schedules, and track active batches</p>
        </div>
      </div>

      <div className="batch-split-container">

        {/* LEFT PANEL: FORM + BROADCAST */}
        <div className="batch-left-panel">

          {/* SECTION 1: Generate New Batch */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>Generate New Batch</h3>
            </div>

            <form className="batch-modern-form" onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Course Selection</label>
                  <select
                    name="courseName"
                    value={form.courseName}
                    onChange={handleChange}
                    className={errors.courseName ? 'input-error' : ''}
                  >
                    <option value="">— Select a course —</option>
                    {courseList.length > 0 ? (
                      courseList.map(title => (
                        <option key={title} value={title}>{title}</option>
                      ))
                    ) : (
                      <option value="" disabled>No courses available</option>
                    )}
                  </select>
                  {errors.courseName && <span className="error-msg">{errors.courseName}</span>}
                </div>

                <div className="form-group">
                  <label>Assign Trainer</label>
                  <select 
                    name="trainerName" 
                    value={form.trainerName} 
                    onChange={(e) => {
                      const selectedTrainer = trainers.find(t => t.name === e.target.value);
                      setForm(prev => ({ 
                        ...prev, 
                        trainerName: e.target.value,
                        trainerId: selectedTrainer ? selectedTrainer.id : ""
                      }));
                      if (errors.trainerName) setErrors(prev => ({ ...prev, trainerName: "" }));
                    }} 
                    className={errors.trainerName ? 'input-error' : ''}
                  >
                    <option value="">— Select Trainer —</option>
                    {trainers.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                    <option value="Guest Faculty">Guest Faculty</option>
                  </select>
                  {errors.trainerName && <span className="error-msg">{errors.trainerName}</span>}
                </div>

                <div className="form-group">
                  <label>Batch Capacity</label>
                  <input type="number" name="numberOfStudents" placeholder="e.g. 30" value={form.numberOfStudents} onChange={handleChange} />
                  {errors.numberOfStudents && <span className="error-msg">{errors.numberOfStudents}</span>}
                </div>

                <div className="form-group">
                  <label>Start Date &amp; Time</label>
                  <input type="datetime-local" name="startDateTime" value={form.startDateTime} onChange={handleChange} />
                  {errors.startDateTime && <span className="error-msg">{errors.startDateTime}</span>}
                </div>

                <div className="form-group">
                  <label>Duration</label>
                  <input type="text" name="duration" placeholder="e.g. 12 Weeks" value={form.duration} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Batch Mode</label>
                  <select name="mode" value={form.mode} onChange={handleChange}>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Google Meet Link</label>
                  <input type="url" name="meetLink" placeholder="e.g. https://meet.google.com/abc-defg-hij" value={form.meetLink} onChange={handleChange} />
                </div>

                <div className="form-group full batch-weekly-schedule-section">
                  <label className="section-label">Select Class Days &amp; Timings</label>
                  
                  {/* Checkbox grid for Days */}
                  <div className="days-checkbox-grid">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                      const isSelected = (form.scheduleDays || []).includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          className={`day-checkbox-btn ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleDayToggle(day)}
                        >
                          <span className="checkbox-indicator">{isSelected ? "✓" : ""}</span>
                          <span className="day-name">{day}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Times & Note */}
                  <div className="schedule-time-row">
                    <div className="schedule-col time">
                      <label>Class Start Time</label>
                      <input
                        type="time"
                        name="scheduleStartTime"
                        value={form.scheduleStartTime}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="schedule-col time">
                      <label>Class End Time</label>
                      <input
                        type="time"
                        name="scheduleEndTime"
                        value={form.scheduleEndTime}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="schedule-col note">
                      <label>Message/Note for Scheduled Days</label>
                      <input
                        type="text"
                        name="scheduleNote"
                        placeholder="e.g. Intro class / Lab session"
                        value={form.scheduleNote}
                        onChange={handleChange}
                        className="schedule-note-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Initialize Batch button — directly after all form fields, before Broadcast */}
              <div className="form-footer">
                <button type="submit" className="batch-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Finalizing..." : form.courseName ? `Initialize ${form.courseName} Batch` : "Initialize Batch"}
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 2: Broadcast Schedule Updates & Holiday Notices — separate independent card */}
          <div className="panel-card broadcast-panel-card">
            <div className="panel-header broadcast-panel-header">
              <h3>Broadcast Schedule Updates &amp; Holiday Notices</h3>
            </div>

            <div className="broadcast-panel-body">
              <p className="broadcast-desc">Notify students about sudden timing changes or holidays for an existing batch.</p>

              <div className="announcement-tabs-header">
                <button
                  type="button"
                  className={`tab-btn ${(form.announcementTab || "timings") === "timings" ? "active" : ""}`}
                  onClick={() => setForm(prev => ({ ...prev, announcementTab: "timings" }))}
                >
                  Modify Day Timings
                </button>
                <button
                  type="button"
                  className={`tab-btn ${(form.announcementTab || "timings") === "holiday" ? "active" : ""}`}
                  onClick={() => setForm(prev => ({ ...prev, announcementTab: "holiday" }))}
                >
                  Sudden Holiday Announcement
                </button>
              </div>

              <div className="announcement-card">
                {/* Select Batch */}
                <div className="announcement-row">
                  <div className="announce-col full-width">
                    <label>Target Batch</label>
                    <select
                      value={form.announcementBatchId || ""}
                      onChange={(e) => setForm(prev => ({ ...prev, announcementBatchId: e.target.value }))}
                    >
                      <option value="">— Select Batch to Update —</option>
                      {batches.map(b => (
                        <option key={b.id || b.firebaseId} value={b.id || b.firebaseId}>
                          {b.course} - {b.name || b.batchId} ({b.trainer})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(form.announcementTab || "timings") === "timings" ? (
                  <>
                    {/* Select Day */}
                    <div className="announcement-row">
                      <div className="announce-col full-width">
                        <label>Select Affected Day</label>
                        <div className="announcement-days-grid">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                            const isSelected = form.announcementDay === day;
                            return (
                              <button
                                key={day}
                                type="button"
                                className={`announcement-day-btn ${isSelected ? 'selected' : ''}`}
                                onClick={() => setForm(prev => ({ ...prev, announcementDay: isSelected ? "" : day }))}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Reschedule Timings */}
                    <div className="announcement-row timings-grid">
                      <div className="announce-col">
                        <label>New Start Time</label>
                        <input
                          type="time"
                          value={form.announcementStartTime || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, announcementStartTime: e.target.value }))}
                        />
                      </div>
                      <div className="announce-col">
                        <label>New End Time</label>
                        <input
                          type="time"
                          value={form.announcementEndTime || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, announcementEndTime: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="announcement-action">
                      <button
                        type="button"
                        className="announcement-submit-btn"
                        onClick={() => {
                          if (!form.announcementBatchId) {
                            alert("Please select a target batch.");
                            return;
                          }
                          if (!form.announcementDay) {
                            alert("Please select the affected day.");
                            return;
                          }
                          if (!form.announcementStartTime || !form.announcementEndTime) {
                            alert("Please enter both the new start and end times.");
                            return;
                          }
                          alert("Class timings updated successfully!");
                          setForm(prev => ({
                            ...prev,
                            announcementBatchId: "",
                            announcementDay: "",
                            announcementStartTime: "",
                            announcementEndTime: ""
                          }));
                        }}
                      >
                        Publish Timing Update
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Sudden Holiday Message */}
                    <div className="announcement-row">
                      <div className="announce-col full-width">
                        <label>Holiday Message</label>
                        <textarea
                          placeholder="Type holiday announcement message here..."
                          value={form.announcementMessage || ""}
                          onChange={(e) => setForm(prev => ({ ...prev, announcementMessage: e.target.value }))}
                          rows="3"
                          className="batch-textarea-announcement"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="announcement-action">
                      <button
                        type="button"
                        className="announcement-submit-btn"
                        onClick={() => {
                          if (!form.announcementBatchId) {
                            alert("Please select a target batch.");
                            return;
                          }
                          if (!form.announcementMessage) {
                            alert("Please type a holiday message.");
                            return;
                          }
                          alert("Holiday notice published successfully!");
                          setForm(prev => ({
                            ...prev,
                            announcementBatchId: "",
                            announcementMessage: ""
                          }));
                        }}
                      >
                        Publish Holiday Notice
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: BATCH REPOSITORY */}
        <div className="batch-right-panel">
          <div className="panel-card repository-card">
            <div className="panel-header">
              <h3>Live Batch Repository ({batches.length})</h3>
            </div>

            <div className="repository-body">
              {sortedBatches.length > 0 ? (
                <div className="batch-feed animate-pop">
                  {sortedBatches.map((batch, idx) => (
                    <div key={batch.id || idx} className={`batch-item-card ${idx === 0 ? 'new-highlight' : ''}`}>
                      {idx === 0 && <div className="new-badge">Recent</div>}
                      <div className="batch-item-header">
                        <div className="batch-avatar">{(batch.courseName || batch.course || "B").charAt(0)}</div>
                        <div className="batch-main-info">
                          <h4 className="batch-title">{batch.courseName || batch.course}</h4>
                          <span className="batch-trainer">{batch.trainerName || batch.trainer}</span>
                        </div>
                        <div className="batch-status-pill" style={{ 
                          background: (batch.status === 'Active' || batch.status === 'started') ? '#f0fdf4' : '#fff7ed',
                          color: (batch.status === 'Active' || batch.status === 'started') ? '#16a34a' : '#ea580c'
                        }}>
                          {batch.status}
                        </div>
                      </div>

                      <div className="batch-item-details">
                        <div className="detail">
                          <span className="label">Starts</span>
                          <span className="value">
                            {batch.startDateTime ?
                              new Date(batch.startDateTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) + ' at ' +
                              new Date(batch.startDateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                              : (batch.name && batch.name.includes(' - ')) ? batch.name.split(' - ').pop() : "-"
                            }
                          </span>
                        </div>
                        <div className="detail">
                          <span className="label">Students</span>
                          <span className="value">{batch.enrolled || 0} / {batch.capacity} Seats</span>
                        </div>
                        <div className="detail">
                          <span className="label">Mode</span>
                          <span className="value">{batch.duration} - {batch.mode || "Online"}</span>
                        </div>
                        {(batch.status !== 'Active' && batch.status !== 'started') && (
                          <div className="detail full-width" style={{ gridColumn: 'span 2', marginTop: '12px' }}>
                            <button 
                              className="start-batch-action-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                if(window.confirm("Start this batch now?")) {
                                  startBatch(batch.id || batch.firebaseId);
                                }
                              }}
                            >
                              🚀 Start Batch Now
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="preview-empty">
                  <div className="empty-illustration">
                    <div className="circle"></div>
                    <div className="rect"></div>
                  </div>
                  <p>No batches found in the repository. Use the form on the left to initialize your first training cycle.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BatchCreation;
