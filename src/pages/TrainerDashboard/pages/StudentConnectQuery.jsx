import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, MessageCircle, Code, Send,
  Video, Phone, MessageSquare, Download, CheckCircle, Clock, Terminal
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { getQueryByIdAPI, solveTrainerQueryAPI, markQueryReadByTrainerAPI } from '../../../services/api';
import { formatDistanceToNow } from 'date-fns';
import './StudentConnectQuery.css';

const StudentConnectQuery = () => {
  const { batchId, studentId } = useParams();
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null); // 'editor', 'chat', 'meet'
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// Your solution here...');
  const [status, setStatus] = useState('Pending');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [output, setOutput] = useState('');
  const [course, setCourse] = useState('Full Stack Development');
  const [meetLink, setMeetLink] = useState('');

  const [loading, setLoading] = useState(true);
  const [queryData, setQueryData] = useState(null);

  useEffect(() => {
    const fetchQuery = async () => {
      try {
        setLoading(true);
        const res = await getQueryByIdAPI(studentId); // studentId is actually queryId from the route
        if (res.success) {
          setQueryData(res.query);
          setStatus(res.query.status);
          setCode(res.query.code || '// No code provided...');
          // Mark as read
          markQueryReadByTrainerAPI(studentId);
        }
      } catch (err) {
        console.error("Failed to fetch query details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuery();
  }, [studentId]);


  const validateCode = () => {
    if (language === 'python') {
      if (code.includes('public class') || code.includes('System.out.print') || code.includes(';')) {
        return "Invalid syntax for selected language (Python). Please use correct syntax.";
      }
    }
    if (language === 'java') {
      if (code.includes('def ') || code.includes('print(') && !code.includes('System.out.print')) {
        return "Invalid syntax for selected language (Java). Please use correct syntax.";
      }
    }
    return null;
  };

  const handleRunCode = () => {
    const error = validateCode();
    if (error) {
      setOutput(`Error: ${error}`);
      return;
    }
    setOutput('Running code...');

    setTimeout(() => {
      // Simulate dynamic output by extracting console.log or print statements
      let dynamicResult = "";
      try {
        if (language === 'javascript' || language === 'typescript' || language === 'html') {
          const logMatches = code.match(/console\.log\((['"`])(.*?)\1\)/g);
          if (logMatches) {
            dynamicResult = logMatches.map(m => {
              const inner = m.match(/console\.log\((['"`])(.*?)\1\)/);
              return inner ? inner[2] : "";
            }).join('\n');
          }
        } else if (language === 'python') {
          const printMatches = code.match(/print\((['"`])(.*?)\1\)/g);
          if (printMatches) {
            dynamicResult = printMatches.map(m => {
              const inner = m.match(/print\((['"`])(.*?)\1\)/);
              return inner ? inner[2] : "";
            }).join('\n');
          }
        } else if (language === 'java') {
          const javaMatches = code.match(/System\.out\.println\((['"])(.*?)\1\)/g);
          if (javaMatches) {
            dynamicResult = javaMatches.map(m => {
              const inner = m.match(/System\.out\.println\((['"])(.*?)\1\)/);
              return inner ? inner[2] : "";
            }).join('\n');
          }
        } else if (language === 'sql') {
          const sqlMatches = code.match(/SELECT\s+(['"])(.*?)\1/gi);
          if (sqlMatches) {
            dynamicResult = sqlMatches.map(m => {
              const inner = m.match(/SELECT\s+(['"])(.*?)\1/i);
              return inner ? inner[2] : "";
            }).join('\n');
          }
        }
      } catch (e) { console.error(e); }

      const outputMsg = dynamicResult
        ? `> Output:\n${dynamicResult}`
        : `> Code executed successfully.\n> No console output to display.`;

      setOutput(`✔ Success! Result displayed below\n> Executing ${language} code...\n${outputMsg}`);
    }, 800);
  };

  const handleGenerateMeet = () => {
    const link = `https://meet.google.com/abc-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
    setMeetLink(link);
  };

  const handleSendSolution = async () => {
    if (!response.trim()) return;
    setIsSaving(true);
    try {
      const solutionData = {
        solution: response,
        codeSolution: selectedMode === 'editor' ? code : "",
        meetLink: selectedMode === 'meet' ? meetLink : ""
      };

      const res = await solveTrainerQueryAPI(studentId, solutionData);
      if (res.success) {
        setStatus('Solved');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate(`/trainer-dashboard/student-connect/${batchId}`);
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to submit solution", err);
    } finally {
      setIsSaving(false);
    }
  };


  const handleDownload = (filename) => {
    // Simulate download
    const toast = document.createElement('div');
    toast.className = 'scq-toast';
    toast.innerText = `Downloading ${filename}...`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  if (loading || !queryData) return <div className="scq-loading">Loading query details...</div>;

  return (
    <div className="scq-container animate-fade-in">
      <div className="scq-header">
        <button className="scq-back-btn" onClick={() => navigate(`/trainer-dashboard/student-connect/${batchId}`)}>
          <ArrowLeft size={20} />
          <span>Back to Students</span>
        </button>
        <div className="scq-status-wrap">
          <span className={`scq-status-pill ${status.toLowerCase()}`}>
            {status === 'Solved' ? <CheckCircle size={16} /> : <Clock size={16} />}
            {status === 'Solved' ? 'Resolved' : 'Pending Resolution'}
          </span>
        </div>
      </div>

      <div className="scq-layout">
        <div className="scq-side-panel">
          <div className="scq-panel-card student-info">
            <div className="scq-student-header">
              <div className="scq-avatar-large">{queryData.studentName?.charAt(0) || 'S'}</div>
              <div>
                <h3>{queryData.studentName}</h3>
                <p>Batch {queryData.batchId}</p>
              </div>
            </div>
            <div className="scq-query-content">
              <h4 className="scq-query-title">{queryData.title}</h4>
              <p className="scq-query-desc">{queryData.text}</p>
              {queryData.attachment && (
                <button className="download-btn" onClick={() => handleDownload(queryData.attachment)}>
                  <Download size={16} />
                  <span>{queryData.attachment}</span>
                </button>
              )}
              <span className="scq-timestamp">
                {queryData.createdAt ? formatDistanceToNow(new Date(queryData.createdAt), { addSuffix: true }) : 'Recently'}
              </span>
            </div>
          </div>


          <div className="scq-panel-card comms-panel">
            <h4>Select Resolution Mode</h4>
            <div className="scq-comms-grid">
              <button
                className={`mode-btn ${selectedMode === 'editor' ? 'active' : selectedMode ? 'disabled' : ''}`}
                onClick={() => setSelectedMode('editor')}
              >
                <Code size={20} />
                <span>Code Editor</span>
              </button>
              <button
                className={`mode-btn ${selectedMode === 'chat' ? 'active' : selectedMode ? 'disabled' : ''}`}
                onClick={() => setSelectedMode('chat')}
              >
                <MessageSquare size={20} />
                <span>Chat Explanation</span>
              </button>
              <button
                className={`mode-btn ${selectedMode === 'meet' ? 'active' : selectedMode ? 'disabled' : ''}`}
                onClick={() => setSelectedMode('meet')}
              >
                <Video size={20} />
                <span>Google Meet</span>
              </button>
            </div>
            {selectedMode && (
              <button className="reset-mode-btn" onClick={() => setSelectedMode(null)}>Change Mode</button>
            )}
          </div>
        </div>

        <div className="scq-main-panel">
          {!selectedMode ? (
            <div className="scq-panel-card empty-state">
              <div className="empty-icon-wrap">
                <Terminal size={48} />
              </div>
              <h3>Please select a mode to start</h3>
              <p>Choose between Code, Chat, or Meet to solve this query.</p>
            </div>
          ) : (
            <div className="scq-panel-card resolution-card">
              {/* Dynamic Content based on Mode */}
              {selectedMode === 'editor' && (
                <div className="mode-panel-editor">
                  <div className="panel-header">
                    <div className="header-title"><Code size={18} /><span>Code Editor</span></div>
                    <select className="scq-lang-select" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                    </select>
                  </div>
                  <div className="scq-editor-container">
                    <Editor height="350px" language={language} theme="vs-dark" value={code} onChange={(v) => setCode(v)} />
                  </div>
                  <div className="scq-actions">
                    <button className="scq-run-btn" onClick={handleRunCode}>Run Code</button>
                  </div>
                  {output && <div className={`output-box ${output.includes('Error') ? 'error' : 'success'}`}>{output}</div>}
                </div>
              )}

              {selectedMode === 'chat' && (
                <div className="mode-panel-chat">
                  <div className="panel-header">
                    <div className="header-title"><MessageSquare size={18} /><span>Chat Response</span></div>
                  </div>
                  <textarea
                    className="scq-chat-textarea"
                    placeholder="Write your detailed explanation here..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                  />
                </div>
              )}

              {selectedMode === 'meet' && (
                <div className="mode-panel-meet">
                  <div className="panel-header">
                    <div className="header-title"><Video size={18} /><span>Google Meet</span></div>
                  </div>
                  <div className="meet-content">
                    {!meetLink ? (
                      <button className="generate-meet-btn" onClick={handleGenerateMeet}>Generate Meet Link</button>
                    ) : (
                      <div className="meet-link-box">
                        <input type="text" value={meetLink} readOnly />
                        <div className="meet-actions">
                          <button onClick={() => window.open(meetLink, '_blank')}>Join Meet</button>
                          <button onClick={() => { navigator.clipboard.writeText(meetLink) }}>Copy Link</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="submit-section">
                {selectedMode !== 'chat' && (
                  <div className="explanation-wrap">
                    <label>Additional Notes</label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Explain your solution..."
                    />
                  </div>
                )}
                <button
                  className="scq-send-btn"
                  onClick={handleSendSolution}
                  disabled={isSaving || !response.trim()}
                >
                  {isSaving ? "Submitting..." : "Submit Solution"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      {showSuccess && <div className="scq-toast"><CheckCircle size={20} /><span>Solution submitted successfully!</span></div>}
    </div>
  );
};

export default StudentConnectQuery;
