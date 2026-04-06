import React, { useEffect } from 'react';
import './BecomeTrainerPage.css';

const BecomeTrainerPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="internal-page">
      <div className="internal-hero trainer-hero">
        <div className="internal-hero-content">
          <h1>Join Our Elite Faculty</h1>
          <p>Inspire the next generation of tech professionals. If you are an industry expert passionate about teaching, we want you on our team.</p>
        </div>
      </div>

      <div className="internal-section trainer-section">
        <h2 className="section-title">Our Experts</h2>
        
        <div className="trainer-experts-grid">
          {[
            {
              name: "Dr. Arshdeep Singh",
              role: "Senior Java Architect",
              exp: "12+ Years Experience",
              bio: "Expert in Spring Boot, Microservices, and Enterprise Architecture with a track record of training 2000+ developers.",
              img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400"
            },
            {
              name: "Sarah Chen",
              role: "Python & AI Developer",
              exp: "8+ Years Experience",
              bio: "Specialist in Data Science, Machine Learning, and Automation. Passionate about making complex algorithms accessible.",
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
            },
            {
              name: "Michael Rodriguez",
              role: "Cybersecurity Lead",
              exp: "10+ Years Experience",
              bio: "Certified Ethical Hacker (CEH) with extensive experience in network security, digital forensics, and cloud defense.",
              img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400"
            },
            {
              name: "Priyanka Sharma",
              role: "Full Stack Specialist",
              exp: "7+ Years Experience",
              bio: "MERN Stack expert focused on high-performance web applications and modern frontend architectures like React and Next.js.",
              img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400"
            },
            {
              name: "David Werner",
              role: "UI/UX Design Master",
              exp: "9+ Years Experience",
              bio: "Crafting intuitive digital experiences. David brings industrial design thinking to the modern web and mobile apps.",
              img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400"
            },
            {
              name: "Anjali Gupta",
              role: "Cloud Ops Engineer",
              exp: "6+ Years Experience",
              bio: "AWS Certified Solution Architect specialized in DevOps, scaling infrastructure, and CI/CD pipeline automation.",
              img: "https://images.unsplash.com/photo-1598550874175-4d0fe4a2c942?auto=format&fit=crop&q=80&w=400"
            }
          ].map((expert, index) => (
            <div key={index} className="trainer-expert-card">
              <div className="expert-image-wrapper">
                <img src={expert.img} alt={expert.name} className="expert-image" />
              </div>
              <h3 className="expert-name">{expert.name}</h3>
              <p className="expert-role">{expert.role}</p>
              <span className="expert-exp">{expert.exp}</span>
              <p className="expert-bio">{expert.bio}</p>
            </div>
          ))}
        </div>

        <div className="trainer-form-card">
          <h2 className="trainer-form-title">Trainer Application Form</h2>
          <p className="trainer-form-sub">Submit your details and link your portfolio. Our onboarding team will contact you for an interview sequence.</p>
          
          <form className="trainer-form">
            <div className="trainer-form-row">
              <input type="text" placeholder="First Name" className="trainer-input" />
              <input type="text" placeholder="Last Name" className="trainer-input" />
            </div>
            <div className="trainer-form-row">
              <input type="email" placeholder="Email Address" className="trainer-input" />
              <input type="tel" placeholder="Phone Number" className="trainer-input" />
            </div>
            <div className="trainer-form-row">
              <select className="trainer-input">
                <option value="">Primary Expertise</option>
                <option>Full Stack Development</option>
                <option>Data Science & AI</option>
                <option>Cloud & DevOps</option>
                <option>Cyber Security</option>
                <option>UI/UX Design</option>
              </select>
              <input type="text" placeholder="Years of Experience" className="trainer-input" />
            </div>
            <input type="url" placeholder="LinkedIn Profile URL" className="trainer-input" />
            <input type="url" placeholder="Portfolio / GitHub URL (Optional)" className="trainer-input" />
            
            <textarea placeholder="Briefly describe your industrial experience and why you want to teach..." rows="5" className="trainer-input textarea"></textarea>
            
            <button className="cta-btn trainer-submit-btn">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeTrainerPage;
