import React, { useState, useEffect } from 'react';
import { Video, Clock, User, Calendar, ExternalLink, Bell, CheckCircle } from 'lucide-react';
import { useTrainer } from '../../../context/TrainerContext';
import './TrainerCounselling.css';

const TrainerCounselling = () => {
  const { trainerData } = useTrainer();
  const [sessions, setSessions] = useState([]);
  const currentTrainerId = trainerData.id || trainerData.email;

  const loadSessions = () => {
    const allBookings = JSON.parse(localStorage.getItem('counselling_bookings') || '[]');
    // Filter sessions assigned to THIS trainer
    const mySessions = allBookings.filter(b => b.assignedTrainerId === currentTrainerId);
    setSessions(mySessions);
  };

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 3000);
    return () => clearInterval(interval);
  }, [currentTrainerId]);

  return (
    <div className="tc-container">
      <header className="tc-header">
        <div className="tc-header-content">
          <h1>Counselling Sessions</h1>
          <p>View and join your assigned career guidance sessions with students.</p>
        </div>
        <div className="tc-badge-wrap">
          <span className="tc-count-badge">{sessions.length} Assigned</span>
        </div>
      </header>

      <div className="tc-grid">
        {sessions.length === 0 ? (
          <div className="tc-empty-card">
            <div className="tc-empty-icon"><Bell size={48} /></div>
            <h3>No Sessions Assigned</h3>
            <p>You haven't been assigned to any counselling sessions yet. Check back later!</p>
          </div>
        ) : (
          sessions.map(session => (
            <div key={session.id} className="tc-session-card">
              <div className="tc-card-status">
                <span className={`tc-status-tag ${session.status}`}>{session.status}</span>
              </div>

              <div className="tc-card-body">
                <div className="tc-student-profile">
                  <div className="tc-avatar">{session.studentName.charAt(0)}</div>
                  <div className="tc-student-details">
                    <h3>{session.studentName}</h3>
                    <span>{session.studentEmail}</span>
                  </div>
                </div>

                <div className="tc-info-row">
                  <Video size={18} />
                  <div className="tc-info-text">
                    <strong>Service:</strong>
                    <span>{session.serviceTitle}</span>
                  </div>
                </div>

                <div className="tc-info-row">
                  <Clock size={18} />
                  <div className="tc-info-text">
                    <strong>Time Slot:</strong>
                    <span className="tc-time-highlight">{session.slotLabel}</span>
                  </div>
                </div>

                <div className="tc-info-row">
                  <Calendar size={18} />
                  <div className="tc-info-text">
                    <strong>Booking Date:</strong>
                    <span>{new Date(session.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="tc-card-footer">
                <a
                  href="https://meet.google.com/wxs-wifp-tti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tc-join-btn"
                >
                  <ExternalLink size={18} />
                  Join Meeting
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrainerCounselling;
