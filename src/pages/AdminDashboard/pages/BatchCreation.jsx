import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import { useCourseContext } from "../../../context/CourseContext";
import { ALL_COURSES } from "../../../components/Courses/Courses";
import "./BatchCreation.css";

const initialFormState = {
  trainerName: "",
  courseName: "",
  numberOfStudents: "",
  startDateTime: "",
  duration: "",
  batchImage: null,
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
      const batchData = {
        name: `${form.courseName} - ${new Date(form.startDateTime).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
        course: form.courseName,
        trainer: form.trainerName,
        capacity: Number(form.numberOfStudents),
        status: 'Scheduled',
        startDateTime: form.startDateTime,
        duration: form.duration || "",
        batchImage: form.batchImage || ""
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
          <h1>Batch Management Console</h1>
          <p>Initialize training cycles and track active batches</p>
        </div>
      </div>

      <div className="batch-split-container">

        {/* LEFT PANEL: FORM */}
        <div className="batch-left-panel">
          <div className="panel-card">
            <div className="panel-header">
              {/* Icon removed as per requirement */}
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
                  <select name="trainerName" value={form.trainerName} onChange={handleChange} className={errors.trainerName ? 'input-error' : ''}>
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
              </div>

              <div className="form-footer">
                <button type="submit" className="batch-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Finalizing..." : form.courseName ? `Start ${form.courseName} Batch` : "Initialize Batch"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: BATCH REPOSITORY */}
        <div className="batch-right-panel">
          <div className="panel-card repository-card">
            <div className="panel-header">
              {/* Icon removed as per requirement */}
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
                          background: batch.status === 'Active' ? '#f0fdf4' : '#fff7ed',
                          color: batch.status === 'Active' ? '#16a34a' : '#ea580c'
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
                        {batch.status !== 'Active' && (
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
