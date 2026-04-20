import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, FileText, GraduationCap, Quote, Users, UserCheck, Search } from "lucide-react";
import "./CareerPreparationPage.css";

const CareerPreparationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    { title: "Profile Auditing", desc: "We review your current resume, LinkedIn, and GitHub to create an improvement plan." },
    { title: "Portfolio Building", desc: "Strategic selection of projects that showcase the skills recruiters are looking for." },
    { title: "Mock Interview Marathons", desc: "Multiple rounds of technical and HR interviews with detailed feedback." },
    { title: "Placement Drive", desc: "Connecting you with our network of hiring partners for interviews." }
  ];

  return (
    <div className="feature-page-v4">
      {/* Fixed Back Button */}
      <button className="global-back-btn-v4" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="container-custom">
        <nav className="breadcrumb-v4">
          <Link to="/">Home</Link> <span className="separator">/</span> <span>Career Preparation</span>
        </nav>

        {/* Hero Section */}
        <motion.section 
          className="hero-v4 career-hero-v4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-v4-content">
            <h1 className="hero-v4-title">Career Preparation</h1>
            <p className="hero-v4-subtitle">
              Your professional debut starts here. We equip you with the soft skills and strategy needed to stand out in a competitive market.
            </p>
          </div>
          <div className="hero-v4-icon">
            <Briefcase size={120} />
          </div>
        </motion.section>

        {/* Overview */}
        <section className="section-v4">
          <h2 className="section-v4-title">Overview</h2>
          <p className="section-v4-text">
            Technical skill is the ticket to the interview, but career strategy is what gets you the job. Our Career Preparation program focuses on the "Human" side of engineering. We help you tell your story through your resume, navigate complex behavioral interviews, and negotiate your worth. From LinkedIn optimization to salary negotiation, we ensure you're fully equipped to handle every stage of the hiring process with confidence.
          </p>
        </section>

        {/* Key Features */}
        <section className="section-v4">
          <h2 className="section-v4-title">Key Features</h2>
          <div className="features-v4-list">
            <div className="feature-v4-item">
              <FileText className="item-icon orange-icon" />
              <div>
                <h3>Resume Building</h3>
                <p>Collaborative workshops to build ATS-friendly resumes that highlight your technical impact.</p>
              </div>
            </div>
            <div className="feature-v4-item">
              <UserCheck className="item-icon orange-icon" />
              <div>
                <h3>Mock Interviews</h3>
                <p>Simulated environments for Technical, System Design, and Behavioral interview rounds.</p>
              </div>
            </div>
            <div className="feature-v4-item">
              <GraduationCap className="item-icon orange-icon" />
              <div>
                <h3>Placement Support</h3>
                <p>Direct referrals and interview opportunities with our network of 200+ hiring partners.</p>
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
                <div className="step-circle orange-bg">{i + 1}</div>
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
          <div className="use-case-card orange-dark-bg">
            <div className="use-case-badge orange-bg">Real Use Case</div>
            <h3>Cracking the Technical HR Round</h3>
            <p>
              Siddharth had a strong GitHub profile but struggled to explain his architectural decisions during behavioral rounds. Our Career Coach conducted 3 mock HR rounds with him, helping him refine his communication style. This preparation was pivotal when he interviewed at a major FinTech firm; the recruiter specifically praised his clarity of thought and professional conduct.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-v4">
          <div className="cta-v4-box">
            <h2>Ready to launch your career?</h2>
            <p>Start your career preparation journey and get job-ready.</p>
            <button className="cta-v4-btn orange-bg">
              <Search size={20} />
              <span>Explore Opportunities</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CareerPreparationPage;
