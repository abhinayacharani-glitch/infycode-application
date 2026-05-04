import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { applyToBecomeTrainer } from '../../services/api';
import './BecomeTrainerPage.css';

import gayathriImg from '../../assets/trainers/gayathri_v2.jpg';
import karthishaImg from '../../assets/trainers/karthisha_v2.jpg';
import abhinayaImg from '../../assets/trainers/abhinaya.jpg';
import nagaharshaImg from '../../assets/trainers/nagaharsha_v2.jpg';
import mohanImg from '../../assets/trainers/mohan.jpg';
import rohanImg from '../../assets/trainers/rohan.jpg';

const BecomeTrainerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    expertise: '',
    experience: '',
    location: '',
    linkedin: '',
    portfolio: '',
    bio: '',
    resume: null,
    resumeName: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file only.');
        e.target.value = '';
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          resume: reader.result,
          resumeName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      alert('Please upload your resume (PDF).');
      return;
    }

    setLoading(true);
    try {
      await applyToBecomeTrainer(formData);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="internal-page">
        <div className="trainer-success-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <CheckCircle size={80} color="#10b981" style={{ marginBottom: '24px' }} />
          <h1>Application Submitted!</h1>
          <p style={{ maxWidth: '600px', margin: '16px auto', fontSize: '18px', color: '#64748b' }}>
            Thank you for applying. We have sent a confirmation email to <strong>{formData.email}</strong>. 
            Our onboarding team will review your application and contact you for the next steps.
          </p>
          <button onClick={() => navigate('/')} className="cta-btn" style={{ marginTop: '32px' }}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="internal-page">
      {/* Back Button */}
      <button onClick={() => navigate("/")} className="modern-back-btn">
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
              exp: "1.5 Year Experience",
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
          
          <form className="trainer-form" onSubmit={handleSubmit}>
            <div className="trainer-form-row">
              <input 
                type="text" 
                name="firstName"
                placeholder="First Name *" 
                required 
                className="trainer-input" 
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <input 
                type="text" 
                name="lastName"
                placeholder="Last Name *" 
                required 
                className="trainer-input" 
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="trainer-form-row">
              <input 
                type="email" 
                name="email"
                placeholder="Email Address *" 
                required 
                className="trainer-input" 
                value={formData.email}
                onChange={handleInputChange}
              />
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone Number *" 
                required 
                className="trainer-input" 
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="trainer-form-row">
              <select 
                className="trainer-input" 
                required 
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
              >
                <option value="" disabled>Primary Expertise *</option>
                <option value="Java Full Stack">Java Full Stack</option>
                <option value="Python Full Stack">Python Full Stack</option>
                <option value="AWS Cloud Practitioner">AWS Cloud Practitioner</option>
                <option value="Introduction to AI">Introduction to AI</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Machine Learning Deep Dive">Machine Learning Deep Dive</option>
                <option value="Ethical Hacking & Cyber Security">Ethical Hacking & Cyber Security</option>
                <option value="React JS Full Stack Development">React JS Full Stack Development</option>
                <option value="Next.js 14 Masterclass">Next.js 14 Masterclass</option>
                <option value="MERN Stack Development">MERN Stack Development</option>
                <option value="Angular Enterprise Development">Angular Enterprise Development</option>
                <option value="Flutter Mobile Apps">Flutter Mobile Apps</option>
                <option value="Full Stack Python Pro">Full Stack Python Pro</option>
              </select>
              <input 
                type="text" 
                name="experience"
                placeholder="Years of Experience *" 
                required 
                className="trainer-input" 
                value={formData.experience}
                onChange={handleInputChange}
              />
            </div>
            <div className="trainer-form-row">
              <input 
                type="text" 
                name="location"
                placeholder="Current Location *" 
                required 
                className="trainer-input" 
                value={formData.location}
                onChange={handleInputChange}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <input 
                  type="file" 
                  name="resume"
                  accept="application/pdf"
                  required 
                  className="trainer-input" 
                  onChange={handleFileChange}
                  id="resume-upload"
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="resume-upload" 
                  className="trainer-input" 
                  style={{ 
                    cursor: 'pointer', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: '#fff'
                  }}
                >
                  <span style={{ color: formData.resumeName ? '#000' : '#9ca3af' }}>
                    {formData.resumeName || 'Upload Resume (PDF) *'}
                  </span>
                  <span style={{ fontSize: '12px', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#64748b' }}>Browse</span>
                </label>
              </div>
            </div>
            <input 
              type="url" 
              name="linkedin"
              placeholder="LinkedIn Profile URL *" 
              required 
              className="trainer-input" 
              value={formData.linkedin}
              onChange={handleInputChange}
            />
            <input 
              type="url" 
              name="portfolio"
              placeholder="Portfolio / GitHub URL (Optional)" 
              className="trainer-input" 
              value={formData.portfolio}
              onChange={handleInputChange}
            />
            
            <textarea 
              name="bio"
              placeholder="Briefly describe your industrial experience and why you want to teach... *" 
              required 
              rows="5" 
              className="trainer-input textarea"
              value={formData.bio}
              onChange={handleInputChange}
            ></textarea>
            
            <button 
              type="submit" 
              className="cta-btn trainer-submit-btn"
              disabled={loading}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              {loading ? <><Loader2 className="animate-spin" size={20} /> Submitting...</> : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeTrainerPage;