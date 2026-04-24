import React, { useState, useEffect } from 'react';
import { Video, Check, X, Clock, User, Mail, Calendar, UserPlus } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import './CounsellingRequests.css';

const CounsellingRequests = () => {
  const { trainers: contextTrainers } = useAdmin();
  const [bookings, setBookings] = useState([]);
  const [actionMsg, setActionMsg] = useState(null);

  // Fallback mock trainers if none exist in context
  const trainers = contextTrainers.length > 0 ? contextTrainers : [
    { id: 't1', fullName: 'John Doe (Senior Mentor)' },
    { id: 't2', fullName: 'Sarah Smith (Career Coach)' },
    { id: 't3', fullName: 'Mike Johnson (Tech Lead)' }
  ];

  const loadBookings = () => {
    const all = JSON.parse(localStorage.getItem('counselling_bookings') || '[]');
    setBookings(all);
  };

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = (booking) => {
    const all = JSON.parse(localStorage.getItem('counselling_bookings') || '[]');
    const updated = all.map(b => b.id === booking.id ? { ...b, status: 'accepted' } : b);
    localStorage.setItem('counselling_bookings', JSON.stringify(updated));

    const notifications = JSON.parse(localStorage.getItem('counselling_notifications') || '[]');
    const filtered = notifications.filter(n => n.bookingId !== booking.id);
    filtered.push({
      bookingId: booking.id,
      studentId: booking.studentId,
      serviceId: booking.serviceId,
      serviceTitle: booking.serviceTitle,
      slotId: booking.slotId,
      slotLabel: booking.slotLabel,
      meetingLink: 'https://meet.google.com/wxs-wifp-tti',
      status: 'accepted',
      acceptedAt: new Date().toISOString(),
    });
    localStorage.setItem('counselling_notifications', JSON.stringify(filtered));

    loadBookings();
    setActionMsg({ type: 'success', text: `Confirmed: Session for ${booking.studentName} is now active.` });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handleReject = (booking) => {
    const all = JSON.parse(localStorage.getItem('counselling_bookings') || '[]');
    const updated = all.map(b => b.id === booking.id ? { ...b, status: 'rejected' } : b);
    localStorage.setItem('counselling_bookings', JSON.stringify(updated));

    const notifications = JSON.parse(localStorage.getItem('counselling_notifications') || '[]');
    const filtered = notifications.filter(n => n.bookingId !== booking.id);
    filtered.push({ bookingId: booking.id, studentId: booking.studentId, serviceId: booking.serviceId, status: 'rejected' });
    localStorage.setItem('counselling_notifications', JSON.stringify(filtered));

    loadBookings();
    setActionMsg({ type: 'error', text: `Rejected: Request from ${booking.studentName} has been cancelled.` });
    setTimeout(() => setActionMsg(null), 4000);
  };

  const handleAssignTrainer = (bookingId, trainerId) => {
    const all = JSON.parse(localStorage.getItem('counselling_bookings') || '[]');
    const selectedTrainer = trainers.find(t => t.id === trainerId);
    
    const updated = all.map(b => 
      b.id === bookingId ? { ...b, assignedTrainerId: trainerId, assignedTrainerName: selectedTrainer?.fullName || selectedTrainer?.name || 'Trainer' } : b
    );
    localStorage.setItem('counselling_bookings', JSON.stringify(updated));
    loadBookings();
    
    setActionMsg({ type: 'success', text: `Assigned: ${selectedTrainer?.fullName || 'Trainer'} will handle this session.` });
    setTimeout(() => setActionMsg(null), 3000);
  };

  return (
    <div className="cr-page-container">
      <header className="cr-page-header">
        <div className="cr-header-left">
          <h1>Counselling Requests</h1>
          <p>Manage and approve student career guidance slot requests.</p>
        </div>
        <div className="cr-header-stats">
          <div className="cr-stat-box">
            <span className="cr-stat-val">{bookings.filter(b => b.status === 'pending').length}</span>
            <span className="cr-stat-lbl">Pending</span>
          </div>
          <div className="cr-stat-box">
            <span className="cr-stat-val">{bookings.filter(b => b.status === 'accepted').length}</span>
            <span className="cr-stat-lbl">Accepted</span>
          </div>
        </div>
      </header>

      {actionMsg && (
        <div className={`cr-action-toast ${actionMsg.type}`}>
          {actionMsg.type === 'success' ? <Check size={18} /> : <X size={18} />}
          <span>{actionMsg.text}</span>
        </div>
      )}

      <div className="cr-table-card">
        {bookings.length === 0 ? (
          <div className="cr-empty-state">
            <div className="cr-empty-icon"><Calendar size={48} /></div>
            <h3>No Requests Found</h3>
            <p>Any student booking requests will appear here for your review.</p>
            <button 
              className="cr-btn-sample"
              onClick={() => {
                const sample = {
                  id: 'sample-' + Date.now(),
                  studentId: 's123',
                  studentName: 'Demo Student',
                  studentEmail: 'student@example.com',
                  serviceId: 'career-guidance',
                  serviceTitle: 'Career Guidance',
                  slotId: 'slot-1',
                  slotLabel: '10:00 AM - 11:00 AM',
                  status: 'pending',
                  submittedAt: new Date().toISOString()
                };
                const all = [sample];
                localStorage.setItem('counselling_bookings', JSON.stringify(all));
                loadBookings();
              }}
              style={{
                marginTop: '1.5rem',
                padding: '0.8rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
            >
              Generate Sample Request
            </button>
          </div>
        ) : (
          <div className="cr-table-responsive">
            <table className="cr-table">
              <thead>
                <tr>
                  <th>Student Detail</th>
                  <th>Service Requested</th>
                  <th>Preferred Slot</th>
                  <th>Trainer Assigned</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className={`cr-row ${b.status}`}>
                    <td>
                      <div className="cr-student-cell">
                        <div className="cr-avatar-mini">{b.studentName.charAt(0)}</div>
                        <div className="cr-student-info">
                          <span className="cr-name">{b.studentName}</span>
                          <span className="cr-email">{b.studentEmail}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="cr-service-tag">{b.serviceTitle}</span></td>
                    <td>
                      <div className="cr-slot-cell">
                        <Clock size={14} />
                        <span>{b.slotLabel}</span>
                      </div>
                    </td>
                    <td>
                      <div className="cr-trainer-assign-cell">
                        <select 
                          value={b.assignedTrainerId || ""} 
                          onChange={(e) => handleAssignTrainer(b.id, e.target.value)}
                          className="cr-trainer-select"
                        >
                          <option value="" disabled>Assign Trainer</option>
                          {trainers.map(t => (
                            <option key={t.id} value={t.id}>{t.fullName || t.name}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <span className={`cr-status-pill ${b.status}`}>{b.status}</span>
                    </td>
                    <td>
                      {b.status === 'pending' ? (
                        <div className="cr-actions">
                          <button className="cr-btn accept" onClick={() => handleAccept(b)} title="Accept Request">
                            <Check size={16} /> Accept
                          </button>
                          <button className="cr-btn reject" onClick={() => handleReject(b)} title="Reject Request">
                            <X size={16} /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="cr-status-final">
                          {b.status === 'accepted' ? <Check size={16} className="txt-success" /> : <X size={16} className="txt-danger" />}
                          <span>{b.status === 'accepted' ? 'Confirmed' : 'Cancelled'}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounsellingRequests;
