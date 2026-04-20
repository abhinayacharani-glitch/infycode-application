import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Users, ShieldCheck, MessageCircle, Star, Target, Zap, CheckCircle2 } from "lucide-react";
import "./MentorshipPage.css";

const MentorshipPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { title: "Matching", desc: "We pair you with a mentor based on your career goals and current skill level." },
    { title: "Personalized Roadmap", desc: "Your mentor creates a custom learning path with clear milestones." },
    { title: "Weekly Check-ins", desc: "Regular 1-on-1 sessions to review progress and solve technical blockers." },
    { title: "Career Readiness", desc: "Intensive preparation for interviews and industry-standard workflows." }
  ];

  return (
    <div className="feature-page-v4">
      {/* Fixed Back Button */}
      <button className="global-back-btn-v4" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="container-custom">
        <nav className="breadcrumb-v4">
          <Link to="/">Home</Link> <span className="separator">/</span> <span>Mentorship & Guidance</span>
        </nav>

        {/* Hero Section */}
        <motion.section 
          className="hero-v4 mentorship-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-v4-content">
            <h1 className="hero-v4-title">Mentorship & Guidance</h1>
            <p className="hero-v4-subtitle">
              Accelerate your career with personalized support from industry veterans who have walked the path you're on.
            </p>
          </div>
          <div className="hero-v4-icon">
            <Users size={120} />
          </div>
        </motion.section>

        {/* Overview */}
        <section className="section-v4">
          <h2 className="section-v4-title">Overview</h2>
          <p className="section-v4-text">
            Our Mentorship & Guidance program is designed to bridge the gap between theoretical knowledge and professional excellence. We believe that learning to code is only half the journey; the other half is understanding industry expectations, best practices, and career strategy. Our mentors are senior developers and leads from top tech companies who provide 1-on-1 support, ensuring you never feel lost in your learning journey.
          </p>
        </section>

        {/* Key Features */}
        <section className="section-v4">
          <h2 className="section-v4-title">Key Features</h2>
          <div className="features-v4-list">
            <div className="feature-v4-item">
              <Star className="item-icon" />
              <div>
                <h3>1:1 Personal Sessions</h3>
                <p>Private time with your mentor to discuss anything from code bugs to career anxiety.</p>
              </div>
            </div>
            <div className="feature-v4-item">
              <Zap className="item-icon" />
              <div>
                <h3>Weekly Doubt Clearing</h3>
                <p>Structured sessions to resolve complex technical queries and architectural challenges.</p>
              </div>
            </div>
            <div className="feature-v4-item">
              <Target className="item-icon" />
              <div>
                <h3>Portfolio Review</h3>
                <p>Get professional feedback on your projects to ensure they meet high industry standards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="section-v4">
          <h2 className="section-v4-title">How It Works</h2>
          <div className="flow-v4">
            {steps.map((step, i) => (
              <div key={i} className="flow-v4-step">
                <div className="step-circle">{i + 1}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </section>

        {/* Real Use Case */}
        <section className="section-v4 use-case-v4">
          <div className="use-case-card">
            <div className="use-case-badge">Real Use Case</div>
            <h3>Transitioning from College to a Product Company</h3>
            <p>
              Ananya, a final year student, struggled with system design concepts required for top-tier companies. Her mentor, a Lead Engineer at Amazon, worked with her for 8 weeks on building a scalable distributed system. She didn't just learn the theory; she implemented it under expert supervision, leading to a successful placement at a Tier-1 product firm.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-v4">
          <div className="cta-v4-box">
            <h2>Ready to find your guide?</h2>
            <p>Join the program and get matched with a mentor today.</p>
            <button className="cta-v4-btn">
              <MessageCircle size={20} />
              <span>Connect with a Mentor</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MentorshipPage;
