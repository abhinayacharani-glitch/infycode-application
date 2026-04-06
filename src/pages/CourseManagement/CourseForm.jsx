import { useState, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2, Check, X } from 'lucide-react';

export function CourseForm({ onAddCourse }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    
    // Simulate slight network delay for premium feel
    setTimeout(() => {
      onAddCourse({
        title,
        description,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // default fallback image
      });
      
      setTitle('');
      setDescription('');
      setImageUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Course Title</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="e.g. Advanced React Patterns"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Course Description</label>
        <textarea 
          className="form-input" 
          placeholder="What will students learn?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">Course Cover Image (Optional)</label>
        <input 
          type="file" 
          className="form-input" 
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ padding: '0.75rem' }}
        />
        {imageUrl && (
          <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', height: '100px' }}>
            <img src={imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? 'Publishing...' : 'Publish Course'}
      </button>
    </form>
  );
}

export function CourseFeed({ courses, onToggleLike, onUpdateCourse, onDeleteCourse }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (course) => {
    setEditingId(course.id);
    setEditData({ title: course.title, description: course.description });
  };

  const handleSave = (id) => {
    if (onUpdateCourse) onUpdateCourse(id, editData);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      if (onDeleteCourse) onDeleteCourse(id);
    }
  };

  if (courses.length === 0) {
    return (
      <div className="empty-state">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '48px', height: '48px', margin: '0 auto 1rem', opacity: 0.5 }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3>No courses yet</h3>
        <p>Publish your first course above to see it here.</p>
      </div>
    );
  }

  return (
    <div className="feed-container">
      {courses.map(course => {
        if (editingId === course.id) {
          return (
            <article key={course.id} className="course-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>Edit Course</h3>
              <input className="form-input" style={{ width: '100%' }} value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} placeholder="Title" />
              <textarea className="form-input" style={{ width: '100%', minHeight: '80px', resize: 'vertical' }} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} placeholder="Description" />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button className="btn" style={{ flex: 1, padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleSave(course.id)}><Check size={16}/> Save</button>
                <button className="btn" style={{ flex: 1, padding: '0.5rem', background: '#e2e8f0', color: '#0f172a', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={() => setEditingId(null)}><X size={16}/> Cancel</button>
              </div>
            </article>
          );
        }

        return (
        <article key={course.id} className="course-card">
          <header className="course-header">
            <div className="course-avatar">
              {course.title.charAt(0).toUpperCase()}
            </div>
            <span className="course-author">Admin</span>
          </header>
          
          {course.imageUrl && (
            <img 
              src={course.imageUrl} 
              alt={course.title} 
              className="course-image" 
              loading="lazy"
            />
          )}

          <div className="course-content">
            <div className="course-actions">
              <button 
                className={`action-btn action-like ${course.isLiked ? 'liked' : ''}`}
                onClick={() => onToggleLike(course.id)}
                aria-label="Like course"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill={course.isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
              <button className="action-btn" aria-label="Comment on course">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </button>
              <button className="action-btn" aria-label="Share course">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
              <button className="action-btn" style={{ marginLeft: 'auto', color: '#475569' }} onClick={() => startEdit(course)} aria-label="Edit course"><Edit2 size={18} /></button>
              <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(course.id)} aria-label="Delete course"><Trash2 size={18} /></button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#6366f1', background: '#e0e7ff', padding: '2px 6px', borderRadius: '4px' }}>
                {course.id}
              </div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {course.likes || 0} {(course.likes === 1) ? 'like' : 'likes'}
              </div>
            </div>

            <h2 className="course-title">{course.title}</h2>
            <p className="course-description">{course.description}</p>
            
            <div className="course-timestamp">
              {course.timestamp ? formatDistanceToNow(new Date(course.timestamp), { addSuffix: true }) : 'Just now'}
            </div>
          </div>
        </article>
        );
      })}
    </div>
  );
}
