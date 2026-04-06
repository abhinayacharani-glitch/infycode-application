import React, { useState, useEffect, useRef } from 'react';
import './Counselling.css';

const Counselling = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [activeCountdowns, setActiveCountdowns] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const dropdownRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const timeSlots = [
    { label: '10 AM - 11 AM', startHour: 10, endHour: 11 },
    { label: '11 AM - 12 PM', startHour: 11, endHour: 12 },
    { label: '2 PM - 3 PM', startHour: 14, endHour: 15 },
    { label: '3 PM - 4 PM', startHour: 15, endHour: 16 },
  ];

  const currentHour = currentTime.getHours();

  const handleSlotClick = (cardIndex, slot) => {
    if (currentHour >= slot.startHour && currentHour < slot.endHour) {
      window.open('https://meet.google.com/wxs-wifp-tti', '_blank', 'noopener,noreferrer');
    } else if (currentHour < slot.startHour) {
      setActiveCountdowns(prev => ({
        ...prev,
        [cardIndex]: { targetHour: slot.startHour, label: slot.label }
      }));
    }
    setOpenDropdownId(null);
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
  const cards = [
    {
      title: '1-1 Career Counselling',
      description: 'Get personalized guidance from experts to shape your career path.',
      imageUrl: 'https://medavas.com/wp-content/uploads/2023/12/career-counselling-online-1024x683.jpg',
      hasMeetButton: true,
    },
    {
      title: '1-Many Counselling',
      description: 'Collaborate with peers and learn industry insights together.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
      hasMeetButton: true,
    },
    {
      title: 'Upcoming Counselling',
      description: 'Stay updated with upcoming sessions and expert talks.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Career Guidance',
      description: 'Structured roadmap to achieve your career goals efficiently.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="page-container">
      <header className="page-header-centered">
        <h2>Counselling Services</h2>
        <p>Expert guidance and mentorship for a successful learning journey with InfyCode.</p>
      </header>

      <div className="counselling-grid">
        {cards.map((card, index) => (
          <div key={index} className="counselling-card-premium">
            <div className="card-image-wrapper">
              <img src={card.imageUrl} alt={card.title} className="card-image" />
            </div>
            <div className="card-content-premium">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-actions">
                <button className="card-action-btn">Learn More</button>
                {card.hasMeetButton && (
                  <div className="meet-dropdown-container" ref={openDropdownId === index ? dropdownRef : null}>
                    {activeCountdowns[index] ? (
                      <div className="countdown-display">
                        <span className="countdown-label">{activeCountdowns[index].label}</span>
                        <span className="countdown-time">{getCountdownString(activeCountdowns[index].targetHour)}</span>
                      </div>
                    ) : (
                      <button 
                        className="card-action-btn meet-btn"
                        onClick={() => setOpenDropdownId(openDropdownId === index ? null : index)}
                      >
                        Attend Meeting
                      </button>
                    )}
                    
                    {openDropdownId === index && (
                      <div className="slots-dropdown-menu">
                        {timeSlots.map((slot, sIdx) => {
                          const isPast = currentHour >= slot.endHour;
                          return (
                            <button
                              key={sIdx}
                              className={`slot-dropdown-item ${isPast ? 'slot-past' : ''}`}
                              onClick={() => !isPast && handleSlotClick(index, slot)}
                              disabled={isPast}
                              style={{ opacity: isPast ? 0.5 : 1, cursor: isPast ? 'not-allowed' : 'pointer' }}
                            >
                              {slot.label} {isPast && '(Ended)'}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Counselling;