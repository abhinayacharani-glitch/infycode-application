import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import './QuerySolution.css';

const QuerySolution = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    // Fetch query from student_queries or solved_queries
    const queries = JSON.parse(localStorage.getItem('student_queries') || '[]');
    const solved = JSON.parse(localStorage.getItem('solved_queries') || '[]');
    
    let found = queries.find(q => q.id === ticketId);
    if (!found) {
        // Fallback for demo if not in local storage (though it should be)
        found = solved.find(s => s.id === ticketId);
    }

    if (found) {
        // In a real app, we'd fetch the actual trainer response from backend
        // For now, we mock the trainer response if it's "solved"
        if (found.status === 'solved' && !found.trainerResponse) {
            found.trainerResponse = "This is an automated professional response from your trainer to help you resolve the issue efficiently.";
            found.solutionCode = found.code ? `// Resolved Version\n${found.code}\n\n// Trainer Optimization:\nfunction optimized() {\n  return "Done";\n}` : null;
        }
        setTicket(found);
    }
  }, [ticketId]);

  if (!ticket) {
    return (
      <div className="solution-error-viewport">
        <div className="error-card">
          <h2>Query Not Found</h2>
          <p>We couldn't locate the details for this query.</p>
          <button onClick={() => navigate('/student-dashboard/trainer-connect')}>Go Back</button>
        </div>
      </div>
    );
  }

  const renderSolutionContent = () => {
    switch (ticket.solutionType) {
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
                <p>{ticket.trainerResponse || "Hello! I've reviewed your query. Here is the suggested approach to resolve your problem..."}</p>
                <div className="trainer-pills">
                  <span className="pill">Approach Verified</span>
                  <span className="pill">Best Practice Applied</span>
                </div>
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
                  value={ticket.solutionCode || `// Trainer Solution\nconsole.log("Verified Code");`}
                  options={{ readOnly: true, minimap: { enabled: false } }}
                />
              </div>
            </div>
            <div className="trainer-explanation-card">
               <h5>Implementation Notes</h5>
               <p>{ticket.trainerResponse || "I have optimized the loops and added proper error handling to your logic."}</p>
            </div>
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
              <h3>Meeting Completed</h3>
              <p>This 1:1 session has been concluded and the query was marked as resolved.</p>
            </div>
            <div className="meet-notes-section">
              <div className="notes-header">
                <FileText size={18} />
                <span>Session Summary</span>
              </div>
              <div className="notes-body">
                <p><strong>Topics Discussed:</strong> {ticket.description}</p>
                <p><strong>Outcome:</strong> Query Resolved via screen-share. Student understands the implementation of the requested feature.</p>
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
           <button className="circular-back-btn" onClick={() => navigate(-1)}>
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
                    <span className="m-val capitalize">{ticket.solutionType}</span>
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
