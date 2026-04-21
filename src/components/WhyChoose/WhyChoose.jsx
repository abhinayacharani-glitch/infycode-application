import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./WhyChoose.css";

import confusedImg from "../../assets/confused.jpeg";
import focusedImg from "../../assets/focused.jpeg";

function WhyChoose() {
  const [activePath, setActivePath] = useState(null);

  // ✅ AOS INIT
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section id="why-choose" className="why">

      <h1 className="why-title" data-aos="fade-up">
        Where Do You Stand?
      </h1>

      <p className="why-sub" data-aos="fade-up" data-aos-delay="100">
        Choose your path — we’ll take it from there.
      </p>

      {/* INTERACTIVE CONTAINER */}
      <div className={`why-interactive-container ${activePath === "confused" ? "is-active-confused" : activePath === "clear" ? "is-active-clear" : ""}`}>

        {/* CONFUSED PATH (LEFT CARD) */}
        <div className={`why-card-wrapper left-card ${activePath === "confused" ? "selected" : ""} ${activePath === "clear" ? "dimmed" : ""}`}>
          <div
            className={`why-option ${activePath === "confused" ? "active" : ""}`}
            onClick={() => setActivePath(activePath === "confused" ? null : "confused")}
          >
            <img src={confusedImg} alt="Confused Student" />
            <div className="overlay">
              <h3>I’m Not Sure</h3>
              <p>Talk to an expert & find clarity</p>
            </div>
          </div>
        </div>

        {/* MIDDLE STEPS */}
        <div className={`why-middle-content ${activePath ? "visible" : ""}`}>
          {activePath === "confused" && (
            <div className="vertical-stepper fade-in">
              <div className="step-item" style={{ animationDelay: "0.1s" }}>
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Book a Session</h4>
                  <p>You connect with an expert based on your interests.</p>
                </div>
              </div>
              <div className="step-connector" style={{ animationDelay: "0.2s" }}></div>
              <div className="step-item" style={{ animationDelay: "0.3s" }}>
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>1-on-1 Interaction</h4>
                  <p>They understand your strengths, doubts, and mindset.</p>
                </div>
              </div>
              <div className="step-connector" style={{ animationDelay: "0.4s" }}></div>
              <div className="step-item" style={{ animationDelay: "0.5s" }}>
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Career Direction</h4>
                  <p>You get a clear roadmap tailored to what suits you.</p>
                </div>
              </div>
            </div>
          )}

          {activePath === "clear" && (
            <div className="vertical-stepper fade-in">
              <div className="step-item" style={{ animationDelay: "0.1s" }}>
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Take Assessment</h4>
                  <p>Answer questions designed to test real understanding.</p>
                </div>
              </div>
              <div className="step-connector" style={{ animationDelay: "0.2s" }}></div>
              <div className="step-item" style={{ animationDelay: "0.3s" }}>
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Evaluation</h4>
                  <p>Your performance is analyzed deeply.</p>
                </div>
              </div>
              <div className="step-connector" style={{ animationDelay: "0.4s" }}></div>
              <div className="step-item" style={{ animationDelay: "0.5s" }}>
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Your Level</h4>
                  <p>You are placed into Beginner, Intermediate, or Advanced.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CLEAR PATH (RIGHT CARD) */}
        <div className={`why-card-wrapper right-card ${activePath === "clear" ? "selected" : ""} ${activePath === "confused" ? "dimmed" : ""}`}>
          <div
            className={`why-option ${activePath === "clear" ? "active" : ""}`}
            onClick={() => setActivePath(activePath === "clear" ? null : "clear")}
          >
            <img src={focusedImg} alt="Focused Student" />
            <div className="overlay">
              <h3>I Know My Path</h3>
              <p>Test your skills & discover your level</p>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}

export default WhyChoose;