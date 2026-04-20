import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, ClipboardCheck, TrendingUp, Search, Award, CheckCircle } from "lucide-react";
import "./SkillEvaluationPage.css";

const SkillEvaluationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { title: "Baseline Assessment", desc: "Initial test to map your current strengths and weaknesses." },
    { title: "Skill Breakdown", desc: "Detailed analysis of your logic, syntax, and problem-solving speed." },
    { title: "Adaptive Testing", desc: "Periodic quizzes that get harder as you improve to keep you challenged." },
    { title: "Industry Benchmark", desc: "Compare your results with current standards of top tech hiring." }
  ];

  return (
    <div className="feature-page-v4">
      <div className="container-custom">
        <nav className="breadcrumb-v4">
          <Link to="/">Home</Link> <span className="separator">/</span> <span>Skill Evaluation</span>
        </nav>

        <button onClick={() => navigate(-1)} className="back-btn-v4">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        {/* Hero Section */}
        <motion.section 
          className="hero-v4 evaluation-hero-v4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-v4-content">
            <h1 className="hero-v4-title">Skill Evaluation</h1>
            <p className="hero-v4-subtitle">
              Measure your growth with data. Our comprehensive evaluation tools provide the clarity you need to reach the next level.
            </p>
          </div>
          <div className="hero-v4-icon">
            <BarChart3 size={120} />
          </div>
        </motion.section>

        {/* Overview */}
        <section className="section-v4">
          <h2 className="section-v4-title">Overview</h2>
          <p className="section-v4-text">
            Understanding your progress is crucial to maintaining momentum. Our Skill Evaluation system uses data-driven analytics to give you a transparent view of your capabilities. We don't just track if your code works; we track time complexity, code readability, and your ability to handle edge cases. This multi-dimensional evaluation ensures you're not just learning, but mastering the craft of engineering.
          </p>
        </section>

        {/* Key Features */}
        <section className="section-v4">
          <h2 className="section-v4-title">Key Features</h2>
          <div className="features-v4-list">
            <div className="feature-v4-item">
              <ClipboardCheck className="item-icon purple-icon" />
              <div>
                <h3>Mock Tests</h3>
                <p>Timed assessments that simulate the pressure of real coding interviews and exams.</p>
              </div>
            </div>
            <div className="feature-v4-item">
              <TrendingUp className="item-icon purple-icon" />
              <div>
                <h3>Performance Analytics</h3>
                <p>Visual dashboards showing your progress over time across different languages and frameworks.</p>
              </div>
            </div>
            <div className="feature-v4-item">
              <Search className="item-icon purple-icon" />
              <div>
                <h3>Personalized Feedback</h3>
                <p>Receive automated and instructor-led feedback on how to improve your code quality.</p>
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
                <div className="step-circle purple-bg">{i + 1}</div>
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
          <div className="use-case-card purple-dark-bg">
            <div className="use-case-badge purple-bg">Real Use Case</div>
            <h3>Identifying Blind Spots in Data Structures</h3>
            <p>
              Vikram felt confident in his React skills but kept failing interview rounds. Our evaluation system revealed that while his UI logic was strong, his understanding of Array manipulation and Complexity Analysis was in the bottom 30%. By identifying this specific blind spot through targeted assessments, he was able to focus his learning and cleared his next interview at a unicorn startup within 4 weeks.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-v4">
          <div className="cta-v4-box">
            <h2>Ready to test your skills?</h2>
            <p>Take an assessment today and get your detailed skill report.</p>
            <button className="cta-v4-btn purple-bg">
              <Award size={20} />
              <span>Take an Assessment</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SkillEvaluationPage;
