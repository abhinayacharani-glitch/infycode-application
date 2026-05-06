import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./Hero.css";
import image1 from "../../assets/image1.jpeg";
import image2 from "../../assets/image2.jpeg";
import image3 from "../../assets/image3.jpeg";

function Hero() {

  const images = [image1, image2, image3];

  const slideContent = [
    { title1: "Master Coding", title2: "Build Your Future" },
    { title1: "Learn From Experts", title2: "Grow Your Skills" },
    { title1: "From Beginner to", title2: "Job-Ready" }
  ];

  const extendedImages = [images[images.length - 1], ...images, images[0]];

  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const nextSlide = () => {
    setIsClicked(true);
    setIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setIsClicked(true);
    setIndex((prev) => prev - 1);
  };

  useEffect(() => {
    if (isClicked) {
      const timer = setTimeout(() => setIsClicked(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isClicked]);

  useEffect(() => {
    if (index === extendedImages.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 500);
    }

    if (index === 0) {
      setTimeout(() => {
        setTransition(false);
        setIndex(images.length);
      }, 500);
    }
  }, [index]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [index]);

  return (
    <section className="hero" id="hero">

      <div
        className="slide-wrapper"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: transition ? "transform 0.5s ease" : "none"
        }}
      >

        {extendedImages.map((img, i) => (
          <div className="slide" key={i}>

            <img src={img} alt="learning" className="hero-bg" />

            <div className="hero-text">

              <div className={`hero-text-anim ${isClicked ? "animate" : ""}`}>

                <h1>
                  <span>{slideContent[(i - 1 + images.length) % images.length].title1}</span><br />
                  <span>{slideContent[(i - 1 + images.length) % images.length].title2}</span>
                </h1>

                <div className="hero-buttons" id="hero-actions">

                  <button
                    className="btn"
                    onClick={() => {
                      const section = document.getElementById("why-choose");
                      if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                  >
                    Start Learning
                  </button>

                  {/* ✅ PLAY BUTTON */}
                  <button
                    className="play-btn"
                    onClick={() => setShowVideo(true)}
                  >
                    ▶
                  </button>

                </div>

              </div>

            </div>

          </div>
        ))}

      </div>

      {/* ✅ INLINE VIDEO (NEW) */}
      {showVideo && (
        <div
          className="hero-video-overlay"
          onClick={() => setShowVideo(false)}  // click outside to close
        >

          <div
            className="hero-video-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-video"
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
            >
              <X size={20} />
            </button>

            <div className="hero-video-inner">
              <iframe
                src="https://www.youtube.com/embed/kqtD5dpn9C8?autoplay=1"
                title="Educational Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>

        </div>
      )}

      <div className="slider-controls">
        <span className="slide-number">
          {String(((index - 1 + images.length) % images.length) + 1).padStart(2, "0")}/03
        </span>

        <div className="slider-line"></div>

        <button className="slider-arrow" onClick={prevSlide}>‹</button>
        <button className="slider-arrow" onClick={nextSlide}>›</button>
      </div>

    </section>
  );
}

export default Hero;