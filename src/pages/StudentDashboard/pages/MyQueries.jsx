import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MessageCircle, CheckCircle, Clock, Eye, AlertCircle } from 'lucide-react';
import './MyQueries.css';

const MyQueries = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [queries, setQueries] = useState([
    { id: 'q1', trainer: 'Charani', query: 'React useEffect dependency array doubt', status: 'Solved', response: 'useEffect runs after every render by default...', date: '2024-04-28' },
    { id: 'q2', trainer: 'Charani', query: 'Django ORM queries optimization', status: 'Pending', response: null, date: '2024-04-29' }
  ]);

  useEffect(() => {
    // Load student's own raised queries
    const raised = JSON.parse(localStorage.getItem('student_queries') || '[]');
    // Load any solved queries from localStorage (simulating real-time updates)
    const solved = JSON.parse(localStorage.getItem('solved_queries') || '[]');
    
    setQueries(prev => {
      let updated = [...prev];
      
      raised.forEach(rq => {
        if (!updated.find(q => q.id === rq.id)) {
          updated.push({
            id: rq.id,
            trainer: rq.trainerName || rq.trainer,
            query: rq.title,
            status: rq.status,
            response: null,
            date: rq.createdAt ? rq.createdAt.split('T')[0] : (rq.date || 'Today')
          });
        }
      });

      // Update status of solved queries
      solved.forEach(sq => {
        const idx = updated.findIndex(q => q.id === sq.id);
        if (idx !== -1) {
          updated[idx] = { ...updated[idx], status: 'Solved', response: sq.response };
        }
      });
      return updated;
    });
  }, []);

  const filteredQueries = queries.filter(q => {
    const matchesSearch = q.query.toLowerCase().includes(search.toLowerCase()) || 
                          q.trainer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || q.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mq-container animate-fade-in">
      <div className="mq-header">
        <h1 className="mq-title">My Queries</h1>
        <p className="mq-subtitle">Track your technical doubts and trainer responses.</p>
      </div>

      <div className="mq-controls">
        <div className="mq-search-box">
          <Search size={20} />
          <input 
            type="text" 
            placeholder="Search queries or trainers..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mq-filter-group">
          {['All', 'Pending', 'Solved'].map(f => (
            <button 
              key={f} 
              className={`mq-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mq-table-container">
        <table className="mq-table">
          <thead>
            <tr>
              <th>Trainer Name</th>
              <th>Query</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-right">Response</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.map(q => (
              <tr key={q.id}>
                <td className="mq-trainer-cell">
                  <div className="mq-avatar">
                    {q.trainer[0]}
                  </div>
                  <span>{q.trainer}</span>
                </td>
                <td className="mq-query-cell">
                  <div className="mq-query-text">{q.query}</div>
                </td>
                <td>
                  <span className={`mq-status-badge ${q.status.toLowerCase()}`}>
                    {q.status === 'Solved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {q.status}
                  </span>
                </td>
                <td className="mq-date-cell">{q.date}</td>
                <td className="text-right">
                  {q.status === 'Solved' ? (
                    <button className="mq-view-btn" onClick={() => navigate(`/student-dashboard/my-queries/${q.id}/solution`, { state: { batchId: q.batchId || 'B1' } })}>
                      <Eye size={18} />
                      <span>View Solution</span>
                    </button>
                  ) : (
                    <span className="mq-pending-text">Awaiting Response</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredQueries.length === 0 && (
          <div className="mq-empty">
            <AlertCircle size={48} />
            <p>No queries found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQueries;
