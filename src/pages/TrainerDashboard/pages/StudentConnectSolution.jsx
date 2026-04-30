import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Code, FileText, Terminal, Clock, MessageSquare, Video, Download } from 'lucide-react';
import Editor from '@monaco-editor/react';
import './StudentConnectSolution.css';

const StudentConnectSolution = () => {
  const { batchId: paramBatchId, studentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  
  const batchId = paramBatchId || location.state?.batchId || 'B1';

  const dummySolution = {
    isDummy: true,
    title: "Sample Query",
    query: "Explain the difference between REST API and GraphQL with examples.",
    mode: 'chat',
    content: `REST API uses fixed endpoints like /users
GraphQL uses single endpoint and flexible queries
REST may cause over-fetching
GraphQL fetches only required data

Example:
REST → GET /users (full data)
GraphQL → query { user { name } } (only name)

Conclusion:
GraphQL is flexible, REST is simple and widely used`,
    solvedAt: new Date().toISOString(),
    studentName: "Rahul Sharma",
    batchName: `Batch ${batchId} - Full Stack Development`
  };

  useEffect(() => {
    try {
      const solved = JSON.parse(localStorage.getItem('solved_queries') || '[]');
      const found = solved.find(s => s.studentId === studentId && s.batchId === batchId);
      
      if (found && found.content && found.content.trim() !== '') {
        setSolution({ ...found, isDummy: false });
      } else {
        setSolution(dummySolution);
      }
    } catch (e) { 
      console.error(e);
      setSolution(dummySolution);
    }
  }, [batchId, studentId]);

  if (!solution) return null;

  const renderBadge = (mode) => {
    switch (mode) {
      case 'chat':
        return <span className="sol-badge chat-badge"><div className="dot green"></div> Chat Answer</span>;
      case 'editor':
        return <span className="sol-badge editor-badge"><div className="dot purple"></div> Editor Solution</span>;
      case 'meet':
        return <span className="sol-badge meet-badge"><div className="dot blue"></div> Solved via Meet</span>;
      default:
        return <span className="sol-badge chat-badge"><div className="dot green"></div> Chat Answer</span>;
    }
  };

  return (
    <div className="sol-page-wrapper">
      <div className="sol-container animate-fade-in">
        <div className="sol-top-nav">
          <button className="sol-back-btn" onClick={() => navigate(`/trainer-dashboard/student-connect/${batchId}`)}>
            <ArrowLeft size={18} />
            <span>Back to Students</span>
          </button>
        </div>

        {/* Question Card */}
        <div className="sol-card question-card">
          <div className="card-tag">QUESTION</div>
          <h1 className="sol-title">{solution.isDummy ? dummySolution.title : (solution.title || "Query Details")}</h1>
          <div className="query-content">
            {solution.isDummy ? dummySolution.query : solution.queryDescription || solution.query || "No description provided."}
          </div>
          
          {solution.material && (
            <div className="download-section">
              <button className="download-btn">
                <Download size={18} />
                <span>Download Material</span>
              </button>
            </div>
          )}
        </div>

        {/* Solution Card */}
        <div className="sol-card solution-card">
          <div className="solution-header">
            {renderBadge(solution.mode)}
            <div className="timestamp">
              <Clock size={14} />
              <span>{new Date(solution.solvedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="solution-content">
            {solution.mode === 'editor' ? (
              <div className="editor-container">
                <Editor
                  height="300px"
                  language={solution.language || 'javascript'}
                  theme="vs-dark"
                  value={solution.content}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                />
              </div>
            ) : (
              <div className="text-solution">
                {solution.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </div>

          {solution.explanation && (
            <div className="trainer-note">
              <strong>Note:</strong> {solution.explanation}
            </div>
          )}
        </div>

        {solution.isDummy && (
          <div className="empty-state-note">
            No official solution provided yet. Showing reference solution.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentConnectSolution;

