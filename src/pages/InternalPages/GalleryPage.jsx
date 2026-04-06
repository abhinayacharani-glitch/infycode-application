import React, { useEffect } from 'react';
import './GalleryPage.css';

const images = [
    { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', title: 'Tech Symposium 2024' },
    { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800', title: 'Intensive Training Session' },
    { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800', title: 'Web Development Bootcamp' },
    { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800', title: 'Network Infrastructure Lab' },
    { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800', title: 'Cloud Computing Workshop' },
    { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', title: 'Career Guidance Seminar' },
    { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800', title: 'Collaborative Project Work' },
    { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800', title: 'Advanced Cybersecurity Lab' },
    { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', title: 'Full Stack Development' },
];

const GalleryPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="internal-page">
      <div className="internal-hero gallery-hero">
        <div className="internal-hero-content">
          <h1>Visual Journey</h1>
          <p>Explore the moments of learning, innovation, and success at Infycode Tech Campus.</p>
        </div>
      </div>

      <div className="internal-section gallery-section">
        <div className="gallery-grid">
            {images.map((img, i) => (
                <div key={i} className="gallery-item">
                    <img src={img.url} alt={img.title} className="gallery-img" />
                    <div className="gallery-overlay">
                        <h4>{img.title}</h4>
                        <span>Infycode Tech Media</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
