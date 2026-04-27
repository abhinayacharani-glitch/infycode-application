import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { useAdmin } from '../../../context/AdminContext';
import { getAdminCounsellingRequests, assignCounsellingTrainer } from '../../../services/api';
import './CounsellingRequests.css';

const CounsellingRequests = () => {
  const { trainers: contextTrainers, students } = useAdmin();
  const [bookings, setBookings] = useState([]);
  const [actionMsg, setActionMsg] = useState(null);

  // Fallback mock trainers if none exist in context
  const trainers = contextTrainers.length > 0 ? contextTrainers : [
    { id: 't1', fullName: 'John Doe (Senior Mentor)' },
    { id: 't2', fullName: 'Sarah Smith (Career Coach)' },
    { id: 't3', fullName: 'Mike Johnson (Tech Lead)' }
  ];

  const loadBookings = async () => {
    try {
      const res = await getAdminCounsellingRequests();
      if (res.success) {
        setBookings(res.requests);
      }
    } catch (err) {
      console.error("Failed to fetch counselling requests:", err);
    }
  };

  useEffect(() => {
    loadBookings();
    const interval = setInterval(loadBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate counts for 1-Many slots
  const groupCounts = bookings
    .filter(b => b.serviceId === 1 && b.status === 'pending')
    .reduce((acc, b) => {
      const key = `${b.slotDate}_${b.slotId}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

  const handleAccept = async (booking) => {
    const key = `${booking.slotDate}_${booking.slotId}`;
    if (booking.serviceId === 1 && (groupCounts[key] || 0) < 10) {
      setActionMsg({ type: 'error', text: `Minimum 10 students required for 1-Many session.` });
      setTimeout(() => setActionMsg(null), 4000);
      return;
    }

    try {
      const res = await assignCounsellingTrainer({
        bookingId: booking.id,
        trainerId: booking.assignedTrainerId,
        trainerName: booking.assignedTrainerName,
        status: 'accepted'
      });

      if (res.success) {
        loadBookings();
        setActionMsg({ type: 'success', text: `Confirmed: Session for ${booking.studentName} is now active.` });
        setTimeout(() => setActionMsg(null), 4000);
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message });
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleReject = async (booking) => {
    try {
      const res = await assignCounsellingTrainer({
        bookingId: booking.id,
        status: 'rejected'
      });

      if (res.success) {
        loadBookings();
        setActionMsg({ type: 'error', text: `Rejected: Request from ${booking.studentName} has been cancelled.` });
        setTimeout(() => setActionMsg(null), 4000);
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message });
      setTimeout(() => setActionMsg(null), 4000);
    }
  };

  const handleAssignTrainer = async (bookingId, trainerId) => {
    const selectedTrainer = trainers.find(t => t.id === trainerId);

    try {
      const res = await assignCounsellingTrainer({
        bookingId,
        trainerId,
        trainerName: selectedTrainer?.fullName || selectedTrainer?.name || 'Trainer',
        status: 'pending' // Just assigning, not accepting yet
      });

      if (res.success) {
        loadBookings();
        setActionMsg({ type: 'success', text: `Assigned: ${selectedTrainer?.fullName || 'Trainer'} will handle this session.` });
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch (err) {
      setActionMsg({ type: 'error', text: err.message });
      setTimeout(() => setActionMsg(null), 4000);
    }
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
            <h3>No Active Requests</h3>
            <p>All student counselling requests have been processed or none have been submitted yet.</p>
          </div>
        ) : (
          <div className="cr-table-responsive">
            <table className="cr-table">
              <thead>
                <tr>
                  <th>Student Detail</th>
                  <th>Service Requested</th>
                  <th>Slot Date</th>
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
                    <td>
                      <div className="cr-service-cell">
                        <span className="cr-service-tag">{b.serviceTitle}</span>
                        {b.serviceId === 1 && (
                          <div className={`cr-batch-count ${groupCounts[`${b.slotDate}_${b.slotId}`] >= 10 ? 'ready' : 'waiting'}`}>
                            {groupCounts[`${b.slotDate}_${b.slotId}`] || 0}/10 students
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="cr-date-cell">
                        <Calendar size={14} />
                        <span>{b.slotDate}</span>
                      </div>
                    </td>
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
