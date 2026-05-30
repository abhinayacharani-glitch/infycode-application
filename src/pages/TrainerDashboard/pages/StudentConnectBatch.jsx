import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { getBatchStudentsAPI, getTrainerQueriesAPI } from '../../../services/api';
import { formatDistanceToNow } from 'date-fns';
import './StudentConnectBatch.css';

const StudentConnectBatch = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, queriesRes] = await Promise.all([
          getBatchStudentsAPI(batchId),
          getTrainerQueriesAPI()
        ]);

        if (studentsRes.success) {
          const allBatchStudents = studentsRes.students || [];
          const allQueries = queriesRes.success ? queriesRes.queries : [];

          const merged = allBatchStudents.map(student => {
            // Find query for this student in this batch
            const studentQuery = allQueries.find(q => q.studentId === student.id && q.batchId === batchId);

            return {
              id: student.id,
              studentId: student.studentId,
              queryId: studentQuery ? studentQuery.id : null,
              name: student.name,
              query: studentQuery ? studentQuery.title : 'No active query',
              status: studentQuery ? (studentQuery.status === 'Solved' ? 'Solved' : 'Pending') : 'None',
              time: studentQuery ? formatDistanceToNow(new Date(studentQuery.createdAt), { addSuffix: true }) : 'N/A',
              hasQuery: !!studentQuery
            };
          });

          setStudents(merged);
        }
      } catch (e) {
        console.error("Failed to fetch batch students and queries", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
                    className={`scb-solve-btn ${student.status === 'Solved' ? 'solved' : ''} ${!student.hasQuery ? 'disabled' : ''}`}
                    disabled={!student.hasQuery}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (student.status === 'Solved') {
                        navigate(`/trainer-dashboard/student-connect/${batchId}/${student.queryId}/solution`);
                      } else {
                        navigate(`/trainer-dashboard/student-connect/${batchId}/${student.queryId}`);
                      }
                    }}
                  >
                    <MessageCircle size={18} />
                    <span>{student.status === 'Solved' ? 'View Solution' : (student.hasQuery ? 'View Query' : 'No Query')}</span>
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
