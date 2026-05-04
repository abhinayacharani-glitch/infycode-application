import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './ArticlesPage.css';

const articles = [
  {
    id: 1,
    title: "10 React Best Practices for 2026",
    desc: "A comprehensive guide to writing clean, scalable, and maintainable React code utilizing the newest Hooks and compiler optimizations.",
    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    date: "Mar 15, 2026",
    author: "Alex Mercer"
  },
  {
    id: 2,
    title: "Understanding Microservices vs Monoliths",
    desc: "An architectural deep-dive into the trade-offs between monolithic architectures and deployed microservices.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    date: "Mar 10, 2026",
    author: "Sarah Chen"
  },
  {
    id: 3,
    title: "The Future of AI in Software Engineering",
    desc: "How tools like GitHub Copilot and autonomous agents are reshaping the day-to-day workflow of modern engineers.",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    date: "Mar 02, 2026",
    author: "David Kumar"
  }
];

const ArticlesPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="articles-page">
      <button className="modern-back-btn" onClick={() => navigate("/")}>
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
      <div
        className="articles-hero"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=1920)' }}
      >
        <div className="articles-hero-content">
          <h1>Technical Articles &amp; Insights</h1>
          <p>Read the latest engineering blogs, architectural patterns, and career advice from our expert faculty.</p>
        </div>
      </div>

      <div className="articles-section">
        <div className="articles-grid">
          {articles.map((art) => (
            <div className="articles-card" key={art.id}>
              <img src={art.img} alt={art.title} className="articles-card-img" />
              <div className="articles-card-body">
                <div className="articles-card-header">
                  <span className="articles-author-tag">{art.author}</span>
                  <span className="articles-date">{art.date}</span>
                </div>
                <h3>{art.title}</h3>
                <p>{art.desc}</p>
                <div className="articles-card-footer">
                  <button className="articles-read-btn">Read Article →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
