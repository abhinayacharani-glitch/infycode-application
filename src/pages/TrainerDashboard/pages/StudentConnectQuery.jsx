import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, MessageCircle, Code, Send,
  Video, Phone, MessageSquare, Download, CheckCircle, Clock, Terminal
} from 'lucide-react';
import Editor from '@monaco-editor/react';
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

  useEffect(() => {
    // Load draft if exists
    const draft = localStorage.getItem(`draft_code_${studentId}`);
    if (draft) setCode(draft);
  }, [studentId]);

  useEffect(() => {
    // Auto-save draft
    const timeout = setTimeout(() => {
      localStorage.setItem(`draft_code_${studentId}`, code);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [code, studentId]);

  useEffect(() => {
    try {
      const savedBatches = JSON.parse(localStorage.getItem('trainer_batches_v2') || '[]');
      const currentBatch = savedBatches.find(b => b.id === batchId);
      if (currentBatch) {
        setCourse(currentBatch.course);
        if (currentBatch.course.toLowerCase().includes('python')) setLanguage('python');
        else if (currentBatch.course.toLowerCase().includes('java')) setLanguage('java');
        else setLanguage('javascript');
      }
    } catch (e) { console.error(e); }
  }, [batchId]);

  const languages = useMemo(() => {
    const c = course.toLowerCase();
    if (c.includes('java full stack')) return ["java"];
    if (c.includes('python')) return ["python"];
    if (c.includes('mern') || c.includes('web')) return ["javascript", "typescript", "html", "css"];
    return ["javascript", "java", "python", "sql"];
  }, [course]);

  const student = {
    name: 'Rahul Sharma',
    batch: `Batch ${batchId} - ${course}`,
    title: 'React useEffect dependency array doubt',
    description: 'I am struggling with the useEffect hook. When I use an empty dependency array, my state updates are not reflected in the component after the initial render. How can I properly sync the state?',
    attachment: 'useEffect_debug.png',
    size: '1.2 MB',
    timestamp: '2h ago'
  };

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

  const handleSendSolution = () => {
    if (!response.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      setStatus('Solved');
      setIsSaving(false);
      setShowSuccess(true);

      const solution = {
        id: studentId,
        studentId,
        batchId,
        mode: selectedMode,
        content: selectedMode === 'editor' ? code : (selectedMode === 'chat' ? response : meetLink),
        explanation: response,
        language: selectedMode === 'editor' ? language : null,
        output: selectedMode === 'editor' ? output : null,
        status: 'Solved',
        solvedAt: new Date().toISOString()
      };

      const existing = JSON.parse(localStorage.getItem('solved_queries') || '[]');
      localStorage.setItem('solved_queries', JSON.stringify([...existing, solution]));
      localStorage.removeItem(`draft_code_${studentId}`);

      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/trainer-dashboard/student-connect/${batchId}`);
      }, 2000);
    }, 1500);
  };

  const handleDownload = (filename) => {
    // Simulate download
    const toast = document.createElement('div');
    toast.className = 'scq-toast';
    toast.innerText = `Downloading ${filename}...`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

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
              <div className="scq-avatar-large">RS</div>
              <div>
                <h3>{student.name}</h3>
                <p>{student.batch}</p>
              </div>
            </div>
            <div className="scq-query-content">
              <h4 className="scq-query-title">{student.title}</h4>
              <p className="scq-query-desc">{student.description}</p>
              {student.attachment && (
                <button className="download-btn" onClick={() => handleDownload(student.attachment)}>
                  <Download size={16} />
                  <span>{student.attachment} ({student.size})</span>
                </button>
              )}
              <span className="scq-timestamp">{student.timestamp}</span>
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
