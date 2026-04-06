import React, { useEffect } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="internal-page">
      <div className="internal-hero contact-hero">
        <div className="internal-hero-content">
          <h1>Get in Touch</h1>
          <p>Have questions about a course, enterprise training, or partnership? Our team is here to help.</p>
        </div>
      </div>

      <div className="internal-section">
        <div className="training-split contact-split">
          <div className="training-text contact-form-card">
            <h2 className="contact-form-title">Send us a Message</h2>
            <form className="contact-form">
              <div className="contact-form-row">
                <input type="text" placeholder="First Name" className="contact-input" />
                <input type="text" placeholder="Last Name" className="contact-input" />
              </div>
              <input type="email" placeholder="Email Address" className="contact-input" />
              <select className="contact-input">
                <option>Interested in Course Enrollment</option>
                <option>Corporate Training Inquiry</option>
                <option>General Support</option>
              </select>
              <textarea placeholder="Your Message..." rows="5" className="contact-input textarea"></textarea>
              <button className="cta-btn contact-submit-btn">Submit Request</button>
            </form>
          </div>
          <div className="training-text contact-info-card">
            <h2>Global Headquarters</h2>
            <p className="contact-hq-title"><b>INFYCODE Tech </b></p>
            <p>Manjeera Majestic Commercial, JNTU-ROAD, JNTU Hyderabad</p>

            <h3 className="contact-details-title">Contact Details</h3>
            <p className="contact-detail-row"><b>Email:</b> support@infycode.com</p>
            <p className="contact-detail-row"><b>Phone:</b> +1 (800) 123-4567</p>
            <p className="contact-detail-row"><b>Hours:</b> Mon-Fri, 9:00 AM - 6:00 PM PST</p>
            
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
              alt="Office" 
              className="contact-office-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
