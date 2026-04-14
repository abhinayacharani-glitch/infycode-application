import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Search, 
  Filter, 
  ThumbsUp, 
  MessageSquare, 
  Send,
  ChevronDown
} from 'lucide-react';
import './Feedback.css';

const initialReviews = [
  {
    id: 1,
    studentName: 'Rahul Kumar',
    initials: 'RK',
    rating: 5,
    date: '2026-04-10',
    comment: 'The way you explained async/await and Promises was incredibly clear. I had been struggling with this concept for weeks, and your examples made it click.',
    helpfulCount: 12,
    reply: null,
    course: 'Full Stack JavaScript'
  },
  {
    id: 2,
    studentName: 'Priya Anand',
    initials: 'PA',
    rating: 4,
    date: '2026-04-09',
    comment: 'Great teaching style! The concepts are explained clearly. Could use a few more real-world project examples to make it even more practical.',
    helpfulCount: 8,
    reply: 'Thank you Priya! I will include more architectural patterns in the next module.',
    course: 'Node.js Mastery'
  },
  {
    id: 3,
    studentName: 'Suresh Menon',
    initials: 'SM',
    rating: 5,
    date: '2026-04-07',
    comment: 'The mock interview sessions have genuinely improved my confidence. The questions are industry-relevant and the feedback is very specific and actionable.',
    helpfulCount: 15,
    reply: null,
    course: 'Interview Preparation'
  },
  {
    id: 4,
    studentName: 'Ananya Mishra',
    initials: 'AM',
    rating: 3,
    date: '2026-04-05',
    comment: 'The topics were a bit rushed. I would appreciate if we could slow down on closures and scoping. The exercises are helpful but need more beginner-friendly examples.',
    helpfulCount: 4,
    reply: null,
    course: 'JS Fundamentals'
  },
  {
    id: 5,
    studentName: 'Vikram K.',
    initials: 'VK',
    rating: 5,
    date: '2026-04-02',
    comment: 'Highly engaging sessions. The project-based approach is exactly what I needed to understand advanced React concepts.',
    helpfulCount: 9,
    reply: 'Glad to hear that, Vikram! React advanced topics are indeed best learned through building.',
    course: 'React Advanced'
  }
];

const Feedback = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [replyText, setReplyText] = useState({}); // { reviewId: text }
  const [activeReplyId, setActiveReplyId] = useState(null);

  // Stats Calculation
  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => distribution[r.rating]++);
    
    return { avg, total, distribution };
  }, [reviews]);

  // Filter and Sort Logic
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(r => {
        const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.comment.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRating = filterRating === 'All' || r.rating === parseInt(filterRating);
        return matchesSearch && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'highest') return b.rating - a.rating;
        return 0;
      });
  }, [reviews, searchTerm, filterRating, sortBy]);

  const toggleHelpful = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r));
  };

  const submitReply = (id) => {
    if (!replyText[id]) return;
    setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: replyText[id] } : r));
    setReplyText(prev => ({ ...prev, [id]: '' }));
    setActiveReplyId(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="star-container">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            fill={i < rating ? "#FFB800" : "none"} 
            color={i < rating ? "#FFB800" : "#CBD5E1"} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fb-container animate-fade-in">
      {/* HEADER */}
      <div className="fb-header">
        <div>
          <h1 className="fb-title">Feedback & Ratings</h1>
          <p className="fb-subtitle">See what students are saying</p>
        </div>
      </div>

      {/* RATING SUMMARY & CONTROLS ROW */}
      <div className="fb-summary-grid">
        <div className="fb-summary-card main-stats">
          <div className="big-rating-box">
            <span className="big-num">{stats.avg}</span>
            {renderStars(Math.round(stats.avg))}
            <span className="total-label">Based on 60 student reviews</span>
          </div>
          <div className="rating-dist-list">
            {[5, 4, 3, 2, 1].map(num => (
              <div key={num} className="dist-row">
                <span className="dist-label">{num} <Star size={11} fill="#94A3B8" color="#94A3B8" /></span>
                <div className="dist-track">
                  <div 
                    className="dist-fill" 
                    style={{ width: `${(stats.distribution[num] / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="dist-pct">{Math.round((stats.distribution[num] / stats.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTROLS (WITHOUT SEARCH) */}
        <div className="fb-controls-card">
           <div className="fb-filter-row-top">
              <span className="filter-lbl">Filter by rating</span>
              <div className="sort-dropdown-wrapper">
                 <select className="fb-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="latest">Latest First</option>
                    <option value="highest">Highest Rated</option>
                 </select>
                 <ChevronDown size={14} className="dropdown-icon" />
              </div>
           </div>
           
           <div className="filter-pill-container">
            {['All', '5', '4', '3'].map(r => (
              <button 
                key={r} 
                className={`filter-pill ${filterRating === r ? 'active' : ''}`}
                onClick={() => setFilterRating(r)}
              >
                {r === 'All' ? 'All Reviews' : `${r} Star`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="reviews-list">
        {filteredReviews.length > 0 ? (
          filteredReviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="rev-header">
                <div className="rev-st-info">
                  <div className={`rev-avatar av-${review.id % 5}`}>{review.initials}</div>
                  <div className="rev-name-box">
                    <h3 className="rev-name">{review.studentName}</h3>
                    <p className="rev-meta">{new Date(review.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} · {review.course}</p>
                  </div>
                </div>
                <div className="rev-rating-box">
                  {renderStars(review.rating)}
                  {review.rating >= 4 && <span className="positive-tag">Highly Rated</span>}
                </div>
              </div>

              <div className="rev-body">
                <p className="rev-comment">"{review.comment}"</p>
              </div>

              {review.reply && (
                <div className="rev-reply-box">
                  <div className="reply-indicator">
                    <MessageSquare size={14} />
                    <span>Your Reply</span>
                  </div>
                  <p className="reply-text">{review.reply}</p>
                </div>
              )}

              <div className="rev-footer">
                <div className="rev-actions">
                  <button className="action-btn helpful" onClick={() => toggleHelpful(review.id)}>
                    <ThumbsUp size={16} />
                    <span>Helpful ({review.helpfulCount})</span>
                  </button>
                  <button className="action-btn reply" onClick={() => setActiveReplyId(review.id)}>
                    <MessageSquare size={16} />
                    <span>{review.reply ? 'Update Reply' : 'Reply'}</span>
                  </button>
                </div>
              </div>

              {activeReplyId === review.id && (
                <div className="reply-input-section animate-slide-down">
                  <textarea 
                    className="reply-textarea" 
                    placeholder="Type your response here..."
                    value={replyText[review.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                  />
                  <div className="reply-actions">
                    <button className="btn-cancel" onClick={() => setActiveReplyId(null)}>Cancel</button>
                    <button className="btn-send" onClick={() => submitReply(review.id)}>
                      <Send size={14} />
                      Submit Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="fb-empty-state">
            <Filter size={48} />
            <h2>No reviews found</h2>
            <p>No student sentiment matches your current filters.</p>
            <button className="reset-btn" onClick={() => { setFilterRating('All'); }}>Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
