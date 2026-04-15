import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  Filter,
  ThumbsUp,
  MessageSquare,
  Send,
  ChevronDown,
  HelpCircle,
  Video,
  CheckCircle2,
  Clock,
  MoreVertical,
  AlertCircle,
  User,
  ArrowRight,
  Plus
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

const initialQueries = [
  {
    id: 'Q1',
    studentName: 'Rahul Kumar',
    initials: 'RK',
    course: 'Full Stack JavaScript',
    date: '2026-04-14',
    time: '10:30 AM',
    query: "Could you please explain the difference between for-in and for-of loops in more detail? I'm specifically confused about how they behave with objects vs arrays.",
    status: 'pending',
    response: null,
    isUrgent: true,
    meeting: null
  },
  {
    id: 'Q2',
    studentName: 'Ananya Mishra',
    initials: 'AM',
    course: 'JS Fundamentals',
    date: '2026-04-13',
    time: '11:15 AM',
    query: "I'm having trouble understanding how lexical scoping works with nested functions. Any alternative way to visualize this?",
    status: 'answered',
    response: "Visualize nested functions as rooms in a house. An inner room (child) can see out into the hallway (parent scope), but people in the hallway can't see into the inner room unless it's open!",
    isUrgent: false,
    meeting: null
  },
  {
    id: 'Q3',
    studentName: 'Vikram K.',
    initials: 'VK',
    course: 'React Advanced',
    date: '2026-04-12',
    time: '02:00 PM',
    query: "How do I optimize re-renders in a large list component using useMemo? My current implementation still feels laggy.",
    status: 'scheduled',
    response: "We should look at your component hierarchy. I've scheduled a quick meet to debug this together.",
    isUrgent: false,
    meeting: {
      date: '2026-04-15',
      time: '11:00 AM',
      link: 'https://meet.google.com/abc-defg-hij'
    }
  }
];

const Feedback = () => {
  const [activeTab, setActiveTab] = useState('queries'); // Defaulting to Queries as requested
  const [reviews, setReviews] = useState(initialReviews);
  const [queries, setQueries] = useState(initialQueries);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('All');
  const [filterQueryStatus, setFilterQueryStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  // Action State
  const [replyText, setReplyText] = useState({}); // { id: text }
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [activeAnswerId, setActiveAnswerId] = useState(null);
  const [answerText, setAnswerText] = useState('');

  // Modal State
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [selectedQueryId, setSelectedQueryId] = useState(null);
  const [meetingForm, setMeetingForm] = useState({ date: '', time: '', link: '' });

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

  // --- QUERY HANDLERS ---
  const handleAnswerSubmit = (queryId) => {
    if (!answerText.trim()) return;
    setQueries(prev => prev.map(q =>
      q.id === queryId ? { ...q, status: 'answered', response: answerText } : q
    ));
    setAnswerText('');
    setActiveAnswerId(null);
  };

  const handleMarkResolved = (queryId) => {
    setQueries(prev => prev.map(q =>
      q.id === queryId ? { ...q, status: 'completed' } : q
    ));
  };

  const openScheduleModal = (queryId) => {
    setSelectedQueryId(queryId);
    setShowMeetModal(true);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setQueries(prev => prev.map(q =>
      q.id === selectedQueryId ? {
        ...q,
        status: 'scheduled',
        meeting: { ...meetingForm }
      } : q
    ));
    setShowMeetModal(false);
    setMeetingForm({ date: '', time: '', link: '' });
  };

  const meetings = useMemo(() => {
    return queries.filter(q => q.status === 'scheduled' || q.status === 'completed')
      .map(q => ({
        ...q.meeting,
        studentName: q.studentName,
        queryId: q.id,
        isCompleted: q.status === 'completed'
      }));
  }, [queries]);

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

  const filteredQueries = useMemo(() => {
    return queries.filter(q => {
      const matchesSearch = q.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.query.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterQueryStatus === 'all' || q.status === filterQueryStatus;
      return matchesSearch && matchesStatus;
    });
  }, [queries, searchTerm, filterQueryStatus]);

  return (
    <div className="fb-dashboard-v7 animate-fade-in">
      {/* HEADER SECTION */}
      <div className="fb-top-header-v7">
        <h1 className="fb-main-title-v7">Student Queries & Feedback</h1>
        <p className="fb-main-subtitle-v7">Manage interactions and resolve student issues</p>

        {/* TABS NAVIGATION V7 */}
        <div className="fb-tabs-nav-v7">
          {[
            { id: 'feedback', label: 'Student Feedback', icon: <Star size={16} /> },
            { id: 'queries', label: 'Student Queries', icon: <HelpCircle size={16} />, badge: queries.filter(q => q.status === 'pending').length },
            { id: 'meetings', label: 'Scheduled Meets', icon: <Video size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              className={`fb-tab-pill-v7 ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge > 0 && <span className="fb-badge-v7">{tab.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="fb-tab-content-v7">

        {/* TAB 1: FEEDBACK */}
        {activeTab === 'feedback' && (
          <div className="tab-pane-v7 animate-fade-in">
            <div className="fb-rating-overview-v7">
              <div className="fb-rating-box-v7">
                <div className="fb-big-num-v7">{stats.avg}</div>
                <div className="fb-big-stars-v7">{renderStars(Math.round(stats.avg))}</div>
                <div className="fb-reviews-count-v7">Based on 60 student reviews</div>
              </div>

              <div className="fb-rating-bars-v7">
                {[5, 4, 3, 2, 1].map(num => (
                  <div key={num} className="fb-dist-row-v7">
                    <span className="dist-num-v7">{num}★</span>
                    <div className="dist-track-v7">
                      <div className="dist-fill-v7" style={{ width: `${stats.total > 0 ? (stats.distribution[num] / stats.total) * 100 : 0}%` }}></div>
                    </div>
                    <span className="dist-pct-v7">{stats.total > 0 ? Math.round((stats.distribution[num] / stats.total) * 100) : 0}%</span>
                  </div>
                ))}
              </div>

              <div className="fb-filter-ctrls-v7">
                <div className="fb-filter-header-v7">
                  <span className="fb-filter-lbl-v7">Filter Reviews</span>
                  <div className="fb-drop-wrap-v7">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="latest">Latest First</option>
                      <option value="highest">Highest Rated</option>
                    </select>
                    <ChevronDown size={14} className="fb-drop-icon-v7" />
                  </div>
                </div>
                <div className="fb-pills-v7">
                  {['All', '5', '4', '3'].map(r => (
                    <button key={r} className={`fb-pill-btn-v7 ${filterRating === r ? 'active' : ''}`} onClick={() => setFilterRating(r)}>
                      {r === 'All' ? 'All Reviews' : `${r} Star`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="fb-list-v7">
              {filteredReviews.map(review => (
                <div key={review.id} className="fb-item-card-v7">
                  <div className="fb-card-top-v7">
                    <div className="fb-user-info-v7">
                      <div className={`fb-avatar-v7 av-${review.id % 5}`}>{review.initials}</div>
                      <div className="fb-user-meta-v7">
                        <h4>{review.studentName}</h4>
                        <p>{new Date(review.date).toLocaleDateString('en-GB')} · {review.course}</p>
                      </div>
                    </div>
                    <div className="fb-stars-tag-v7">
                      {renderStars(review.rating)}
                      {review.rating >= 4 && <span className="fb-tag-v7">Highly Rated</span>}
                    </div>
                  </div>
                  <div className="fb-comment-v7"><p>"{review.comment}"</p></div>
                  {review.reply && (
                    <div className="fb-reply-box-v7">
                      <div className="fb-reply-label-v7"><MessageSquare size={12} /><span>Your Reply</span></div>
                      <p>{review.reply}</p>
                    </div>
                  )}
                  <div className="fb-card-bottom-v7">
                    <div className="feedback-actions">
                      <button className="fb-act-btn-v7" onClick={() => toggleHelpful(review.id)}>
                        <ThumbsUp size={14} /> <span>Helpful ({review.helpfulCount})</span>
                      </button>
                      <button className="fb-act-btn-v7" onClick={() => setActiveReplyId(activeReplyId === review.id ? null : review.id)}>
                        <MessageSquare size={14} /> <span>{review.reply ? 'Update Reply' : 'Reply'}</span>
                      </button>
                    </div>
                  </div>
                  {activeReplyId === review.id && (
                    <div className="reply-container animate-slide-down">
                      <textarea value={replyText[review.id] || ''} onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })} placeholder="Type your response..." />
                      <div className="reply-actions">
                        <button className="cancel-btn" onClick={() => setActiveReplyId(null)}>Cancel</button>
                        <button className="submit-btn" onClick={() => submitReply(review.id)}><Send size={14} /> Submit</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: QUERIES */}
        {activeTab === 'queries' && (
          <div className="tab-pane-v7 animate-fade-in">
            <div className="fb-queries-top-v7">
              <div className="fb-search-v7">
                <Search size={18} />
                <input type="text" placeholder="Search by student or query keyword..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="fb-status-filters-v7">
                {['all', 'pending', 'answered', 'scheduled'].map(stat => (
                  <button key={stat} className={`fb-status-pill-v7 ${filterQueryStatus === stat ? 'active' : ''}`} onClick={() => setFilterQueryStatus(stat)}>
                    {stat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="fb-queries-list-v7">
              {filteredQueries.map(q => (
                <div key={q.id} className="fb-query-card-v7">
                  <div className="fb-q-header-v7">
                    <div className="fb-q-info-v7">
                      <div className={`fb-q-avatar-v7 av-${q.id.length % 5}`}>{q.initials}</div>
                      <div className="fb-q-meta-v7">
                        <h4>{q.studentName}</h4>
                        <p>{q.course} · {q.date}</p>
                      </div>
                    </div>
                    <div className={`fb-q-badge-v7 ${q.status}`}>
                      <span className="dot"></span> {q.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="fb-q-body-v7">
                    <p className="fb-q-text-v7">"{q.query}"</p>
                    {q.response && (
                      <div className="fb-q-response-v7">
                        <div className="fb-q-resp-hdr-v7"><MessageSquare size={13} /><span>Your Response</span></div>
                        <p>{q.response}</p>
                      </div>
                    )}
                    {q.meeting && (
                      <div className="fb-q-meet-v7">
                        <div className="fb-q-meet-hdr-v7"><Video size={13} /><span>Scheduled Session</span></div>
                        <p><strong>{q.meeting.date}</strong> at <strong>{q.meeting.time}</strong></p>
                        <button className="fb-btn-join-v7" onClick={() => window.open(q.meeting.link, '_blank')}>Join Now</button>
                      </div>
                    )}
                  </div>

                  <div className="fb-q-footer-v7">
                    {q.status !== 'completed' && (
                      <div className="fb-q-actions-v7">
                        <button className="fb-q-act-btn answer" onClick={() => setActiveAnswerId(activeAnswerId === q.id ? null : q.id)}>
                          <MessageSquare size={14} /> <span>{q.response ? 'Edit Answer' : 'Answer'}</span>
                        </button>
                        <button className="fb-q-act-btn meet" onClick={() => openScheduleModal(q.id)}>
                          <Video size={14} /> <span>Schedule Meet</span>
                        </button>
                        <button className="fb-q-act-btn resolve" onClick={() => handleMarkResolved(q.id)}>
                          <CheckCircle2 size={14} /> <span>Resolve</span>
                        </button>
                      </div>
                    )}
                    {q.status === 'completed' && <div className="fb-resolved-v7"><CheckCircle2 size={20} /> <span>Resolved</span></div>}
                  </div>

                  {activeAnswerId === q.id && (
                    <div className="reply-container animate-slide-down">
                      <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Type your answer..." />
                      <div className="answer-actions">
                        <button className="cancel-btn" onClick={() => setActiveAnswerId(null)}>Cancel</button>
                        <button className="submit-btn" onClick={() => handleAnswerSubmit(q.id)}><Send size={14} /> Submit Answer</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MEETINGS */}
        {activeTab === 'meetings' && (
          <div className="tab-pane-v7 animate-fade-in">
            <div className="fb-meetings-view-v7">
              <div className="fb-meet-header-v7">
                <h3>All Scheduled Meetings</h3>
                <p>Track your upcoming 1-on-1 sessions</p>
              </div>
              <div className="fb-meetings-list-v7">
                {meetings.length > 0 ? meetings.map((m, idx) => (
                  <div key={idx} className={`fb-meet-card-v7 ${m.isCompleted ? 'completed' : ''}`}>
                    <div className="fb-m-user-v7">
                      <User size={18} />
                      <strong>{m.studentName}</strong>
                    </div>
                    <div className="fb-m-time-v7">
                      <div className="fb-m-date-v7">{m.date}</div>
                      <div className="fb-m-clock-v7"><Clock size={14} /> {m.time}</div>
                    </div>
                    <div className="fb-m-status-v7">
                      <span className={`fb-m-tag-v7 ${m.isCompleted ? 'comp' : 'up'}`}>
                        {m.isCompleted ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="fb-m-action-v7">
                      {!m.isCompleted && (
                        <button className="fb-m-join-btn-v7" onClick={() => window.open(m.link, '_blank')}>Join Now</button>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="fb-meetings-empty-v7">
                    <Video size={48} />
                    <p>No meetings scheduled yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SCHEDULE MODAL */}
      {showMeetModal && (
        <div className="fb-modal-overlay-v7 animate-fade-in">
          <div className="fb-modal-card-v7 animate-slide-down">
            <div className="fb-modal-hdr-v7">
              <h3>Schedule 1-on-1 Meet</h3>
              <button className="fb-close-btn-v7" onClick={() => setShowMeetModal(false)}><Plus size={20} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="fb-modal-form-v7">
              <div className="fb-input-gp-v7">
                <label>Date</label>
                <input type="date" required value={meetingForm.date} onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })} />
              </div>
              <div className="fb-input-gp-v7">
                <label>Time</label>
                <input type="time" required value={meetingForm.time} onChange={(e) => setMeetingForm({ ...meetingForm, time: e.target.value })} />
              </div>
              <div className="fb-input-gp-v7">
                <label>Meeting Link</label>
                <input type="url" required placeholder="https://meet.google.com/..." value={meetingForm.link} onChange={(e) => setMeetingForm({ ...meetingForm, link: e.target.value })} />
              </div>
              <div className="fb-modal-ft-v7">
                <button type="button" className="fb-btn-cancel-v7" onClick={() => setShowMeetModal(false)}>Cancel</button>
                <button type="submit" className="fb-btn-send-v7">Schedule Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;
