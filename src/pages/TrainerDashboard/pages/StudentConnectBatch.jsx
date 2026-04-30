import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import './StudentConnectBatch.css';

const MOCK_STUDENTS = [
  { id: 's1', name: 'Rahul Sharma', query: 'React useEffect dependency array doubt', status: 'Pending', time: '2h ago' },
  { id: 's2', name: 'Sneha Gupta', query: 'Java Stream API filter logic', status: 'Solved', time: '5h ago' },
  { id: 's3', name: 'Amit Verma', query: 'MySQL Join query returning empty results', status: 'Pending', time: '10:30 AM' },
  { id: 's4', name: 'Priya Das', query: 'Spring Security CSRF configuration', status: 'Solved', time: 'Yesterday' },
  { id: 's5', name: 'Vikram Singh', query: 'AWS S3 bucket policy access denied', status: 'Pending', time: '11:15 AM' },
  { id: 's6', name: 'Ananya Rao', query: 'Python List comprehension vs loops', status: 'Solved', time: '2 days ago' }
];

const StudentConnectBatch = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [students, setStudents] = useState(MOCK_STUDENTS);

  useEffect(() => {
    try {
      const solved = JSON.parse(localStorage.getItem('solved_queries') || '[]');
      const updatedStudents = MOCK_STUDENTS.map(s => {
        const solvedData = solved.find(sq => sq.studentId === s.id && sq.batchId === batchId);
        return solvedData ? { ...s, status: 'Solved' } : s;
      });
      setStudents(updatedStudents);
    } catch (e) { 
      console.error(e);
      setStudents(MOCK_STUDENTS);
    }
  }, [batchId]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                            s.query.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || s.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter, students]);

  return (
    <div className="scb-container animate-fade-in">
      <div className="scb-header">
        <button className="scb-back-btn" onClick={() => navigate('/trainer-dashboard/student-connect')}>
          <ArrowLeft size={20} />
          <span>Back to Batches</span>
        </button>
        <div className="scb-header-text">
          <h1 className="scb-title">{batchId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h1>
          <p className="scb-subtitle">Manage student queries and resolve technical issues.</p>
        </div>
      </div>

      <div className="scb-controls">
        <div className="scb-search-box">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search students or queries..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="scb-filter-group">
          {['All', 'Pending', 'Solved'].map(f => (
            <button 
              key={f} 
              className={`scb-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="scb-table-container">
        <table className="scb-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Query Title</th>
              <th>Status</th>
              <th>Time</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td className="scb-name-cell">
                  <div className="scb-avatar">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span>{student.name}</span>
                </td>
                <td className="scb-query-cell">{student.query}</td>
                <td>
                  <span className={`scb-status-badge ${student.status.toLowerCase()}`}>
                    {student.status === 'Solved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {student.status === 'Solved' ? 'Solved' : 'Have to Solve'}
                  </span>
                </td>
                <td className="scb-time-cell">{student.time}</td>
                <td className="text-right">
                  <button 
                    className={`scb-solve-btn ${student.status === 'Solved' ? 'solved' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (student.status === 'Solved') {
                        navigate(`/trainer-dashboard/student-connect/${batchId}/${student.id}/solution`);
                      } else {
                        navigate(`/trainer-dashboard/student-connect/${batchId}/${student.id}`);
                      }
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>{student.status === 'Solved' ? 'View Solution' : 'View Query'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredStudents.length === 0 && (
          <div className="scb-empty">
            <Search size={48} />
            <p>No students found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentConnectBatch;
