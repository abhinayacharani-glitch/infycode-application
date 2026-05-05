import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Code,
  Video,
  ExternalLink,
  Send,
  MessageCircle,
  Clock,
  Calendar,
  CheckCircle,
  Eye
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import './MentorConnection.css';

const MentorConnection = () => {
  const [selected, setSelected] = useState(null); // Selected Trainer Index
  const [solutionType, setSolutionType] = useState('chat'); // 'chat', 'editor', 'meet'

  // Form States
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const fileInputRef = React.useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [querySuccess, setQuerySuccess] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null);
  const [myQueries, setMyQueries] = useState([]);
  const [attachedFile, setAttachedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
      alert(`File attached: ${file.name}`);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const mentors = [
    { id: 't1', n: 'Abhinaya', role: 'Senior Java Architect', spec: ['Java', 'Spring Boot', 'Microservices'], color: '#2563eb' },
    { id: 't2', n: 'Charani', role: 'Lead Python Developer', spec: ['Python', 'Django', 'AI'], color: '#10b981' },
    { id: 't3', n: 'Suresh Kumar', role: 'Cloud Solutions Architect', spec: ['AWS', 'Terraform', 'Kubernetes'], color: '#f59e0b' }
  ];

  // Course-based languages
  const languageOptions = {
    't1': ['Java', 'Spring Boot', 'SQL'],
    't2': ['Python', 'Django', 'Flask'],
    't3': ['AWS', 'Terraform', 'Kubernetes', 'Docker']
  };

  useEffect(() => {
    const raised = JSON.parse(localStorage.getItem('student_queries') || '[]');
    const solved = JSON.parse(localStorage.getItem('solved_queries') || '[]');
    const merged = raised.map(q => {
      const isSolved = solved.find(s => s.id === q.id);
      return isSolved ? { ...q, status: 'solved', response: isSolved.response } : q;
    });
    setMyQueries(merged);
  }, [querySuccess]);

  const handleSubmitQuery = (e) => {
    if (e) e.preventDefault();

    // Validation
    if (solutionType === 'chat' && !description.trim()) return;
    if (solutionType === 'editor' && !code.trim()) return;
    if (solutionType === 'meet' && !description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      let updatedQuery;
      const existing = JSON.parse(localStorage.getItem('student_queries') || '[]');

      if (isEditing && activeTicket) {
        // Update existing query
        updatedQuery = {
          ...activeTicket,
          description,
          code: solutionType === 'editor' ? code : null,
          language: solutionType === 'editor' ? language : null,
          attachedFileName: attachedFile ? attachedFile.name : activeTicket.attachedFileName,
          updatedAt: new Date().toISOString()
        };
        const newList = existing.map(q => q.id === activeTicket.id ? updatedQuery : q);
        localStorage.setItem('student_queries', JSON.stringify(newList));
      } else {
        // Create new query
        const qId = `QRY-${Math.floor(1000 + Math.random() * 9000)}`;
        updatedQuery = {
          id: qId,
          studentId: 's1',
          trainerId: mentors[selected].id,
          trainerName: mentors[selected].n,
          title: solutionType === 'meet' ? 'Meeting Request' : (description.substring(0, 40) || 'Code Review'),
          description,
          code: solutionType === 'editor' ? code : null,
          language: solutionType === 'editor' ? language : null,
          solutionType,
          status: 'pending',
          attachedFileName: attachedFile?.name || null,
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('student_queries', JSON.stringify([...existing, updatedQuery]));
      }

      setIsSubmitting(false);
      setQuerySuccess(true);
      setActiveTicket(updatedQuery);
      setAttachedFile(null);
      setIsEditing(false);

      // Show Success Toast
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);

    }, 1200);
  };

  const handleEditQuery = () => {
    if (!activeTicket) return;
    setIsEditing(true);
    setDescription(activeTicket.description || '');
    setCode(activeTicket.code || '');
    setLanguage(activeTicket.language || 'javascript');
    setSolutionType(activeTicket.solutionType);
  };

  if (selected === null) {
    return (
      <div className="mentor-viewport animate-fade-in">
        <div className="mentor-top-header directory-header">
          <div className="header-text-content">
            <h1 className="mentor-top-title">Trainer Directory</h1>
            <p className="mentor-top-subtitle">Browse profiles and connect with experts.</p>
          </div>
        </div>
        <div className="mentor-directory-grid">
          {mentors.map((m, i) => (
            <div className="dir-card-premium" key={i}>
              <div className="dir-card-banner" style={{ background: `linear-gradient(135deg, ${m.color}e6, ${m.color})` }}></div>
              <div className="dir-avatar-wrapper">
                <div className="dir-avatar-circle" style={{ color: m.color }}>{m.n[0]}</div>
              </div>
              <div className="dir-card-body">
                <div className="dir-title-section">
                  <h2 className="dir-name">{m.n}</h2>
                  <p className="dir-role">{m.role}</p>
                </div>
                <div className="dir-footer-section">
                  <button className="dir-connect-action-btn" onClick={() => setSelected(i)}>
                    <MessageCircle size={18} />
                    <span>Raise Query</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-viewport animate-fade-in">
      {/* Success Toast */}
      {toastVisible && (
        <div className="submission-toast">
          <CheckCircle size={20} />
          <span>Your query has been submitted successfully</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      <div className="mentor-top-header clean-header">
        <button className="circular-back-btn" onClick={() => setSelected(null)}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="mentor-chat-layout">
        <div className="mentor-card-panel query-submission-panel">
          <div className="mode-selection-row">
            <button
              className={`mode-card ${solutionType === 'chat' ? 'active' : ''}`}
              onClick={() => { setSolutionType('chat'); setDescription(''); }}
            >
              <MessageSquare size={20} />
              <span>Quick Chat</span>
            </button>
            <button
              className={`mode-card ${solutionType === 'editor' ? 'active' : ''}`}
              onClick={() => { setSolutionType('editor'); setDescription(''); }}
            >
              <Code size={20} />
              <span>Code Editor</span>
            </button>
            <button
              className={`mode-card ${solutionType === 'meet' ? 'active' : ''}`}
              onClick={() => { setSolutionType('meet'); setDescription(''); }}
            >
              <Video size={20} />
              <span>Google Meet</span>
            </button>
          </div>

          <div className="dynamic-form-area">
            {solutionType === 'chat' && (
              <div className="chat-inline-interface animate-fade-in">
                <div className="inline-input-group">
                  <textarea
                    className="minimal-chat-input"
                    placeholder={`Describe your problem to ${mentors[selected].n}...`}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <div className="inline-actions">
                    <div className="upload-section">
                      <button className="dashed-upload-btn" onClick={triggerFileUpload}>
                        <ExternalLink size={16} />
                        <span>{attachedFile ? attachedFile.name : 'Upload PDF / Code'}</span>
                      </button>
                    </div>
                    <button
                      className="gradient-submit-btn"
                      onClick={handleSubmitQuery}
                      disabled={!description.trim() || isSubmitting}
                    >
                      {isSubmitting ? <span className="q-loader"></span> : <span>{isEditing ? 'Update Query' : 'Submit Query'}</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {solutionType === 'editor' && (
              <div className="editor-interface-upgraded animate-fade-in">
                <div className="editor-header-actions">
                  <span className="editor-label">Code Workspace</span>
                  <select className="premium-select" value={language} onChange={e => setLanguage(e.target.value)}>
                    {languageOptions[mentors[selected].id].map(l => (
                      <option key={l} value={l.toLowerCase()}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="monaco-wrapper-premium">
                  <Editor
                    height="320px"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={setCode}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      roundedSelection: true,
                      scrollBeyondLastLine: false,
                    }}
                  />
                </div>

                <div className="editor-details">
                  <textarea
                    className="description-box"
                    placeholder="Provide context or specific errors you're facing..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <div className="editor-footer-upgraded">
                    <button className="dashed-upload-btn" onClick={triggerFileUpload}>
                      <ExternalLink size={16} />
                      <span>{attachedFile ? attachedFile.name : 'Upload Material / ScreenShot'}</span>
                    </button>
                    <button
                      className="gradient-submit-btn"
                      onClick={handleSubmitQuery}
                      disabled={isSubmitting || !code.trim()}
                    >
                      {isSubmitting ? <span className="q-loader"></span> : <span>{isEditing ? 'Update Review' : 'Submit Review'}</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {solutionType === 'meet' && (
              <div className="meet-interface-upgraded animate-fade-in">
                <div className="meet-card-body">
                  <h4 className="meet-title">Request 1:1 Technical Session</h4>
                  <textarea
                    className="meet-textarea-premium"
                    placeholder="What topics would you like to discuss in this meeting?"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <div className="meet-footer-actions">
                    <button className="dashed-upload-btn" onClick={triggerFileUpload}>
                      <ExternalLink size={16} />
                      <span>{attachedFile ? attachedFile.name : 'Upload Agenda / Materials'}</span>
                    </button>
                    <button
                      className="gradient-submit-btn"
                      onClick={handleSubmitQuery}
                      disabled={!description.trim() || isSubmitting}
                    >
                      {isSubmitting ? <span className="q-loader"></span> : <span>{isEditing ? 'Update Meeting' : 'Schedule Meeting'}</span>}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mentor-side-col">
          <div className="mentor-card-panel premium-status-card">
            <div className="premium-card-header">
              <div className="trainer-avatar-container">
                <div className="trainer-avatar-circle-premium" style={{ background: `linear-gradient(135deg, ${mentors[selected].color}, #3b82f6)` }}>
                  {mentors[selected].n[0]}
                </div>
                <div className="online-status-dot"></div>
              </div>
              <h3 className="trainer-name-main">{mentors[selected].n}</h3>
              <p className="trainer-role-sub">{mentors[selected].role}</p>
            </div>

            <div className="premium-info-list">
              <div className="info-row-premium">
                <span className="info-label-premium">Trainer Name</span>
                <span className="info-val-premium">{mentors[selected].n}</span>
              </div>
              <div className="info-row-premium">
                <span className="info-label-premium">Query Mode</span>
                <span className="info-val-premium capitalize">{solutionType}</span>
              </div>
              <div className="info-row-premium">
                <span className="info-label-premium">Query Status</span>
                <span className={`status-badge-premium ${activeTicket?.status || 'none'}`}>
                  {activeTicket?.status === 'pending' ? 'Pending' : (activeTicket?.status === 'solved' ? 'Solved' : 'No Active Query')}
                </span>
              </div>
            </div>

            {activeTicket?.status === 'solved' && (
              <button className="view-solution-premium-btn" onClick={() => navigate(`/student-dashboard/my-queries/${activeTicket.id}/solution`)}>
                <Eye size={18} />
                <span>View Solution</span>
              </button>
            )}

            {activeTicket && activeTicket.status === 'pending' && (
              <div className="action-buttons-group">
                <button className="edit-query-btn" onClick={handleEditQuery}>
                  <MessageSquare size={18} />
                  <span>Edit Query</span>
                </button>
                <button className="navigate-queries-btn" onClick={() => navigate('/student-dashboard/my-queries')}>
                  <ExternalLink size={18} />
                  <span>Go to My Queries</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorConnection;
