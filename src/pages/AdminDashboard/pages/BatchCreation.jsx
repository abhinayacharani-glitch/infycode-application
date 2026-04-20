import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BatchCreation.css";

// No static student list needed for ID range
const COURSE_LIST = [
  "Full Stack Development",
  "Data Science & AI",
  "Cloud Computing",
  "Cyber Security",
  "DevOps Engineering",
  "UI/UX Design",
  "Mobile App Development",
  "Machine Learning",
];

const initialFormState = {
  trainerName: "",
  courseName: "",
  numberOfStudents: "",
  studentIdFrom: "",
  studentIdTo: "",
  startDateTime: "",
  duration: "",
  batchImage: null,
};

function BatchCreation() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);
  const [batches, setBatches] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, batchImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.trainerName.trim())
      newErrors.trainerName = "Trainer name is required";
    if (!form.courseName) newErrors.courseName = "Please select a course";
    if (
      !form.numberOfStudents ||
      isNaN(form.numberOfStudents) ||
      Number(form.numberOfStudents) <= 0
    )
      newErrors.numberOfStudents = "Enter a valid number";
    if (!form.studentIdFrom.trim())
      newErrors.studentIdFrom = "Start ID is required";
    if (!form.studentIdTo.trim())
      newErrors.studentIdTo = "End ID is required";
    if (!form.startDateTime)
      newErrors.startDateTime = "Start date & time is required";
    if (!form.duration.trim()) newErrors.duration = "Duration is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newBatch = {
      ...form,
      id: Date.now(),
      numberOfStudents: Number(form.numberOfStudents),
    };

    setBatches((prev) => [newBatch, ...prev]);
    setForm(initialFormState);
    setShowForm(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="batch-page">
      {/* Top Navbar */}

      <div className="batch-content-wrapper">
        {/* Toast */}
      {showToast && (
        <div className="batch-toast">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          Batch created successfully!
        </div>
      )}

      {/* Header */}
      <div className="batch-page__header">
        <h1> Batch Creation</h1>
        <p>Create and manage training batches for your courses</p>
      </div>

      {/* Create New Batch Button (when form is hidden) */}
      {!showForm && (
        <button
          className="batch-new-btn"
          onClick={() => setShowForm(true)}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          Create New Batch
        </button>
      )}

      {/* Form Card */}
      {showForm && (
        <div className="batch-card">
          <form className="batch-form" onSubmit={handleSubmit} noValidate>
            
            {/* Section 1: Course Info */}
            <div className="form-section">
              <h3 className="form-section__title">Course Info</h3>
              <div className="form-section__divider" />
              <div className="batch-form__row">
                <div className="batch-form__group">
                  <label htmlFor="courseName">Course Name</label>
                  <select
                    id="courseName"
                    name="courseName"
                    value={form.courseName}
                    onChange={handleChange}
                  >
                    <option value="">— Select a course —</option>
                    {COURSE_LIST.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                  {errors.courseName && <span className="batch-form__error">{errors.courseName}</span>}
                </div>
                <div className="batch-form__group">
                  <label htmlFor="trainerName">Trainer Name</label>
                  <input
                    id="trainerName"
                    type="text"
                    name="trainerName"
                    placeholder="e.g. Dr. Smith"
                    value={form.trainerName}
                    onChange={handleChange}
                  />
                  {errors.trainerName && <span className="batch-form__error">{errors.trainerName}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Batch Details */}
            <div className="form-section">
              <h3 className="form-section__title">Batch Details</h3>
              <div className="form-section__divider" />
              <div className="batch-form__row">
                <div className="batch-form__group">
                  <label htmlFor="numberOfStudents">Number of Students</label>
                  <input
                    id="numberOfStudents"
                    type="number"
                    name="numberOfStudents"
                    placeholder="e.g. 25"
                    value={form.numberOfStudents}
                    onChange={handleChange}
                  />
                  {errors.numberOfStudents && <span className="batch-form__error">{errors.numberOfStudents}</span>}
                </div>
                <div className="batch-form__group">
                  <label htmlFor="duration">Duration</label>
                  <input
                    id="duration"
                    type="text"
                    name="duration"
                    placeholder="e.g. 6 Weeks"
                    value={form.duration}
                    onChange={handleChange}
                  />
                  {errors.duration && <span className="batch-form__error">{errors.duration}</span>}
                </div>
              </div>
            </div>

            {/* Section 3: Schedule */}
            <div className="form-section">
              <h3 className="form-section__title">Schedule</h3>
              <div className="form-section__divider" />
              <div className="batch-form__group">
                <label htmlFor="startDateTime">Start Date & Time</label>
                <input
                  id="startDateTime"
                  type="datetime-local"
                  name="startDateTime"
                  value={form.startDateTime}
                  onChange={handleChange}
                />
                {errors.startDateTime && <span className="batch-form__error">{errors.startDateTime}</span>}
              </div>
            </div>

            {/* Section 4: Student Allocation */}
            <div className="form-section">
              <h3 className="form-section__title">Student Allocation</h3>
              <div className="form-section__divider" />
              <div className="batch-form__row">
                <div className="batch-form__group">
                  <label htmlFor="studentIdFrom">Student ID From</label>
                  <input
                    id="studentIdFrom"
                    type="text"
                    name="studentIdFrom"
                    placeholder="e.g. 101"
                    value={form.studentIdFrom}
                    onChange={handleChange}
                  />
                  {errors.studentIdFrom && <span className="batch-form__error">{errors.studentIdFrom}</span>}
                </div>
                <div className="batch-form__group">
                  <label htmlFor="studentIdTo">Student ID To</label>
                  <input
                    id="studentIdTo"
                    type="text"
                    name="studentIdTo"
                    placeholder="e.g. 120"
                    value={form.studentIdTo}
                    onChange={handleChange}
                  />
                  {errors.studentIdTo && <span className="batch-form__error">{errors.studentIdTo}</span>}
                </div>
              </div>
            </div>

            {/* Section 5: Media */}
            <div className="form-section">
              <h3 className="form-section__title">Batch Media</h3>
              <div className="form-section__divider" />
              <div className="batch-form__group">
                <label>Course Banner / Image</label>
                <div className="image-upload-zone">
                  <input
                    type="file"
                    id="batchImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden-file-input"
                  />
                  <label htmlFor="batchImage" className="upload-label">
                    {form.batchImage ? (
                      <div className="upload-preview">
                        <img src={form.batchImage} alt="Preview" />
                        <span className="change-img-text">Change Image</span>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Click to upload course image</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="batch-form__submit">
              Create Batch
            </button>
          </form>
        </div>
      )}

      {/* Batch Management Section */}
      {batches.length > 0 && (
        <div className="batch-section">
          <div className="batch-section__header">
            <div>
              <h2 className="batch-section__title">Batch Management</h2>
              <p className="batch-section__sub">{batches.length} batch{batches.length > 1 ? "es" : ""} created</p>
            </div>
            <div className="batch-section__divider" />
          </div>

          <div className="batch-grid">
            {batches.map((batch) => (
              <div className="batch-display-card" key={batch.id}>
                <div className="batch-display-card__accent" />

                {/* IMAGE COLUMN */}
                <div className="batch-card__image">
                  {batch.batchImage ? (
                    <img src={batch.batchImage} alt={batch.courseName} />
                  ) : (
                    <div className="batch-card__image-placeholder">
                      <span>{batch.courseName.charAt(0)}</span>
                    </div>
                  )}
                </div>

                {/* LEFT COLUMN: Primary Info */}
                <div className="batch-col col-primary">
                  <h3 className="batch-col__title">{batch.courseName}</h3>
                  <p className="batch-col__subtitle">{batch.trainerName}</p>
                </div>

                {/* CENTER COLUMN: Schedule */}
                <div className="batch-col col-schedule">
                  <div className="batch-col__item">
                    <span className="batch-col__label">Start Date</span>
                    <span className="batch-col__value">
                      {new Date(batch.startDateTime).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                  <div className="batch-col__item">
                    <span className="batch-col__label">Duration</span>
                    <span className="batch-col__value">{batch.duration}</span>
                  </div>
                </div>

                {/* RIGHT COLUMN: Batch Info */}
                <div className="batch-col col-info">
                  <div className="batch-col__item">
                    <span className="batch-col__label">Batch Size</span>
                    <span className="batch-col__value">{batch.numberOfStudents} Students</span>
                  </div>
                  <div className="batch-col__item">
                    <span className="batch-col__label">Student IDs</span>
                    <span className="batch-col__value">
                      <span className="bdc-pill">
                        {batch.studentIdFrom} – {batch.studentIdTo}
                      </span>
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

        {/* Empty State */}
        {batches.length === 0 && !showForm && (
          <div className="batch-empty">
            <svg viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 8v8M8 12h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p>No batches created yet. Click "Create New Batch" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchCreation;
