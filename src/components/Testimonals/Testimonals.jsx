import React, { useState, useEffect, useRef } from "react";
import "./Testimonals.css";
import venkatImg from "../../assets/testimonials/venkat.jpg";
import devendraImg from "../../assets/testimonials/devendra.jpg";
import phaniImg from "../../assets/testimonials/phani.jpg";
import anjaliImg from "../../assets/testimonials/anjali.jpg";
import hemasunderImg from "../../assets/testimonials/hemasunder.jpg";
import lavanyaImg from "../../assets/testimonials/lavanya.jpg";
import nikhilImg from "../../assets/testimonials/nikhil.jpg";

function Testimonals() {
  const original = [
    {
      name: "Venkat",
      role: "- Student",
      img: venkatImg,
      text: "There is nothing more important than continuous learning and improving your skills.",
      stars: 5,
      color: "#e8f5e9"
    },
    {
      name: "Devendra",
      role: "- Student",
      img: devendraImg,
      text: "Learning new skills consistently helps build a strong and successful career.",
      stars: 5,
      color: "#e3f2fd"
    },
    {
      name: "Anjali",
      role: "- Student",
      img: anjaliImg,
      text: "With the right guidance and practice, anyone can achieve their goals.",
      stars: 5,
      color: "#fce4ec"
    },
    {
      name: "Phani",
      role: "-Student",
      img: phaniImg,
      text: "A great learning experience with practical knowledge and expert support.",
      stars: 5,
      color: "#fff3e0"
    },
    {
      name: "Hema Sunder",
      role: "- Student",
      img: hemasunderImg,
      text: "The curriculum is perfectly designed for career growth and skill mastery.",
      stars: 5,
      color: "#f3e5f5"
    },
    {
      name: "Lavanya",
      role: "- Student",
      img: lavanyaImg,
      text: "Highly recommended for anyone looking to transition into a tech career.",
      stars: 5,
      color: "#fffde7"
    },
    {
      name: "Nikhil",
      role: "- Student",
      img: nikhilImg,
      text: "Practical projects and industry-relevant curriculum helped me land my dream job.",
      stars: 5,
      color: "#f1f8e9"
    }
  ];

  // Duplicate cards for seamless loop
  const testimonials = [...original, ...original, ...original];

  const [index, setIndex] = useState(original.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 4000);
    return () => clearInterval(interval);
  }, [index]);

  // Handle seamless reset
  useEffect(() => {
    if (index >= original.length * 2) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(original.length);
      }, 600);
    } else if (index < original.length) {
      setTimeout(() => {
        setIsTransitioning(false);
        setIndex(original.length * 2 - 1);
      }, 600);
    } else {
      setIsTransitioning(true);
    }
  }, [index, original.length]);

  const next = () => {
    setIndex((prev) => prev + 1);
  };

  const prev = () => {
    setIndex((prev) => prev - 1);
  };

  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials-bg-overlay"></div>

      <div className="testimonials-header">
        <h2>Testimonals</h2>
        {/* <p>Hear from our satisfied customers</p> */}
      </div>

      <div className="testimonial-container">
        <button className="nav-arrow prev" onClick={prev} aria-label="Previous testimonial">
          <span className="arrow-icon">❮</span>
        </button>

        <div className="testimonial-viewport">
          <div
            ref={trackRef}
            className="testimonial-track"
            style={{
              transform: `translateX(calc(-${index * (100 / 3)}%))`,
              transition: isTransitioning ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "none"
            }}
          >
            {testimonials.map((t, i) => {
              const isActive = i === index + 1; // Assuming 3 cards visible, center is index + 1
              return (
                <div key={i} className={`testimonial-card ${isActive ? "active" : ""}`}>
                  <div className="card-glass">
                    <div className="card-body">
                      <div className="stars">
                        {[...Array(t.stars)].map((_, si) => (
                          <span key={si}>★</span>
                        ))}
                      </div>
                      <p className="quote">{t.text}</p>
                    </div>
                    <div className="user-info" style={{ backgroundColor: t.color }}>
                      <div className="avatar-wrapper">
                        <img 
                          src={t.img} 
                          alt={t.name} 
                          style={t.name === "Phani" ? { objectPosition: 'center 15%', transform: 'scale(1.4)' } : {}}
                        />
                      </div>
                      <div className="user-details">
                        <h3>{t.name}</h3>
                        <p className="role">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button className="nav-arrow next" onClick={next} aria-label="Next testimonial">
          <span className="arrow-icon">❯</span>
        </button>
      </div>

      <div className="pagination-dots">
        {original.map((_, i) => (
          <span
            key={i}
            className={`dot ${(index % original.length) === i ? "active" : ""}`}
            onClick={() => setIndex(original.length + i)}
          ></span>
        ))}
      </div>
    </section>
  );
}

export default Testimonals;
