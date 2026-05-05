import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from "react-icons/fi";
import './ResourcesPage.css';

const resources = [
  {
    id: 1,
    title: "10 React Best Practices for 2026",
    desc: "A comprehensive guide to writing clean, scalable, and maintainable React code using the latest features.",
    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    date: "Mar 15, 2026",
    type: "Article"
  },
  {
    id: 2,
    title: "System Design Interview Prep Guide",
    desc: "Download our 50-page PDF covering the most common system design patterns asked at FAANG level companies.",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    date: "Mar 10, 2026",
    type: "eBook"
  },
  {
    id: 3,
    title: "Understanding Docker & Kubernetes",
    desc: "A 45-minute video masterclass breaking down containerization and orchestration for absolute beginners.",
    img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800",
    date: "Mar 02, 2026",
    type: "Video Series"
  }
];

const ResourcesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="resources-page">
      <div
        className="resources-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1920)', position: 'relative' }}
      >
        <button 
          className="fp-back-btn" 
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', zIndex: 10, backdropFilter: 'blur(5px)', fontSize: '15px', fontWeight: '600', transition: 'background 0.3s' }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
        >
          <FiArrowLeft size={18} /> Back
        </button>
        <div className="resources-hero-content">
          <h1>Knowledge Base &amp; Resources</h1>
          <p>Accelerate your learning with free articles, developer guides, cheat sheets, and technical deep-dives authored by INFYCODE experts.</p>
        </div>
      </div>

      <div className="resources-section" id="articles">
        <h2 className="resources-section-title">Latest Publications</h2>
        <div className="resources-grid">
          {resources.map((res) => (
            <div className="resources-card" key={res.id}>
              <img src={res.img} alt={res.title} className="resources-card-img" />
              <div className="resources-card-body">
                <div className="resources-card-header">
                  <span className="resources-type-tag">{res.type}</span>
                  <span className="resources-date">{res.date}</span>
                </div>
                <h3>{res.title}</h3>
                <p>{res.desc}</p>
                <div className="resources-card-footer">
                  <button className="resources-read-btn">Read More →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
