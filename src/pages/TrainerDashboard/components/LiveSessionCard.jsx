import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Play, Circle, XCircle, CheckCircle } from 'lucide-react';
import './LiveSessionCard.css';

const LiveSessionCard = ({ session, onStatusChange }) => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState(session.status || 'Upcoming');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(currentStatus === 'Live' || currentStatus === 'In Progress');

  useEffect(() => {
    let interval = null;
    if (isActive && currentStatus === 'Live') {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, currentStatus]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setCurrentStatus('Live');
    setIsActive(true);
    if (onStatusChange) onStatusChange(session.id, 'Live');
    // Navigate to global session manager
    navigate('/trainer-dashboard/live-session');
  };

  const handleEnd = () => {
    setCurrentStatus('Completed');
    setIsActive(false);
    if (onStatusChange) onStatusChange(session.id, 'Completed');
  };

  const handleCancel = () => {
    setCurrentStatus('Cancelled');
    setIsActive(false);
    if (onStatusChange) onStatusChange(session.id, 'Cancelled');
  };

  const getStatusBadgeClass = () => {
    switch (currentStatus.toLowerCase().replace(' ', '-')) {
      case 'completed': return 'status-badge completed';
      case 'live':
      case 'in-progress': return 'status-badge in-progress';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge upcoming';
    }
  };

  return (
    <div className={`schedule-item-saas ${isActive ? 'active' : ''} ${currentStatus === 'Cancelled' ? 'cancelled' : ''}`}>
      <div className="session-time">
        <Clock size={16} />
        <span>{session.time}</span>
        {isActive && currentStatus === 'Live' && (
          <span className="live-timer">{formatTime(seconds)}</span>
        )}
      </div>
      
      <div className="session-main">
        <div className="session-info">
          <h4 className="session-course">{session.course || session.topic}</h4>
          <p className="session-sub">
            {session.batch ? `${session.batch} • ` : ''}
            {session.students ? `${session.students} Students • ` : ''}
            {session.duration}
          </p>
        </div>
        
        <div className="session-actions">
          <span className={getStatusBadgeClass()}>
            {currentStatus === 'In Progress' ? 'Live' : currentStatus}
          </span>
          
          <div className="action-buttons-group">
            {currentStatus === 'Upcoming' && (
              <>
                <button className="action-btn-sm primary" onClick={handleStart}>
                  <Play size={12} fill="currentColor" />
                  <span>Start</span>
                </button>
                <button className="action-btn-sm ghost-danger" onClick={handleCancel}>
                  <XCircle size={12} />
                </button>
              </>
            )}
            
            {(currentStatus === 'Live' || currentStatus === 'In Progress') && (
              <>
                <button className="action-btn-sm pulse" onClick={() => window.open(session.link, '_blank')}>
                  Join
                </button>
                <button className="action-btn-sm danger" onClick={handleEnd}>
                  End
                </button>
              </>
            )}
            
            {currentStatus === 'Completed' && (
              <div className="completed-check">
                <CheckCircle size={18} color="#10b981" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionCard;
