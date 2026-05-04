import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './EbooksPage.css';

const ebooks = [
  {
    id: 1,
    title: "System Design Interview Cheat Sheet",
    desc: "A 50-page PDF covering the most common system design patterns, scaling bottlenecks, and database choices asked at FAANG.",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    pages: "52 Pages",
    size: "4.2 MB"
  },
  {
    id: 2,
    title: "The Next-Gen CSS Playbook",
    desc: "Master modern CSS features including Subgrid, Container Queries, and new color spaces with practical examples.",
    img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800",
    pages: "34 Pages",
    size: "2.8 MB"
  },
  {
    id: 3,
    title: "React Performance Tuning Guide",
    desc: "An advanced handbook on solving render bottlenecks, utilizing useMemo strictly, and measuring Core Web Vitals.",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    pages: "45 Pages",
    size: "3.5 MB"
  }
];

const EbooksPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="ebooks-page">
      <button className="modern-back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
      <div
        className="ebooks-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="ebooks-hero-content">
          <h1>Free Library: eBooks &amp; Guides</h1>
          <p>Download our extensive collection of technical handbooks, interview prep guides, and architectural cheat sheets.</p>
        </div>
      </div>

      <div className="ebooks-section">
        <div className="ebooks-grid">
          {ebooks.map((book) => (
            <div className="ebooks-card" key={book.id}>
              <img src={book.img} alt={book.title} className="ebooks-card-img" />
              <div className="ebooks-card-body">
                <div className="ebooks-card-header">
                  <span className="ebooks-type-tag">PDF Download</span>
                  <span className="ebooks-size-label">{book.size}</span>
                </div>
                <h3>{book.title}</h3>
                <p>{book.desc}</p>
                <div className="ebooks-card-footer">
                  <button className="ebooks-download-btn">Download {book.pages}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EbooksPage;
