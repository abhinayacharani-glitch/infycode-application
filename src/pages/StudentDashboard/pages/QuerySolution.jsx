import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStudentQueriesAPI, markQueryReadByStudentAPI } from '../../../services/api';
import {
  ArrowLeft,
  MessageSquare,
  Code,
  Video,
  CheckCircle,
  Clock,
  User,
  Download,
  Terminal,
  FileText
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useStudent } from '../../../context/StudentContext';
import './QuerySolution.css';

const QuerySolution = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { fetchStudentQueries } = useStudent();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueryDetails = async () => {
      try {
        const res = await getStudentQueriesAPI();
        if (res.success) {
          const found = res.queries.find(q => q.id === ticketId);
          if (found) {
            setTicket(found);
            // Mark query read by student if unread
            if (found.readByStudent === false) {
              await markQueryReadByStudentAPI(ticketId);
              fetchStudentQueries(); // update navbar and sidebar state
            }
          }
        }
      } catch (err) {
        console.error("Failed to load query details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueryDetails();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="solution-viewport animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p style={{ color: '#64748b' }}>Loading solution details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="solution-error-viewport" style={{ padding: '40px' }}>
        <button className="circular-back-btn" onClick={() => navigate('/student-dashboard/trainer-connect')} style={{ marginBottom: '20px' }}>
          <ArrowLeft size={20} />
        </button>
        <div className="error-card" style={{ textAlign: 'center', background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2>Query Not Found</h2>
          <p>We couldn't locate the details for this query. It might have been deleted.</p>
          <button className="gradient-submit-btn" style={{ marginTop: '20px' }} onClick={() => navigate('/student-dashboard/trainer-connect')}>Go Back</button>
        </div>
      </div>
    );
  }

  const renderSolutionContent = () => {
    switch (ticket.type) {
      case 'chat':
        return (
          <div className="solution-conversation">
            <div className="msg student-msg">
              <div className="msg-header">
                <span className="msg-author">You</span>
                <span className="msg-time">{new Date(ticket.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="msg-body">{ticket.description}</div>
            </div>
            <div className="msg trainer-msg">
              <div className="msg-header">
                <span className="msg-author">{ticket.trainerName} (Trainer)</span>
                <span className="msg-time">Just Now</span>
              </div>
              <div className="msg-body">
                <p>{ticket.solution || "The trainer has provided a solution to your query."}</p>
                {ticket.meetLink && (
                  <div style={{ marginTop: '12px', padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                    <p style={{ margin: 0, color: '#1e40af', fontWeight: '500' }}>Meeting Link Provided:</p>
                    <a href={ticket.meetLink} target="_blank" rel="noreferrer" style={{ color: '#2563eb', wordBreak: 'break-all' }}>{ticket.meetLink}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'editor':
        return (
          <div className="solution-editor-flow">
            <div className="workspace-section">
              <h4 className="ws-title"><Terminal size={18} /> Your Original Code</h4>
              <div className="read-only-monaco">
                <Editor
                  height="200px"
                  language={ticket.language || 'javascript'}
                  theme="vs-dark"
                  value={ticket.code}
                  options={{ readOnly: true, minimap: { enabled: false } }}
                />
              </div>
            </div>
            <div className="workspace-section mt-24">
              <h4 className="ws-title trainer-ws-title"><CheckCircle size={18} /> Trainer's Solution</h4>
              <div className="read-only-monaco solution-monaco">
                <Editor
                  height="260px"
                  language={ticket.language || 'javascript'}
                  theme="vs-dark"
                  value={ticket.solutionCode || ticket.solution || `// Trainer Solution`}
                  options={{ readOnly: true, minimap: { enabled: false } }}
                />
              </div>
            </div>
            {(ticket.solution || ticket.trainerResponse) && (
              <div className="trainer-explanation-card">
                <h5>Implementation Notes</h5>
                <p>{ticket.solution || ticket.trainerResponse}</p>
              </div>
            )}
          </div>
        );
      case 'meet':
        return (
          <div className="solution-meet-summary">
            <div className="meet-status-hero">
              <div className="hero-icon-circle">
                <Video size={48} />
                <CheckCircle size={24} className="status-overlay" />
              </div>
              <h3>Request Processed</h3>
              <p>Your trainer has reviewed your meeting request and provided a response.</p>
            </div>
            <div className="meet-notes-section">
              <div className="notes-header">
                <FileText size={18} />
                <span>Trainer's Response</span>
              </div>
              <div className="notes-body">
                <p><strong>Response:</strong> {ticket.solution}</p>
                {ticket.meetLink && (
                  <p style={{ marginTop: '10px' }}><strong>Meet Link:</strong> <a href={ticket.meetLink} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{ticket.meetLink}</a></p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="solution-viewport animate-fade-in">
      <div className="solution-header">
        <div className="header-left">
          <button className="circular-back-btn" onClick={() => navigate('/student-dashboard/trainer-connect')}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-info">
            <h1>Query Resolution</h1>
            <p>ID: {ticket.id} • Resolved by {ticket.trainerName}</p>
          </div>
        </div>
        <div className="header-right">
          <span className="status-pill-solved">
            <CheckCircle size={16} />
            <span>Resolved</span>
          </span>
        </div>
      </div>

      <div className="solution-main-grid">
        <div className="solution-left-col">
          <div className="solution-premium-card">
            {renderSolutionContent()}
          </div>
        </div>

        <div className="solution-right-col">
          <div className="ticket-meta-card">
            <h4>Query Details</h4>
            <div className="meta-list">
              <div className="meta-item">
                <span className="m-label">Mode</span>
                <span className="m-val capitalize">{ticket.type}</span>
              </div>
              <div className="meta-item">
                <span className="m-label">Language</span>
                <span className="m-val">{ticket.language || 'N/A'}</span>
              </div>
              <div className="meta-item">
                <span className="m-label">Submitted</span>
                <span className="m-val">{new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="meta-divider"></div>
            <div className="trainer-mini-profile">
              <div className="mini-avatar">{ticket.trainerName[0]}</div>
              <div className="mini-info">
                <p className="mini-name">{ticket.trainerName}</p>
                <p className="mini-role">Expert Trainer</p>
              </div>
            </div>
          </div>

          <button className="download-receipt-btn">
            <Download size={18} />
            <span>Download Resolution PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuerySolution;
