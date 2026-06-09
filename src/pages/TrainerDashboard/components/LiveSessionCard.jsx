import React, { useState, useEffect } from 'react';
import { Clock, Play, XCircle, CheckCircle, ExternalLink } from 'lucide-react';
import './LiveSessionCard.css';

const LiveSessionCard = ({ session, onStatusChange }) => {
  const [currentStatus, setCurrentStatus] = useState(session.status || 'upcoming');
  const [seconds, setSeconds] = useState(0);
  const isLive = currentStatus === 'ongoing' || currentStatus === 'Live' || currentStatus === 'In Progress';

  // Live timer tick
  useEffect(() => {
    let interval = null;
    if (isLive) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Sync status prop changes (e.g. after auto-refresh)
  useEffect(() => {
    setCurrentStatus(session.status || 'upcoming');
  }, [session.status]);

  const formatTimer = (totalSeconds) => {
    const hrs  = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ── Start → open meeting link directly ────────────────────────────────────
  const handleStart = () => {
    if (session.link) {
      window.open(session.link, '_blank', 'noopener,noreferrer');
    } else {
      // No link saved yet — alert the trainer to configure one
      alert('No meeting link found for this session.\nPlease set one in Live Session settings first.');
    }
    setCurrentStatus('ongoing');
    if (onStatusChange) onStatusChange(session.id, 'ongoing');
  };

  // ── Join (while live) → same meeting link ─────────────────────────────────
  const handleJoin = () => {
    if (session.link) {
      window.open(session.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleEnd = () => {
    setCurrentStatus('completed');
    if (onStatusChange) onStatusChange(session.id, 'completed');
  };

  const handleCancel = () => {
    setCurrentStatus('cancelled');
    if (onStatusChange) onStatusChange(session.id, 'cancelled');
  };

  const statusNormalized = currentStatus?.toLowerCase().replace(' ', '-');

  const getBadgeClass = () => {
    switch (statusNormalized) {
      case 'completed':    return 'status-badge completed';
      case 'ongoing':
      case 'live':
      case 'in-progress':  return 'status-badge in-progress';
      case 'cancelled':    return 'status-badge cancelled';
      default:             return 'status-badge upcoming';
    }
  };

  const getBadgeLabel = () => {
    switch (statusNormalized) {
      case 'ongoing':
      case 'live':
      case 'in-progress': return 'Live';
      case 'completed':   return 'Completed';
      case 'cancelled':   return 'Cancelled';
      default:            return 'Upcoming';
    }
  };

  return (
    <div className={`schedule-item-saas ${isLive ? 'active' : ''} ${statusNormalized === 'cancelled' ? 'cancelled' : ''}`}>

      {/* Time column */}
      <div className="session-time">
        <Clock size={16} />
        <span>{session.time}</span>
        {isLive && (
          <span className="live-timer">{formatTimer(seconds)}</span>
        )}
      </div>

      {/* Main info */}
      <div className="session-main">
        <div className="session-info">
          <h4 className="session-course">{session.course || session.topic}</h4>
          <p className="session-sub">
            {session.batch    ? `${session.batch} • ` : ''}
            {session.students ? `${session.students} Students • ` : ''}
            {session.duration ? `${session.duration}m` : ''}
          </p>
          {/* Show meeting link indicator */}
          {session.link && (
            <p className="session-link-hint">
              <ExternalLink size={11} style={{ marginRight: 4 }} />
              {session.link.includes('meet.google.com') ? 'Google Meet' :
               session.link.includes('teams.microsoft.com') ? 'Microsoft Teams' :
               session.link.includes('zoom.us') ? 'Zoom' : 'Meeting Link'} ready
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="session-actions">
          <span className={getBadgeClass()}>{getBadgeLabel()}</span>

          <div className="action-buttons-group">

            {/* Upcoming → Start + Cancel */}
            {(statusNormalized === 'upcoming') && (
              <>
                <button
                  className="action-btn-sm primary"
                  onClick={handleStart}
                  title={session.link ? `Open: ${session.link}` : 'No meeting link configured'}
                >
                  <Play size={12} fill="currentColor" />
                  <span>Start</span>
                </button>
                <button className="action-btn-sm ghost-danger" onClick={handleCancel} title="Cancel session">
                  <XCircle size={12} />
                </button>
              </>
            )}

            {/* Live → Join Now + End */}
            {isLive && (
              <>
                <button className="action-btn-sm pulse" onClick={handleJoin}>
                  Join Now
                </button>
                <button className="action-btn-sm danger" onClick={handleEnd}>
                  End
                </button>
              </>
            )}

            {/* Completed */}
            {statusNormalized === 'completed' && (
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
