import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Video, Info, CheckCircle } from 'lucide-react';
import './Counselling.css';

const CounsellingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [activeCountdown, setActiveCountdown] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef(null);

  const timeSlots = [
    { label: '10 AM - 11 AM', startHour: 10, endHour: 11 },
    { label: '11 AM - 12 PM', startHour: 11, endHour: 12 },
    { label: '2 PM - 3 PM', startHour: 14, endHour: 15 },
    { label: '3 PM - 4 PM', startHour: 15, endHour: 16 },
  ];

  const cards = [
    {
      id: 0,
      title: '1-1 Career Counselling',
      description: 'Get personalized guidance from experts to shape your career path.',
      explanation: 'Tailored guidance sessions where you meet individually with senior mentors. Discuss your goals, get resume reviews, and map out your personalized career roadmap with direct expert support.',
      summary: 'Our 1-1 Career Counselling is designed to provide you with the undivided attention of an industry expert. Whether you are looking to transition roles, negotiate a salary, or simply find your footing in a new tech stack, our mentors provide actionable advice tailored to your specific situation.',
      highlights: ['Personalized Resume Review', 'Mock Behavioral Interviews', 'Long-term Career Pathing', 'Direct Industry Insights'],
      imageUrl: 'https://medavas.com/wp-content/uploads/2023/12/career-counselling-online-1024x683.jpg',
      hasMeetButton: true,
    },
    {
      id: 1,
      title: '1-Many Counselling',
      description: 'Collaborate with peers and learn industry insights together.',
      explanation: 'Group sessions led by industry veterans. Learn from others\' questions, participate in collaborative problem-solving, and stay ahead with collective industry insights and team-based learning.',
      summary: '1-Many Counselling sessions offer a unique opportunity to learn in a collaborative environment. By listening to the challenges and questions of your peers, you gain a broader perspective on industry trends and common obstacles. These sessions are highly interactive and foster a community of learning.',
      highlights: ['Group Problem Solving', 'Peer Learning Network', 'Industry Trend Analysis', 'Q&A with Veterans'],
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      hasMeetButton: true,
    },
    {
      id: 2,
      title: 'Upcoming Counselling',
      description: 'Stay updated with upcoming sessions and expert talks.',
      explanation: 'A curated schedule of future sessions, guest lectures, and tech workshops. Stay updated so you never miss an opportunity to learn from the best in the industry and plan your learning path.',
      summary: 'Stay ahead of the curve by participating in our specialized guest lectures and workshops. We bring in top-tier professionals from around the globe to discuss emerging technologies, leadership in tech, and the future of work. These sessions are perfect for anyone looking to broaden their horizon beyond their current curriculum.',
      highlights: ['Guest Speaker Series', 'Emerging Tech Workshops', 'Leadership Summits', 'Live Coding Demonstrations'],
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 3,
      title: 'Career Guidance',
      description: 'Structured roadmap to achieve your career goals efficiently.',
      explanation: 'Comprehensive strategies to navigate the job market. Includes interview preparation, LinkedIn profile optimization, and portfolio building to make you stand out to premium tech employers.',
      summary: 'Career Guidance is about more than just finding a job; it is about building a professional brand. We help you optimize your digital presence, refine your portfolio, and master the art of storytelling during interviews. Our goal is to make you the most compelling candidate in the pool.',
      highlights: ['LinkedIn Optimization', 'Portfolio Reviews', 'Interview Strategy', 'Networking Masterclasses'],
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    },
  ];

  const card = cards.find(c => c.id === parseInt(id));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!card) return <div className="detail-error">Service not found.</div>;

  const currentHour = currentTime.getHours();

  const handleSlotClick = (slot) => {
    if (currentHour >= slot.startHour && currentHour < slot.endHour) {
      window.open('https://meet.google.com/wxs-wifp-tti', '_blank', 'noopener,noreferrer');
    } else if (currentHour < slot.startHour) {
      setActiveCountdown({ targetHour: slot.startHour, label: slot.label });
    }
    setOpenDropdown(false);
  };

  const getCountdownString = (targetHour) => {
    const targetTime = new Date(currentTime);
    targetTime.setHours(targetHour, 0, 0, 0);
    const diff = targetTime - currentTime;
    if (diff <= 0) return "Starting...";
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="detail-page-container">
      <button className="back-navigation" onClick={() => navigate('/student-dashboard/counselling')}>
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="detail-hero">
        <div className="detail-hero-content">
          <h1>{card.title}</h1>
          <p className="detail-tagline">{card.description}</p>
          <div className="detail-meta">
            <div className="meta-item">
              <Calendar size={18} />
              <span>Available Monday - Friday</span>
            </div>
            <div className="meta-item">
              <Clock size={18} />
              <span>10 AM - 4 PM (IST)</span>
            </div>
          </div>
        </div>
        <div className="detail-hero-image">
          <img src={card.imageUrl} alt={card.title} />
        </div>
      </div>

      <div className="detail-main-layout">
        <div className="detail-left-column">
          <section className="detail-section">
            <div className="section-header">
              <Info size={24} className="section-icon" />
              <h2>Service Summary</h2>
            </div>
            <p className="summary-paragraph">{card.summary}</p>
          </section>

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
        </div>

        <div className="detail-right-column">
          {card.hasMeetButton && (
            <div className="booking-card">
              <div className="booking-header">
                <Video size={24} />
                <h3>Join a Session</h3>
              </div>
              <p>Connect with our mentors during active time slots to get live guidance.</p>
              
              <div className="booking-action-wrap">
                <div className="meet-dropdown-container-detail full-width" ref={dropdownRef}>
                  {activeCountdown ? (
                    <div className="countdown-display large">
                      <span className="countdown-label">{activeCountdown.label}</span>
                      <span className="countdown-time">{getCountdownString(activeCountdown.targetHour)}</span>
                      <button className="reset-countdown" onClick={() => setActiveCountdown(null)}>Change Slot</button>
                    </div>
                  ) : (
                    <button 
                      className="attend-meeting-btn-red"
                      onClick={() => setOpenDropdown(!openDropdown)}
                    >
                      <Video size={18} />
                      <span>Attend Meeting</span>
                    </button>
                  )}
                  
                  {openDropdown && (
                    <div className="detail-slots-dropdown">
                      {timeSlots.map((slot, sIdx) => {
                        const isPast = currentHour >= slot.endHour;
                        return (
                          <button
                            key={sIdx}
                            className={`slot-item ${isPast ? 'slot-past' : ''}`}
                            onClick={() => !isPast && handleSlotClick(slot)}
                            disabled={isPast}
                          >
                            <span className="slot-label">{slot.label}</span>
                            {isPast ? <span className="slot-status">Ended</span> : <span className="slot-status active">Available</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="booking-footer">
                <p>Note: Meetings are conducted via Google Meet. Please ensure you are logged in with your registered email.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounsellingDetail;
