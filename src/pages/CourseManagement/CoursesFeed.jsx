import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Heart, MessageCircle, Send, Bookmark, PlusCircle,
  Clock, Layers, User, Search, Filter, TrendingUp, Star
} from 'lucide-react';
import './CourseFeed.css';

const LEVEL_COLORS = {
  Beginner:     { bg: '#dcfce7', color: '#16a34a' },
  Intermediate: { bg: '#fef9c3', color: '#b45309' },
  Advanced:     { bg: '#fee2e2', color: '#dc2626' },
};

export function CourseFeed({ courses, onToggleLike }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  const categories = ['All', ...new Set(courses.map(c => c.category).filter(Boolean))];

  const filtered = courses.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.instructor || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'All' || c.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="cf-page">

      {/* ── Hero ── */}
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

      {/* ── Cards ── */}
      <div className="cf-body">
        {filtered.length === 0 ? (
          <div className="cf-empty">
            <Bookmark size={48} strokeWidth={1.2} />
            <h3>{courses.length === 0 ? 'No courses published yet' : 'No results found'}</h3>
            <p>{courses.length === 0
              ? 'Be the first to publish a professional course to the stream.'
              : 'Try a different search term or category filter.'
            }</p>
            {courses.length === 0 && (
              <button className="cf-publish-btn cf-empty-btn" onClick={() => navigate('/admin')}>
                <PlusCircle size={16} /> Publish First Course
              </button>
            )}
          </div>
        ) : (
          <div className="cf-grid">
            {filtered.map((course, idx) => {
              const lvl = LEVEL_COLORS[course.level] || LEVEL_COLORS.Beginner;
              return (
                <article key={course.id || idx} className="cf-card">
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
                      {course.timestamp && (
                        <span className="cf-ts">
                          · {formatDistanceToNow(new Date(course.timestamp), { addSuffix: true })}
                        </span>
                      )}
                    </div>

                    <h3 className="cf-card-title">{course.title}</h3>
                    <p className="cf-card-desc">
                      {course.description && course.description.length > 110
                        ? `${course.description.substring(0, 110)}…`
                        : course.description}
                    </p>

                    <div className="cf-meta">
                      <span className="cf-meta-item"><Clock size={13} />{course.duration}</span>
                      <span className="cf-meta-item"><Layers size={13} />{course.level}</span>
                      <span
                        className="cf-level-badge"
                        style={{ background: lvl.bg, color: lvl.color }}
                      >{course.level}</span>
                    </div>

                    {/* Social actions */}
                    <div className="cf-social">
                      <button
                        className={`cf-action-btn ${course.isLiked ? 'cf-liked' : ''}`}
                        onClick={() => onToggleLike && onToggleLike(course.id)}
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
}
