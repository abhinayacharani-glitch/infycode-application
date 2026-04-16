import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./WhyChoose.css";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Info, X, ChevronRight, CheckCircle2, Video, Trophy, ArrowUpRight, BarChart3, GraduationCap } from "lucide-react";

import confusedImg from "../../assets/confused.jpeg";
import focusedImg from "../../assets/focused.jpeg";

const PATH_DATA = {
  confused: {
    title: "Strategic Mentorship Path",
    description: "Personalized guidance to help you navigate your career journey with confidence.",
    steps: [
      {
        icon: <Video size={24} />,
        title: "Step 1: Book a Session",
        text: "You connect with an expert based on your interests and goals.",
        link: "/expert-consultation/book"
      },
      {
        icon: <Info size={24} />,
        title: "Step 2: 1-on-1 Interaction",
        text: "Deep dive into your strengths, doubts, and aspirations with a mentor.",
        link: "/expert-consultation/session"
      },
      {
        icon: <CheckCircle2 size={24} />,
        title: "Step 3: Career Direction",
        text: "Receive a tailored roadmap designed specifically for your growth.",
        link: "/expert-consultation/roadmap"
      },
    ],
  },
  clear: {
    title: "Skill Test",
    description: "Evaluate your technical strengths and identify your professional standing.",
    steps: [
      {
        icon: <BarChart3 size={24} />,
        title: "Step 1: Foundational Test",
        text: "Assess Aptitude, Reasoning, and Communication skills essential for industry.",
        link: "/skill-test/foundational"
      },
      {
        icon: <Trophy size={24} />,
        title: "Step 2: Evaluation Status",
        text: "Real-time AI analysis of your test performance and technical depth.",
        link: "/skill-test/evaluation"
      },
      {
        icon: <GraduationCap size={24} />,
        title: "Step 3: Your Skill Level",
        text: "Get crystallized feedback and discover if you are Beginner, Intermediate, or Advanced.",
        link: "/skill-test/result"
      },
    ],
  },
};

function WhyChoose() {
  const [activePath, setActivePath] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPathData, setSelectedPathData] = useState(null);
  const navigate = useNavigate();

  // ✅ AOS INIT
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  const handleKnowMore = (e, path) => {
    e.stopPropagation(); // Prevent triggering card click
    setSelectedPathData(PATH_DATA[path]);
    setShowModal(true);
  };

  const handleStepClick = (link) => {
    setShowModal(false);
    navigate(link);
    window.scrollTo(0, 0);
  };

  return (
    <section id="why-choose" className="why">
      <h1 className="why-title" data-aos="fade-up">
        Where Do You Stand?
      </h1>

      <p className="why-sub" data-aos="fade-up" data-aos-delay="100">
        Choose your path — we’ll take it from there.
      </p>

      {/* OPTIONS WITH IMAGES */}
      <div className="why-options">
        {/* CONFUSED PATH */}
        <div
          className={`why-option ${activePath === "confused" ? "active" : ""}`}
          onClick={() => setActivePath("confused")}
          data-aos="fade-right"
        >
          <img src={confusedImg} alt="Confused Student" />
          <div className="overlay">
            <div className="overlay-text">
              <h3>I’m Not Sure</h3>
              <p>Talk to an expert & find clarity</p>
            </div>
            <button className="know-more-btn" onClick={(e) => handleKnowMore(e, "confused")}>
              Know More <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* CLEAR PATH */}
        <div
          className={`why-option ${activePath === "clear" ? "active" : ""}`}
          onClick={() => setActivePath("clear")}
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <img src={focusedImg} alt="Focused Student" />
          <div className="overlay">
            <div className="overlay-text">
              <h3>I Know My Path</h3>
              <p>Test your skills & discover your level</p>
            </div>
            <button className="know-more-btn" onClick={(e) => handleKnowMore(e, "clear")}>
              Know More <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* FLOW (Quick View) */}
      <div className="flow-container">
        <AnimatePresence>
          {activePath && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="why-flow"
              key={activePath}
            >
              {activePath === "confused" ? (
                <>
                  <div className="flow-step">1-on-1 Expert Session</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">Understanding You</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step highlight">Clear Career Direction</div>
                </>
              ) : (
                <>
                  <div className="flow-step">Skill Assessment</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">Performance Analysis</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step highlight">
                    Beginner / Intermediate / Advanced
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* PROFESSIONAL MODAL */}
      <AnimatePresence>
        {showModal && selectedPathData && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>

              <div className="modal-header">
                <h2>{selectedPathData.title}</h2>
                <p>{selectedPathData.description}</p>
              </div>

              <div className="modal-steps">
                {selectedPathData.steps.map((step, index) => (
                  <motion.div 
                    key={index} 
                    className="modal-step-card interactive"
                    onClick={() => handleStepClick(step.link)}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="step-marker">
                        <div className="step-count">0{index + 1}</div>
                        <div className="step-icon">
                            {step.icon}
                        </div>
                    </div>
                    <div className="step-info">
                      <h4>{step.title}</h4>
                      <p>{step.text}</p>
                    </div>
                    <div className="step-action-arrow">
                      <ArrowUpRight size={22} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="modal-footer">
                <button className="modal-action-btn" onClick={() => setShowModal(false)}>
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default WhyChoose;