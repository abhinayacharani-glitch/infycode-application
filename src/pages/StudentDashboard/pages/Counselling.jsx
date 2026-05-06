import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Counselling.css';

const Counselling = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const cards = [
    {
      id: 0,
      title: '1-1 Career Counselling',
      description: 'Get personalized guidance from experts to shape your career path.',
      imageUrl: 'https://medavas.com/wp-content/uploads/2023/12/career-counselling-online-1024x683.jpg',
    },
    {
      id: 1,
      title: '1-Many Counselling',
      description: 'Collaborate with peers and learn industry insights together.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 2,
      title: 'Upcoming Counselling',
      description: 'Stay updated with upcoming sessions and expert talks.',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
      isUpcoming: true,
    },
    {
      id: 3,
      title: 'Career Guidance',
      description: 'Structured roadmap to achieve your career goals efficiently.',
      imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
      isUpcoming: true,
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
          <div 
            key={index} 
            className="counselling-card-premium"
            onClick={() => !card.isUpcoming && navigate(`/student-dashboard/counselling/${card.id}`)}
            style={{ cursor: card.isUpcoming ? 'default' : 'pointer' }}
          >
            <div className="card-image-wrapper">
              <img src={card.imageUrl} alt={card.title} className="card-image" />
            </div>
            <div className="card-content-premium">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-actions">
                <button 
                  className={`card-action-btn ${card.isUpcoming ? 'disabled-upcoming' : ''}`}
                  onClick={() => !card.isUpcoming && navigate(`/student-dashboard/counselling/${card.id}`)}
                  disabled={card.isUpcoming}
                  title={card.isUpcoming ? 'Upcoming' : ''}
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Counselling;