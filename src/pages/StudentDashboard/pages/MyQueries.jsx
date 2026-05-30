import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MessageCircle, CheckCircle, Clock, Eye, AlertCircle, ArrowLeft } from 'lucide-react';
import './MyQueries.css';

import { getStudentQueriesAPI } from '../../../services/api';

const MyQueries = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const res = await getStudentQueriesAPI();
        if (res.success && res.queries) {
          const formatted = res.queries.map(q => ({
            id: q.id,
            trainer: q.trainerName || 'Trainer',
            query: q.title || q.text || 'Technical Doubt',
            status: q.solution ? 'Solved' : 'Pending',
            response: q.solution,
            date: q.createdAt ? q.createdAt.split('T')[0] : 'N/A',
            batchId: q.batchId
          }));
          setQueries(formatted);
        }
      } catch (err) {
        console.error("Error fetching student queries list:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const filteredQueries = queries.filter(q => {
    const matchesSearch = q.query.toLowerCase().includes(search.toLowerCase()) || 
                          q.trainer.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || q.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="mq-container animate-fade-in">
      <div className="mq-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          className="circular-back-btn" 
          onClick={() => navigate('/student-dashboard/trainer-connect')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid #cbd5e1',
            background: '#fff',
            cursor: 'pointer',
            color: '#64748b',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = '#3b82f6';
            e.currentTarget.style.color = '#3b82f6';
            e.currentTarget.style.background = '#eff6ff';
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.background = '#fff';
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="mq-title" style={{ margin: 0 }}>My Queries</h1>
          <p className="mq-subtitle" style={{ margin: '4px 0 0 0' }}>Track your technical doubts and trainer responses.</p>
        </div>
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading raised queries...</div>
        ) : (
          <>
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
                        <button className="mq-view-btn" onClick={() => navigate(`/student-dashboard/my-queries/${q.id}/solution`, { state: { batchId: q.batchId } })}>
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
          </>
        )}
      </div>
    </div>
  );
};

export default MyQueries;
