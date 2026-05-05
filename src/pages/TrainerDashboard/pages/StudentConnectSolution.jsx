import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Code, FileText, Terminal, Clock, MessageSquare, Video, Download } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { getQueryByIdAPI } from '../../../services/api';
import './StudentConnectSolution.css';

const StudentConnectSolution = () => {
  const { batchId: paramBatchId, studentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [solution, setSolution] = useState(null);
  
  const batchId = paramBatchId || location.state?.batchId || 'B1';

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        setLoading(true);
        const res = await getQueryByIdAPI(studentId); // studentId is queryId
        if (res.success) {
          setSolution(res.query);
        }
      } catch (err) {
        console.error("Failed to fetch solution", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSolution();
  }, [studentId]);


  if (loading || !solution) return <div className="sol-loading">Loading solution details...</div>;


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
            {solution.codeSolution ? (
              <div className="editor-container">
                <Editor
                  height="300px"
                  language="javascript"
                  theme="vs-dark"
                  value={solution.codeSolution}
                  options={{ readOnly: true, minimap: { enabled: false }, fontSize: 14 }}
                />
              </div>
            ) : null}
            
            <div className="text-solution">
              {(solution.solution || "").split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {solution.meetLink && (
              <div className="meet-link-display">
                <strong>Meet Link:</strong> <a href={solution.meetLink} target="_blank" rel="noreferrer">{solution.meetLink}</a>
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

