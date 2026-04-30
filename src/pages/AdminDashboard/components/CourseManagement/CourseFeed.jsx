import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Layers, PlusCircle, Bookmark,
  Search, Filter, TrendingUp, Edit2, Trash2, Check, X,
  MessageCircle, Send, AlertCircle
} from 'lucide-react';
import './CourseFeed.css';

const LEVEL_COLORS = {
  Beginner: { bg: '#dcfce7', color: '#16a34a' },
  Intermediate: { bg: '#fef9c3', color: '#b45309' },
  Advanced: { bg: '#fee2e2', color: '#dc2626' },
};

function Toast({ message, type = 'error', onClose }) {
  return (
    <div className={`cf-toast cf-toast-${type}`}>
      <AlertCircle size={15} />
      <span>{message}</span>
      <button onClick={onClose}><X size={13} /></button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="cf-card cf-skeleton">
      <div className="cf-skeleton-img" />
      <div className="cf-card-body">
        <div className="cf-skeleton-line cf-sk-short" />
        <div className="cf-skeleton-line" />
        <div className="cf-skeleton-line cf-sk-medium" />
      </div>
    </div>
  );
}

const CourseFeed = ({ courses, onToggleLike, onUpdateCourse, onDeleteCourse, isEmbedded = false }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [likingId, setLikingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const startEdit = (course) => {
    setEditingId(course.id);
    setEditData({
      title: course.title,
      description: course.description,
      category: course.category || 'Development',
      level: course.level || 'Beginner',
      duration: course.duration || '',
      instructor: course.instructor || '',
      curriculum: course.curriculum || '',
    });
  };

  const handleSave = async (id) => {
    setSavingId(id);
    try {
      await onUpdateCourse(id, editData);
      setEditingId(null);
      showToast('Course updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update course.');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setDeletingId(id);
    try {
      await onDeleteCourse(id);
      showToast('Course deleted.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete course.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLike = async (id) => {
    if (likingId === id) return;
    setLikingId(id);
    try {
      await onToggleLike(id);
    } catch (err) {
      showToast(err.message || 'Failed to update like.');
    } finally {
      setLikingId(null);
    }
  };

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

  const filtered = courses.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.instructor || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || c.category === filterCat;
    return matchSearch && matchCat;
  });

  const renderCurriculum = (text) => {
    if (!text) return null;
    const sections = text.split(/(?=\[.*\])/g).filter(Boolean);
    return sections.map((section, idx) => {
      const lines = section.trim().split('\n').filter(Boolean);
      const headerLine = lines[0];
      const isHeader = headerLine.startsWith('[') && headerLine.endsWith(']');
      const title = isHeader ? headerLine.slice(1, -1) : 'General';
      const topics = isHeader ? lines.slice(1) : lines;
      return (
        <details key={idx} style={{ marginBottom: '6px', border: '1px solid #f1f5f9', borderRadius: '6px', background: 'white' }}>
          <summary style={{ padding: '8px 12px', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', background: '#f8fafc', color: '#1e293b', listStyle: 'none' }}>
            {title}
          </summary>
          <div style={{ padding: '8px 14px', borderTop: '1px solid #f1f5f9' }}>
            {topics.map((t, i) => (
              <p key={i} style={{ margin: '3px 0', fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '3px', height: '3px', background: '#6366f1', borderRadius: '50%' }} /> {t}
              </p>
            ))}
          </div>
        </details>
      );
    });
  };

  return (
    <div className="cf-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {!isEmbedded && (
        <div className="cf-hero">
          <div className="cf-hero-inner">
            <div className="cf-hero-eyebrow"><TrendingUp size={14} /> Live Course Feed</div>
            <h1 className="cf-hero-title">Discover Expert Courses</h1>
            <p className="cf-hero-sub">Browse {courses.length} courses published by top instructors.</p>
            <button className="cf-publish-btn" onClick={() => navigate('/admin')}>
              <PlusCircle size={18} /> Publish a Course
            </button>
          </div>
        </div>
      )}

      <div className="cf-controls">
        <div className="cf-search-wrap">
          <Search size={16} className="cf-search-icon" />
          <input
            className="cf-search"
            type="text"
            placeholder="Search courses or instructors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="cf-filter-wrap">
          <Filter size={15} />
          {categories.map(cat => (
            <button
              key={cat}
              className={`cf-chip ${filterCat === cat ? 'active' : ''}`}
              onClick={() => setFilterCat(cat)}
            >{cat}</button>
          ))}
        </div>
      </div>

      <div className="cf-body">
        {courses.length === 0 ? (
          <div className="cf-grid">{[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="cf-empty">
            <Bookmark size={48} strokeWidth={1.2} />
            <h3>No results found</h3>
          </div>
        ) : (
          <div className="cf-grid">
            {filtered.map((course, idx) => {
              const lvl = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner;

              if (editingId === course.id) {
                return (
                  <article key={course.id || idx} className="cf-card cf-edit-card">
                    <h3 className="cf-edit-title">✏️ Edit Course</h3>
                    <div className="cf-edit-field">
                      <label>Title</label>
                      <input className="cf-edit-input" value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
                    </div>
                    <div className="cf-edit-field">
                      <label>Description</label>
                      <textarea className="cf-edit-input" value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                    </div>
                    <div className="cf-edit-row">
                      <div className="cf-edit-field">
                        <label>Instructor</label>
                        <input className="cf-edit-input" value={editData.instructor} onChange={e => setEditData({ ...editData, instructor: e.target.value })} />
                      </div>
                      <div className="cf-edit-field">
                        <label>Duration</label>
                        <input className="cf-edit-input" value={editData.duration} onChange={e => setEditData({ ...editData, duration: e.target.value })} />
                      </div>
                    </div>
                    <div className="cf-edit-field">
                      <label>Detailed Curriculum (Bracket Format)</label>
                      <textarea className="cf-edit-input" value={editData.curriculum} onChange={e => setEditData({ ...editData, curriculum: e.target.value })} style={{ minHeight: '120px', fontFamily: 'monospace' }} />
                    </div>
                    <div className="cf-edit-actions">
                      <button className="cf-edit-save" onClick={() => handleSave(course.id)} disabled={savingId === course.id}>
                        {savingId === course.id ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button className="cf-edit-cancel" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </article>
                );
              }

              return (
                <article key={course.id || idx} className="cf-card">
                  <div className="cf-card-img">
                    <img src={course.imageUrl || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} alt={course.title} />
                    <span className="cf-category-tag">{course.category}</span>
                  </div>
                  <div className="cf-card-body">
                    <div className="cf-instructor">
                      <div className="cf-avatar">{(course.instructor || 'A').charAt(0).toUpperCase()}</div>
                      <span>{course.instructor || 'Anonymous'}</span>
                    </div>
                    <h3 className="cf-card-title">{course.title}</h3>
                    <p className="cf-card-desc">{course.description}</p>
                    <div className="cf-meta">
                      <span className="cf-meta-item"><Clock size={13} /> {course.duration}</span>
                      <span className="cf-level-badge" style={{ background: lvl.bg, color: lvl.color }}>{course.level}</span>
                    </div>

                    <div className="cf-social">
                      <button className="cf-action-btn cf-ml-auto" onClick={() => startEdit(course)}><Edit2 size={15} /></button>
                      <button className="cf-action-btn cf-delete-btn" onClick={() => handleDelete(course.id)}><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="cf-card-footer"><button className="cf-enroll-btn">Enroll Now →</button></div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseFeed;
