import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUser, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import "./BookingPage.css";

const experts = [
  { id: 1, name: "Dr. Aris", role: "Career Architect", specialty: "FAANG Preparation", image: "https://i.pravatar.cc/150?u=aris" },
  { id: 2, name: "Sarah Chen", role: "Lead Developer", specialty: "System Design", image: "https://i.pravatar.cc/150?u=sarah" },
  { id: 3, name: "Marcus Thorne", role: "HR Specialist", specialty: "Behavioral Coaching", image: "https://i.pravatar.cc/150?u=marcus" }
];

export default function BookingPage() {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();

  const handleBooking = (expert) => {
    setSelectedExpert(expert);
    setBooked(true);
  };

  return (
    <div className="booking-container">
      <div className="booking-v4-wrap">
        <header className="booking-header-v4">
          <span className="booking-tag-v4">Step 1: Demo Experience</span>
          <h1>Expert Consultation</h1>
          <p>Book a demo session with our lead architects to find your path.</p>
        </header>

        {!booked ? (
          <div className="experts-grid-v4">
            {experts.map((exp) => (
              <motion.div 
                key={exp.id} 
                className="expert-card-v4"
                whileHover={{ y: -10 }}
              >
                <img src={exp.image} alt={exp.name} className="expert-img-v4" />
                <div className="expert-info-v4">
                  <h3>{exp.name}</h3>
                  <span className="expert-role-v4">{exp.role}</span>
                  <p className="expert-specialty-v4">{exp.specialty}</p>
                </div>
                <div className="expert-slots-v4">
                  <div className="slot-v4 active">Today, 4:00 PM</div>
                  <div className="slot-v4">Tomorrow, 10:00 AM</div>
                </div>
                <button className="btn-book-v4" onClick={() => handleBooking(exp)}>
                  Select Expert
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="booking-success-v4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="success-icon-v4"><FiCheckCircle /></div>
            <h2>Session Confirmed!</h2>
            <p>You have booked a demo session with <strong>{selectedExpert.name}</strong>.</p>
            <div className="booking-details-v4">
              <div className="b-item"><FiCalendar /> Today</div>
              <div className="b-item"><FiClock /> 4:00 PM (Demo)</div>
              <div className="b-item"><FiUser /> Mentorship Link: Ready</div>
            </div>
            <button className="cta-proceed-v4" onClick={() => navigate("/expert-consultation/session")}>
              Enter Live Session Demo <FiArrowRight />
            </button>
          </motion.div>
        )}
      </div>
      
      {/* Back Button */}
      <button className="global-back-btn-v4" onClick={() => navigate(-1)}>
        <FiArrowRight style={{ transform: "rotate(180deg)" }} /> Back
      </button>
    </div>
  );
}
