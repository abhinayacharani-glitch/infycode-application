import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Code, Layers, Zap, Cpu, Terminal, Laptop } from "lucide-react";
import "./PracticalLearningPage.css";

const PracticalLearningPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { title: "Concept Immersion", desc: "Short, targeted video lessons focusing on specific technical concepts." },
    { title: "Guided Exercises", desc: "Live coding along with instructors to build initial logic." },
    { title: "Project Sprint", desc: "Building modular components of a full-scale real-world application." },
    { title: "Code Review", desc: "Industry-standard PR reviews to polish and optimize your code." }
  ];

  return (
    <div className="feature-page-v4">
      <div className="container-custom">
        <nav className="breadcrumb-v4">
          <Link to="/">Home</Link> <span className="separator">/</span> <span>Practical Learning</span>
        </nav>

        <button onClick={() => navigate(-1)} className="back-btn-v4">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Hero Section */}
        <motion.section 
          className="hero-v4 practical-hero-v4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-v4-content">
            <h1 className="hero-v4-title">Practical Learning</h1>
            <p className="hero-v4-subtitle">
              Move beyond theory. Build production-grade applications and gain the hands-on experience that employers actually value.
            </p>
          </div>
          <div className="hero-v4-icon">
            <Terminal size={120} />
          </div>
        </motion.section>

        {/* Overview */}
        <section className="section-v4">
          <h2 className="section-v4-title">Overview</h2>
          <p className="section-v4-text">
            Our Practical Learning approach is built on the philosophy of "Learning by Doing." Instead of passive watching, you'll spend 80% of your time in the code editor. We provide a cloud-based IDE and real-world datasets so you can tackle problems exactly as they appear in modern tech teams. From building scalable backends to crafting pixel-perfect frontends, your journey is defined by the code you write.
          </p>
        </section>

        {/* Key Features */}
        <section className="section-v4">
          <h2 className="section-v4-title">Key Features</h2>
          <div className="features-v4-list">
            <div className="feature-v4-item">
              <Play className="item-icon green-icon" />
              <div>
                <h3>Interactive Lessons</h3>
                <p>Follow along with video content while coding in your browser-based environment.</p>
              </div>
            </div>
            <div className="feature-v4-item">
              <Code className="item-icon green-icon" />
              <div>
                <h3>Real-world Projects</h3>
                <p>Build clones of popular apps like Netflix, Slack, or Trello to master complex logic.</p>
              </div>
            </div>
            <div className="feature-v4-item">
              <Cpu className="item-icon green-icon" />
              <div>
                <h3>Industry Use-cases</h3>
                <p>Solve challenges based on actual problems faced by companies in logistics, finance, and health-tech.</p>
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
                <div className="step-circle green-bg">{i + 1}</div>
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
          <div className="use-case-card green-dark-bg">
            <div className="use-case-badge green-bg">Real Use Case</div>
            <h3>Building a Multi-Vendor E-commerce Backend</h3>
            <p>
              In our Advanced Node.js module, students don't just learn about APIs. They build a multi-vendor backend that handles inventory management, real-time notifications, and stripe payment integration. One of our students, Rohan, used this exact project to demonstrate his mastery of microservices during a successful interview at a logistics startup.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-v4">
          <div className="cta-v4-box">
            <h2>Ready to start building?</h2>
            <p>Dive into our project-based curriculum and build your portfolio.</p>
            <button className="cta-v4-btn green-bg">
              <Laptop size={20} />
              <span>Start Learning Now</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PracticalLearningPage;
