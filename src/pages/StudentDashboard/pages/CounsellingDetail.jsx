import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Video, Info, CheckCircle, X, Bell, ExternalLink } from 'lucide-react';
import { bookCounsellingSlot, getStudentCounsellingSessions } from '../../../services/api';
import './Counselling.css';

/* ── Helpers ── */
const MEETING_LINK = 'https://meet.google.com/wxs-wifp-tti';

const CounsellingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null); // null | 'pending' | 'accepted' | 'rejected'
  const [acceptedSlot, setAcceptedSlot] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const timeSlots = [
    { id: 'slot1', label: '10:00 AM – 11:00 AM', startHour: 10, endHour: 11, display: '10 AM – 11 AM' },
    { id: 'slot2', label: '11:00 AM – 12:00 PM', startHour: 11, endHour: 12, display: '11 AM – 12 PM' },
    { id: 'slot3', label: '2:00 PM – 3:00 PM',   startHour: 14, endHour: 15, display: '2 PM – 3 PM'   },
    { id: 'slot4', label: '3:00 PM – 4:00 PM',   startHour: 15, endHour: 16, display: '3 PM – 4 PM'   },
  ];

  /* ── Get Monday to Friday of current week ── */
  const getWeekDays = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Calculate Monday of this week
    const first = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    
    for (let i = 0; i < 5; i++) {
      const d = new Date(today);
      d.setDate(first + i);
      dates.push({
        date: d.toISOString().split('T')[0],
        display: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    return dates;
  };

  const weekDays = getWeekDays();

  // Initialize selectedDate with today if today is Mon-Fri, else Monday
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const found = weekDays.find(d => d.date === todayStr);
    setSelectedDate(found ? found.date : weekDays[0].date);
  }, []);

  const cards = [
    {
      id: 0,
      title: '1-1 Career Counselling',
      description: 'Get personalized guidance from experts to shape your career path.',
      explanation: 'Tailored guidance sessions where you meet individually with senior mentors.',
      summary: 'Our 1-1 Career Counselling is designed to provide you with the undivided attention of an industry expert. Whether you are looking to transition roles, negotiate a salary, or simply find your footing in a new tech stack, our mentors provide actionable advice tailored to your specific situation.',
      highlights: ['Personalized Resume Review', 'Mock Behavioral Interviews', 'Long-term Career Pathing', 'Direct Industry Insights'],
      imageUrl: 'https://medavas.com/wp-content/uploads/2023/12/career-counselling-online-1024x683.jpg',
      hasMeetButton: true,
    },
    {
      id: 1,
      title: '1-Many Counselling',
      description: 'Collaborate with peers and learn industry insights together.',
      explanation: 'Group sessions led by industry veterans.',
      summary: '1-Many Counselling sessions offer a unique opportunity to learn in a collaborative environment. By listening to the challenges and questions of your peers, you gain a broader perspective on industry trends and common obstacles.',
      highlights: ['Group Problem Solving', 'Peer Learning Network', 'Industry Trend Analysis', 'Q&A with Veterans'],
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      hasMeetButton: true,
    },
    {
      id: 2,
      title: 'Upcoming Counselling',
      description: 'Stay updated with upcoming sessions and expert talks.',
      explanation: 'A curated schedule of future sessions, guest lectures, and tech workshops.',
      summary: 'Stay ahead of the curve by participating in our specialized guest lectures and workshops. We bring in top-tier professionals from around the globe to discuss emerging technologies, leadership in tech, and the future of work.',
      highlights: ['Guest Speaker Series', 'Emerging Tech Workshops', 'Leadership Summits', 'Live Coding Demonstrations'],
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      title: 'Career Guidance',
      description: 'Structured roadmap to achieve your career goals efficiently.',
      explanation: 'Comprehensive strategies to navigate the job market.',
      summary: 'Career Guidance is about more than just finding a job; it is about building a professional brand. We help you optimize your digital presence, refine your portfolio, and master the art of storytelling during interviews.',
      highlights: ['LinkedIn Optimization', 'Portfolio Reviews', 'Interview Strategy', 'Networking Masterclasses'],
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const card = cards.find(c => c.id === parseInt(id));

  /* ── Live clock ── */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── Load booking state from Backend ── */
  useEffect(() => {
    if (!card) return;

    const fetchMyBookings = async () => {
      try {
        const res = await getStudentCounsellingSessions();
        if (res.success) {
          const myBooking = res.sessions.find(b => b.serviceId === card.id);
          if (myBooking) {
            setBookingStatus(myBooking.status);
            if (myBooking.status === 'accepted') {
              setAcceptedSlot(timeSlots.find(s => s.id === myBooking.slotId) || null);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchMyBookings();
  }, [id, card]);

  if (!card) return <div className="detail-error">Service not found.</div>;

  /* ── Countdown helper ── */
  const getCountdown = (targetHour) => {
    const target = new Date(currentTime);
    target.setHours(targetHour, 0, 0, 0);
    const diff = target - currentTime;
    if (diff <= 0) return 'Starting now...';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  /* ── Meeting button state ── */
  const getMeetingButtonState = () => {
    if (bookingStatus !== 'accepted' || !acceptedSlot) return 'none';
    const h = currentTime.getHours();
    if (h >= acceptedSlot.startHour && h < acceptedSlot.endHour) return 'active';
    if (h < acceptedSlot.startHour) return 'countdown';
    return 'ended';
  };

  const meetState = getMeetingButtonState();

  /* ── Slot Validity Helper ── */
  const getSlotStatus = (slot, dateStr) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // If selecting a past date (this shouldn't happen with Mon-Fri logic but safe check)
    if (dateStr < todayStr) return { valid: false, reason: "This day has already passed." };

    // If selecting a future date, it's always valid
    if (dateStr > todayStr) return { valid: true };

    // If selecting today, apply 2-hour gap
    const slotTime = new Date(now);
    slotTime.setHours(slot.startHour, 0, 0, 0);
    
    const diffInMs = slotTime - now;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 0) return { valid: false, reason: "This slot has already passed." };
    if (diffInHours < 2) return { valid: false, reason: "Slots must be booked at least 2 hours in advance for today." };
    
    return { valid: true };
  };

  /* ── Submit booking to Backend ── */
  const handleSubmitBooking = async () => {
    if (!selectedSlot || !selectedDate) return;

    try {
      const res = await bookCounsellingSlot({
        serviceId: card.id,
        serviceTitle: card.title,
        slotId: selectedSlot.id,
        slotLabel: selectedSlot.label,
        slotDate: selectedDate,
        startHour: selectedSlot.startHour
      });

      if (res.success) {
        setBookingStatus('pending');
        setSelectedSlot(null);
        setShowModal(false);
        showToast('✅ Slot request submitted! Awaiting admin approval.');
      }
    } catch (err) {
      showToast('❌ ' + err.message);
    }
  };

  /* ── Toast ── */
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="detail-page-container">
      {/* Toast */}
      {toast && (
        <div className="booking-toast">
          <span>{toast}</span>
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="slot-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="slot-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Select a Time Slot</h3>
                <p>Choose your preferred session time for <strong>{card.title}</strong></p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>

            <div className="modal-date-tabs">
              {weekDays.map(day => (
                <button
                  key={day.date}
                  className={`date-tab-btn ${selectedDate === day.date ? 'active' : ''}`}
                  onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }}
                >
                  {day.display}
                </button>
              ))}
            </div>

            <div className="modal-slots-grid">
              {timeSlots.map(slot => {
                const isSelected = selectedSlot?.id === slot.id;
                const status = getSlotStatus(slot, selectedDate);

                return (
                  <button
                    key={slot.id}
                    className={`modal-slot-card ${isSelected ? 'selected' : ''} ${!status.valid ? 'disabled' : 'available-green'}`}
                    onClick={() => {
                      if (status.valid) {
                        setSelectedSlot(slot);
                      } else {
                        showToast(`⚠️ ${status.reason}`);
                      }
                    }}
                  >
                    <Clock size={18} />
                    <span className="slot-time-text">{slot.label}</span>
                    <span className={`slot-avail-badge ${status.valid ? 'available' : 'unavailable'}`}>
                      {status.valid ? 'Available' : 'Unavailable'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="modal-footer">
              <p className="modal-note">
                <Info size={14} /> Sessions are conducted via Google Meet. Ensure you're logged in with your registered email.
              </p>
              <button
                className="submit-booking-btn"
                disabled={!selectedSlot}
                onClick={handleSubmitBooking}
              >
                Submit Booking Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back */}
      <button className="back-navigation" onClick={() => navigate('/student-dashboard/counselling')}>
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Hero */}
      <div className="detail-hero">
        <div className="detail-hero-content">
          <h1>{card.title}</h1>
          <p className="detail-tagline">{card.description}</p>
          <div className="detail-meta">
            <div className="meta-item"><Calendar size={18} /><span>Available Monday – Friday</span></div>
            <div className="meta-item"><Clock size={18} /><span>10 AM – 4 PM (IST)</span></div>
          </div>
        </div>
        <div className="detail-hero-image">
          <img src={card.imageUrl} alt={card.title} />
        </div>
      </div>

      {/* Accepted Notification Banner */}
      {bookingStatus === 'accepted' && acceptedSlot && (
        <div className="booking-confirmed-banner">
          <div className="banner-icon-wrap"><Bell size={24} /></div>
          <div className="banner-text">
            <h4>Your session has been confirmed! 🎉</h4>
            <p>Time Slot: <strong>{acceptedSlot.label}</strong></p>
            <p>
              Meeting Link:{' '}
              <a href={MEETING_LINK} target="_blank" rel="noopener noreferrer" className="meet-link-inline">
                {MEETING_LINK} <ExternalLink size={12} />
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Pending Banner */}
      {bookingStatus === 'pending' && (
        <div className="booking-pending-banner">
          <Clock size={20} />
          <span>Your slot request is <strong>pending admin approval</strong>. You'll be notified once confirmed.</span>
        </div>
      )}

      {/* Rejected Banner */}
      {bookingStatus === 'rejected' && (
        <div className="booking-rejected-banner">
          <X size={20} />
          <span>Your slot request was <strong>not approved</strong>. Please book a different slot.</span>
          <button className="rebook-btn" onClick={() => { setBookingStatus(null); }}>Book Again</button>
        </div>
      )}

      {/* Main Layout */}
      <div className="detail-main-layout">
        <div className="detail-left-column">
          <section className="detail-section">
            <div className="section-header">
              <Info size={24} className="section-icon" />
              <h2>Service Summary</h2>
            </div>
            <p className="summary-paragraph">{card.summary}</p>
          </section>

          {card.highlights && (
            <section className="detail-section">
              <div className="section-header">
                <CheckCircle size={24} className="section-icon" />
                <h2>Key Highlights</h2>
              </div>
              <div className="highlights-grid">
                {card.highlights.map((item, index) => (
                  <div key={index} className="highlight-item">
                    <span className="bullet"></span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column — Booking Card */}
        {card.hasMeetButton && (
          <div className="detail-right-column">
            <div className="booking-card">
              <div className="booking-header">
                <Video size={24} />
                <h3>Session Booking</h3>
              </div>

              {/* No booking yet → Show Book a Slot */}
              {!bookingStatus && (
                <>
                  <p>Reserve your spot with one of our expert mentors by selecting a convenient time slot.</p>
                  <button className="book-slot-btn" onClick={() => setShowModal(true)}>
                    <Calendar size={18} />
                    Book a Slot
                  </button>
                </>
              )}

              {/* Pending state */}
              {bookingStatus === 'pending' && (
                <div className="booking-state-pending">
                  <div className="state-icon pending"><Clock size={28} /></div>
                  <h4>Request Submitted</h4>
                  <p>Your booking is awaiting admin approval. The "Attend Meeting" button will activate once confirmed.</p>
                  <button className="attend-meeting-btn-red" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                    <Video size={18} /> Attend Meeting
                  </button>
                </div>
              )}

              {/* Accepted state — time-gated button */}
              {bookingStatus === 'accepted' && acceptedSlot && (
                <div className="booking-state-accepted">
                  <div className="confirmed-slot-info">
                    <CheckCircle size={18} className="text-success" />
                    <span>Confirmed: <strong>{acceptedSlot.label}</strong></span>
                  </div>

                  {meetState === 'active' && (
                    <a href={MEETING_LINK} target="_blank" rel="noopener noreferrer" className="attend-meeting-btn-red active-now">
                      <Video size={18} /> Attend Meeting
                    </a>
                  )}

                  {meetState === 'countdown' && (
                    <div className="meeting-countdown-wrap">
                      <p className="countdown-label">Meeting starts in:</p>
                      <div className="countdown-clock">{getCountdown(acceptedSlot.startHour)}</div>
                      <button className="attend-meeting-btn-red" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                        <Video size={18} /> Attend Meeting
                      </button>
                    </div>
                  )}

                  {meetState === 'ended' && (
                    <div className="meeting-ended-wrap">
                      <p className="ended-label">This session has ended.</p>
                      <button className="attend-meeting-btn-red" disabled style={{ opacity: 0.4, cursor: 'not-allowed' }}>
                        <Video size={18} /> Session Ended
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Rejected state */}
              {bookingStatus === 'rejected' && (
                <div className="booking-state-rejected">
                  <p>Your request was not approved. Please try booking a different slot.</p>
                  <button className="book-slot-btn" onClick={() => { setBookingStatus(null); setShowModal(true); }}>
                    <Calendar size={18} /> Book a New Slot
                  </button>
                </div>
              )}

              <div className="booking-footer">
                <p>Meetings are conducted via Google Meet. Please ensure you are logged in with your registered email.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellingDetail;
