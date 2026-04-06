import React, { useState } from "react";
import "./WhyChoose.css";

import confusedImg from "../../assets/confused.jpeg";
import focusedImg from "../../assets/focused.jpeg";

function WhyChoose() {
  const [activePath, setActivePath] = useState(null);

  return (
    // ✅ ADDED ID HERE (VERY IMPORTANT)
    <section id="why-choose" className="why">

      <h1 className="why-title">Where Do You Stand?</h1>
      <p className="why-sub">
        Choose your path — we’ll take it from there.
      </p>

      {/* OPTIONS WITH IMAGES */}

      <div className="why-options">

        {/* CONFUSED PATH */}
        <div
          className={`why-option ${activePath === "confused" ? "active" : ""}`}
          onClick={() => setActivePath("confused")}
        >
          <img src={confusedImg} alt="Confused Student" />

          <div className="overlay">
            <h3>I’m Not Sure</h3>
            <p>Talk to an expert & find clarity</p>
          </div>
        </div>

        {/* CLEAR PATH */}
        <div
          className={`why-option ${activePath === "clear" ? "active" : ""}`}
          onClick={() => setActivePath("clear")}
        >
          <img src={focusedImg} alt="Focused Student" />

          <div className="overlay">
            <h3>I Know My Path</h3>
            <p>Test your skills & discover your level</p>
          </div>
        </div>

      </div>

      {/* FLOW */}

      {activePath === "confused" && (
        <div className="why-flow fade-in">
          <div className="flow-step">1-on-1 Expert Session</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">Understanding You</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step highlight">Clear Career Direction</div>
        </div>
      )}

      {activePath === "clear" && (
        <div className="why-flow fade-in">
          <div className="flow-step">Skill Assessment</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">Performance Analysis</div>
          <div className="flow-arrow">→</div>
          <div className="flow-step highlight">
            Beginner / Intermediate / Advanced
          </div>
        </div>
      )}

      {/* DETAILS CARDS */}

      {activePath === "confused" && (
        <div className="details fade-in">

          <div className="detail-card">
            <h4>Step 1: Book a Session</h4>
            <p>You connect with an expert based on your interests.</p>
          </div>

          <div className="detail-card">
            <h4>Step 2: 1-on-1 Interaction</h4>
            <p>They understand your strengths, doubts, and mindset.</p>
          </div>

          <div className="detail-card">
            <h4>Step 3: Career Direction</h4>
            <p>You get a clear roadmap tailored to what suits you.</p>
          </div>

        </div>
      )}

      {activePath === "clear" && (
        <div className="details fade-in">

          <div className="detail-card">
            <h4>Step 1: Take Assessment</h4>
            <p>Answer questions designed to test real understanding.</p>
          </div>

          <div className="detail-card">
            <h4>Step 2: Evaluation</h4>
            <p>Your performance is analyzed deeply.</p>
          </div>

          <div className="detail-card">
            <h4>Step 3: Your Level</h4>
            <p>You are placed into Beginner, Intermediate, or Advanced.</p>
          </div>

        </div>
      )}

    </section>
  );
}

export default WhyChoose;