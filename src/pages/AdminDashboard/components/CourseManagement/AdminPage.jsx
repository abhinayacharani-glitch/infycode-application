import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle, Image as ImageIcon, Briefcase, Clock,
  Layers, User, Tag, ArrowLeft, BookOpen, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../../../context/AdminContext';
import './AdminPage.css';

const CATEGORIES = ['Development', 'Design', 'Marketing', 'Business', 'Data Science', 'Cybersecurity'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const EMPTY_FORM = {
  title: '', description: '', instructor: '',
  category: 'Development', duration: '', level: 'Beginner', imageUrl: '',
  curriculum: ''
};

const AdminPage = ({ onCoursePublished, isEmbedded = false }) => {
  const navigate = useNavigate();
  const { addCourse, syllabuses } = useAdmin();

  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successTitle, setSuccessTitle] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      imageUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${Date.now()}`
    }));
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, _previewUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const renderCurriculumPreview = (text) => {
    if (!text) return <p style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.9rem' }}>No curriculum provided yet.</p>;
    
    // Split into sections by brackets [Heading]
    const sections = text.split(/(?=\[.*\])/g).filter(Boolean);
    
    return sections.map((section, idx) => {
      const lines = section.trim().split('\n').filter(Boolean);
      const headerLine = lines[0];
      const isHeader = headerLine.startsWith('[') && headerLine.endsWith(']');
      const title = isHeader ? headerLine.slice(1, -1) : 'General';
      const topics = isHeader ? lines.slice(1) : lines;

      return (
        <details key={idx} style={{ marginBottom: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white', overflow: 'hidden' }}>
          <summary style={{ padding: '10px 14px', fontWeight: '600', cursor: 'pointer', background: '#f8fafc', color: '#1e293b', listStyle: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '10px' }}>▶</span> {title}
          </summary>
          <div style={{ padding: '12px 18px', borderTop: '1px solid #f1f5f9' }}>
            {topics.map((t, i) => (
              <p key={i} style={{ margin: '4px 0', fontSize: '0.875rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '4px', height: '4px', background: '#6366f1', borderRadius: '50%' }} /> {t}
              </p>
            ))}
          </div>
        </details>
      );
    });
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
        duration: `${formData.duration} Weeks`,
        level: formData.level,
        curriculum: formData.curriculum,
        imageUrl: formData.imageUrl ||
          `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
      };

      const course = await addCourse(payload);

      if (isEmbedded) {
        if (onCoursePublished) onCoursePublished(course);
      } else {
        setSuccessTitle(formData.title);
        setSubmitted(true);
        setTimeout(() => navigate('/coursepage'), 1800);
      }
    } catch (err) {
      setError(err.message || 'Failed to publish course. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted && !isEmbedded) {
    return (
      <div className="ap-success-screen">
        <div className="ap-success-card">
          <div className="ap-success-icon"><CheckCircle2 size={56} /></div>
          <h2>Course Published!</h2>
          <p>Your course <strong>"{successTitle}"</strong> is now live in the feed.</p>
          <div className="ap-success-loader" />
        </div>
      </div>
    );
  }

  return (
    <div className={`ap-page ${isEmbedded ? 'is-embedded' : ''}`}>
      {!isEmbedded && (
        <div className="ap-hero">
          <div className="ap-hero-inner">
            <button className="ap-back-btn" onClick={() => navigate('/coursepage')}>
              <ArrowLeft size={16} /> Back to Feed
            </button>
            <div className="ap-hero-badge"><BookOpen size={14} /> Course Creation</div>
            <h1 className="ap-hero-title">Publish a  Course</h1>
            <p className="ap-hero-sub">Fill in the details below and launch your course to thousands of learners.</p>
          </div>
        </div>
      )}

      <div className="ap-body">
        <form className="ap-form" onSubmit={handleSubmit}>
          
          {error && (
            <div className="ap-error-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              <AlertCircle size={18} />
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
                placeholder="Provide a compelling overview..."
                required
              />
            </div>
          </div>

          {/* Section 02: Instructor & Metadata */}
          <div className="ap-section-label"><span>02</span> Instructor &amp; Metadata</div>
          <div className="ap-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="ap-field">
              <label><User size={15} /> Instructor</label>
              <input
                type="text" name="instructor" value={formData.instructor}
                onChange={handleChange}
                placeholder="Instructor Name"
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
              <label><Clock size={15} /> Duration (Weeks)</label>
              <input
                type="number" name="duration" value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 12"
                min="1"
                required
              />
            </div>
            <div className="ap-field">
              <label><Layers size={15} /> Level</label>
              <select name="level" value={formData.level} onChange={handleChange}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className="ap-field" style={{ marginTop: '15px' }}>
            <label><ImageIcon size={15} /> Course Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="ap-section-label" style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '30px' }}>
            <span>03</span> Detailed Curriculum
            <select
              defaultValue=""
              onChange={(e) => {
                const val = e.target.value;
                const selectedSyllabus = syllabuses.find(s => s.id === val);
                if (selectedSyllabus) {
                  const formatted = selectedSyllabus.modules.map(m => 
                    `[${m.name}]\n${m.topics.join('\n')}`
                  ).join('\n\n');
                  setFormData(prev => ({ ...prev, curriculum: formatted }));
                }
              }}
              style={{
                marginLeft: 'auto',
                fontSize: '12px',
                padding: '6px 12px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                color: '#475569',
                outline: 'none'
              }}
            >
              <option value="" disabled hidden>Load Syllabus Template</option>
              {syllabuses && [...syllabuses].sort((a, b) => a.title.localeCompare(b.title)).map(s => (
                <option key={s.id} value={s.id}>{s.title}</option>
              ))}
            </select>
          </div>


          <div style={{ gap: '20px', alignItems: 'start' }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '350px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <CheckCircle2 size={18} color="#10b981" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>Curriculum</h4>
              </div>
              <div className="custom-scrollbar" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                {renderCurriculumPreview(formData.curriculum)}
              </div>
            </div>
          </div>

          <button type="submit" className="ap-submit-btn" disabled={submitting} style={{ marginTop: '20px' }}>
            {submitting ? 'Publishing...' : <><PlusCircle size={20} /> Publish Course</>}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminPage;