import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './BecomeTrainerPage.css';

import gayathriImg from '../../assets/trainers/gayathri_v2.jpg';
import karthishaImg from '../../assets/trainers/karthisha_v2.jpg';
import abhinayaImg from '../../assets/trainers/abhinaya.jpg';
import nagaharshaImg from '../../assets/trainers/nagaharsha_v2.jpg';
import mohanImg from '../../assets/trainers/mohan.jpg';
import rohanImg from '../../assets/trainers/rohan.jpg';

const BecomeTrainerPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="internal-page">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="internal-back-btn">
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>

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
              name: "Abhinaya",
              role: "MERN Stack Developer",
              exp: "2.5 Years Experience",
              bio: "",
              img: abhinayaImg
            },
            {
              name: "Rohan",
              role: "Java Full Stack Developer",
              exp: "1 Year Experience",
              bio: "",
              img: rohanImg
            },
            {
              name: "Gayathri",
              role: "Python & AI Specialist",
              exp: "2 Years Experience",
              bio: "",
              img: gayathriImg
            },
            {
              name: "Karthisha",
              role: "Frontend Engineer",
              exp: "1 Year Experience",
              bio: "",
              img: karthishaImg
            },
            {
              name: "Mohan",
              role: "Cloud Solutions Associate",
              exp: "1.5 Years Experience",
              bio: "",
              img: mohanImg
            },
            {
              name: "Nagaharsha",
              role: "UI/UX Designer",
              exp: "2 Years Experience",
              bio: "",
              img: nagaharshaImg
            }
          ]
.slice(0, 6).map((expert, index) => (
            <div key={index} className="trainer-expert-card">
              <div className="expert-image-wrapper">
                <img 
                  src={expert.img} 
                  alt={expert.name} 
                  className="expert-image" 
                  style={expert.name === "Rohan" ? { objectPosition: 'center 10%', transform: 'scale(1.5)' } : {}}
                />
              </div>
              <div className="expert-content">
                <h3 className="expert-name">{expert.name}</h3>
                <p className="expert-role">{expert.role}</p>
                <div className="expert-footer">
                  <span className="expert-exp">{expert.exp}</span>
                  <p className="expert-bio">{expert.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="trainer-form-card">
          <h2 className="trainer-form-title">Trainer Application Form</h2>
          <p className="trainer-form-sub">Submit your details and link your portfolio. Our onboarding team will contact you for an interview sequence.</p>
          
          <form className="trainer-form">
            <div className="trainer-form-row">
              <input type="text" placeholder="First Name *" required className="trainer-input" />
              <input type="text" placeholder="Last Name *" required className="trainer-input" />
            </div>
            <div className="trainer-form-row">
              <input type="email" placeholder="Email Address *" required className="trainer-input" />
              <input type="tel" placeholder="Phone Number *" required className="trainer-input" />
            </div>
            <div className="trainer-form-row">
              <select className="trainer-input" required defaultValue="">
                <option value="" disabled>Primary Expertise *</option>
                <option value="Full Stack Development">Full Stack Development</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
              <input type="text" placeholder="Years of Experience *" required className="trainer-input" />
            </div>
            <input type="url" placeholder="LinkedIn Profile URL *" required className="trainer-input" />
            <input type="url" placeholder="Portfolio / GitHub URL (Optional)" className="trainer-input" />
            
            <textarea placeholder="Briefly describe your industrial experience and why you want to teach... *" required rows="5" className="trainer-input textarea"></textarea>
            
            <button className="cta-btn trainer-submit-btn">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeTrainerPage;