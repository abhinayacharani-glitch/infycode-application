import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock, Layers, PlusCircle, Bookmark,
  Search, Filter, TrendingUp, Edit2, Trash2, Check, X,
  Heart, MessageCircle, Send, AlertCircle
} from 'lucide-react';
import './CourseFeed.css';

const LEVEL_COLORS = {
  Beginner:     { bg: '#dcfce7', color: '#16a34a' },
  Intermediate: { bg: '#fef9c3', color: '#b45309' },
  Advanced:     { bg: '#fee2e2', color: '#dc2626' },
};

// ─── Small Toast notification ──────────────────────────────────────────────────
function Toast({ message, type = 'error', onClose }) {
  return (
    <div className={`cf-toast cf-toast-${type}`}>
      <AlertCircle size={15} />
      <span>{message}</span>
      <button onClick={onClose}><X size={13} /></button>
    </div>
  );
}

// ─── Skeleton card shown while data loads ──────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
const CourseFeed = ({ courses, onToggleLike, onUpdateCourse, onDeleteCourse }) => {
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

  // ── Edit handlers ───────────────────────────────────────────────────────────
  const startEdit = (course) => {
    setEditingId(course.id);
    setEditData({
      title:       course.title,
      description: course.description,
      category:    course.category    || 'Development',
      level:       course.level       || 'Beginner',
      duration:    course.duration    || '',
      instructor:  course.instructor  || '',
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

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This cannot be undone.')) return;
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

  // ── Like handler ────────────────────────────────────────────────────────────
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

  // ── Filter / Search ─────────────────────────────────────────────────────────
  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

  const filtered = courses.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.instructor || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || c.category === filterCat;
    return matchSearch && matchCat;
  });

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="cf-page">

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Hero Banner ── */}
      <div className="cf-hero">
        <div className="cf-hero-inner">
          <div className="cf-hero-eyebrow"><TrendingUp size={14} /> Live Course Feed</div>
          <h1 className="cf-hero-title">Discover Expert Courses</h1>
          <p className="cf-hero-sub">
            Browse {courses.length} professional course{courses.length !== 1 ? 's' : ''} published by top instructors.
          </p>
          <button className="cf-publish-btn" onClick={() => navigate('/admin')}>
            <PlusCircle size={18} /> Publish a Course
          </button>
        </div>
        <div className="cf-blob cf-blob-1" />
        <div className="cf-blob cf-blob-2" />
      </div>

      {/* ── Controls ── */}
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

      {/* ── Grid ── */}
      <div className="cf-body">
        {courses.length === 0 ? (
          /* Loading skeletons when courses haven't loaded yet */
          <div className="cf-grid">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="cf-empty">
            <Bookmark size={48} strokeWidth={1.2} />
            <h3>No results found</h3>
            <p>Try a different search or filter.</p>
          </div>
        ) : (
          <div className="cf-grid">
            {filtered.map((course, idx) => {
              const lvl = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner;
              const isDeleting = deletingId === course.id;

              // ── Inline edit card ──
              if (editingId === course.id) {
                return (
                  <article key={course.id || idx} className="cf-card cf-edit-card">
                    <h3 className="cf-edit-title">✏️ Edit Course</h3>

                    <div className="cf-edit-field">
                      <label>Title</label>
                      <input
                        className="cf-edit-input"
                        value={editData.title}
                        onChange={e => setEditData({ ...editData, title: e.target.value })}
                        placeholder="Course title"
                      />
                    </div>

                    <div className="cf-edit-field">
                      <label>Description</label>
                      <textarea
                        className="cf-edit-input"
                        value={editData.description}
                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                        placeholder="Course description"
                      />
                    </div>

                    <div className="cf-edit-row">
                      <div className="cf-edit-field">
                        <label>Instructor</label>
                        <input
                          className="cf-edit-input"
                          value={editData.instructor}
                          onChange={e => setEditData({ ...editData, instructor: e.target.value })}
                          placeholder="Instructor name"
                        />
                      </div>
                      <div className="cf-edit-field">
                        <label>Duration</label>
                        <input
                          className="cf-edit-input"
                          value={editData.duration}
                          onChange={e => setEditData({ ...editData, duration: e.target.value })}
                          placeholder="e.g. 12h 30m"
                        />
                      </div>
                    </div>

                    <div className="cf-edit-row">
                      <div className="cf-edit-field">
                        <label>Category</label>
                        <input
                          className="cf-edit-input"
                          value={editData.category}
                          onChange={e => setEditData({ ...editData, category: e.target.value })}
                          placeholder="Category"
                        />
                      </div>
                      <div className="cf-edit-field">
                        <label>Level</label>
                        <select
                          className="cf-edit-input"
                          value={editData.level}
                          onChange={e => setEditData({ ...editData, level: e.target.value })}
                        >
                          {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                            <option key={l} value={l}>{l}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="cf-edit-actions">
                      <button
                        className="cf-edit-save"
                        onClick={() => handleSave(course.id)}
                        disabled={savingId === course.id}
                      >
                        {savingId === course.id
                          ? <><span className="cf-btn-spinner" /> Saving…</>
                          : <><Check size={15} /> Save Changes</>
                        }
                      </button>
                      <button
                        className="cf-edit-cancel"
                        onClick={() => setEditingId(null)}
                      >
                        <X size={15} /> Cancel
                      </button>
                    </div>
                  </article>
                );
              }

              // ── Normal course card ──
              return (
                <article
                  key={course.id || idx}
                  className={`cf-card ${isDeleting ? 'cf-card-deleting' : ''}`}
                >
                  <div className="cf-card-img">
                    <img
                      src={course.imageUrl || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                      alt={course.title}
                      loading="lazy"
                    />
                    <span className="cf-category-tag">{course.category}</span>
                  </div>

                  <div className="cf-card-body">
                    <div className="cf-instructor">
                      <div className="cf-avatar">{(course.instructor || 'A').charAt(0).toUpperCase()}</div>
                      <span>{course.instructor || 'Anonymous'}</span>
                    </div>

                    <h3 className="cf-card-title">{course.title}</h3>
                    <p className="cf-card-desc">
                      {course.description && course.description.length > 110
                        ? `${course.description.substring(0, 110)}…`
                        : course.description}
                    </p>

                    <div className="cf-meta">
                      <span className="cf-meta-item"><Clock size={13} />{course.duration || '—'}</span>
                      <span className="cf-meta-item"><Layers size={13} />{course.level}</span>
                      <span className="cf-level-badge" style={{ background: lvl.bg, color: lvl.color }}>
                        {course.level}
                      </span>
                    </div>

                    {/* Social actions */}
                    <div className="cf-social">
                      <button
                        className={`cf-action-btn ${course.isLiked ? 'cf-liked' : ''}`}
                        onClick={() => handleLike(course.id)}
                        disabled={likingId === course.id}
                        aria-label="Like"
                      >
                        <Heart size={17} fill={course.isLiked ? 'currentColor' : 'none'} />
                        <span>{course.likes || 0}</span>
                      </button>
                      <button className="cf-action-btn" aria-label="Comment">
                        <MessageCircle size={17} />
                      </button>
                      <button className="cf-action-btn" aria-label="Share">
                        <Send size={17} />
                      </button>
                      <button className="cf-action-btn cf-ml-auto" aria-label="Bookmark">
                        <Bookmark size={17} />
                      </button>

                      {/* Edit & Delete */}
                      <button
                        className="cf-action-btn cf-edit-btn"
                        onClick={() => startEdit(course)}
                        aria-label="Edit course"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="cf-action-btn cf-delete-btn"
                        onClick={() => handleDelete(course.id)}
                        disabled={isDeleting}
                        aria-label="Delete course"
                        title="Delete"
                      >
                        {isDeleting
                          ? <span className="cf-btn-spinner cf-del-spinner" />
                          : <Trash2 size={15} />
                        }
                      </button>
                    </div>
                  </div>

                  <div className="cf-card-footer">
                    <button className="cf-enroll-btn">Enroll Now →</button>
                  </div>
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
