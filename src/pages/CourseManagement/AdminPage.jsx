import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle, Image as ImageIcon, Briefcase, Clock,
  Layers, User, Tag, ArrowLeft, BookOpen, CheckCircle2, AlertCircle
} from 'lucide-react';
import { createCourse } from '../../services/api';
import './AdminPage.css';

const CATEGORIES = ['Development', 'Design', 'Marketing', 'Business', 'Data Science', 'Cloud & DevOps'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const AdminPage = ({ onCoursePublished }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', description: '', instructor: '',
    category: 'Development', duration: '', level: 'Beginner', imageUrl: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Use URL instead of large base64 to stay within payload limits
    const objectUrl = URL.createObjectURL(file);
    // Store as a placeholder URL; backend will use default Unsplash if no proper URL
    setFormData(prev => ({
      ...prev,
      imageUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${Date.now()}`
    }));
    // For local preview only
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, _previewUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        instructor: formData.instructor,
        category: formData.category,
        duration: formData.duration,
        level: formData.level,
        imageUrl: formData.imageUrl ||
          `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
      };

      const data = await createCourse(payload);

      // Notify parent so the new course appears immediately in the feed
      if (onCoursePublished) onCoursePublished(data.course);

      setSubmitted(true);
      setTimeout(() => navigate('/coursepage'), 1800);
    } catch (err) {
      setError(err.message || 'Failed to publish course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="ap-success-screen">
        <div className="ap-success-card">
          <div className="ap-success-icon"><CheckCircle2 size={56} /></div>
          <h2>Course Published!</h2>
          <p>Your course <strong>"{formData.title}"</strong> is now live in the feed.</p>
          <div className="ap-success-loader" />
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <div className="ap-page">
      {/* Hero Header */}
      <div className="ap-hero">
        <div className="ap-hero-inner">
          <button className="ap-back-btn" onClick={() => navigate('/coursepage')}>
            <ArrowLeft size={16} /> Back to Feed
          </button>
          <div className="ap-hero-badge"><BookOpen size={14} /> Course Creator Studio</div>
          <h1 className="ap-hero-title">Publish a Professional Course</h1>
          <p className="ap-hero-sub">Fill in the details below and launch your course to thousands of learners.</p>
        </div>
        <div className="ap-hero-blur ap-blur-1" />
        <div className="ap-hero-blur ap-blur-2" />
      </div>

      {/* Form Body */}
      <div className="ap-body">
        <form className="ap-form" onSubmit={handleSubmit}>

          {/* Error Banner */}
          {error && (
            <div className="ap-error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Section 01: Course Info */}
          <div className="ap-section-label"><span>01</span> Course Information</div>
          <div className="ap-grid-2">
            <div className="ap-field ap-col-span-2">
              <label><Tag size={15} /> Course Title</label>
              <input
                type="text" name="title" value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Master React & Next.js in 2025"
                required
              />
            </div>
            <div className="ap-field ap-col-span-2">
              <label><Briefcase size={15} /> Description</label>
              <textarea
                name="description" value={formData.description}
                onChange={handleChange}
                placeholder="Provide a compelling overview of what students will learn..."
                required
              />
            </div>
          </div>

          {/* Section 02: Instructor & Metadata */}
          <div className="ap-section-label"><span>02</span> Instructor &amp; Metadata</div>
          <div className="ap-grid-3">
            <div className="ap-field">
              <label><User size={15} /> Instructor Name</label>
              <input
                type="text" name="instructor" value={formData.instructor}
                onChange={handleChange}
                placeholder="e.g. Dr. John Smith"
                required
              />
            </div>
            <div className="ap-field">
              <label><Tag size={15} /> Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="ap-field">
              <label><Clock size={15} /> Duration</label>
              <input
                type="text" name="duration" value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 14h 30m"
                required
              />
            </div>
            <div className="ap-field">
              <label><Layers size={15} /> Difficulty Level</label>
              <select name="level" value={formData.level} onChange={handleChange}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="ap-field ap-col-span-2">
              <label><ImageIcon size={15} /> Course Cover Image</label>
              <div className="ap-file-zone">
                <input
                  type="file" accept="image/*"
                  onChange={handleImageChange}
                  className="ap-file-input"
                />
                <div className="ap-file-label">
                  <ImageIcon size={22} />
                  <span>{formData._previewUrl ? '✓ Image selected' : 'Click to upload or drag & drop'}</span>
                  <small>PNG, JPG up to 10MB</small>
                </div>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {formData._previewUrl && (
            <div className="ap-preview">
              <img src={formData._previewUrl} alt="Preview" />
              <div className="ap-preview-badge">Preview</div>
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="ap-submit-btn" disabled={submitting}>
            {submitting ? (
              <><span className="ap-spinner" /> Publishing...</>
            ) : (
              <><PlusCircle size={20} /> Publish Professional Course</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPage;
