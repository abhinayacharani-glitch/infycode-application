import React, { useState, useEffect } from "react";
import { getAdminStudentResults } from "../../../services/api";

const StudentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getAdminStudentResults();
      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.message || "Failed to fetch results");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active">
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Student Performance Results</h3>
            <p className="card-sub">Overview of student scores in foundational and technical assessments.</p>
          </div>
          <button className="btn-primary" onClick={fetchResults} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
        <div className="card-body">
          {error && <div className="alert-error" style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
          
          <div className="table-responsive">
            <table className="batch-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Aptitude</th>
                  <th>Reasoning</th>
                  <th>Communication</th>
                  <th>Overall (P1)</th>
                  <th>Core Technical</th>
                </tr>
              </thead>
              <tbody>
                {loading && results.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>Loading student results...</td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>No student results found.</td>
                  </tr>
                ) : (
                  results.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{student.name}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>{student.email}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>{student.foundationalCompleted ? student.aptitude : "-"}</td>
                      <td style={{ textAlign: 'center' }}>{student.foundationalCompleted ? student.reasoning : "-"}</td>
                      <td style={{ textAlign: 'center' }}>{student.foundationalCompleted ? student.communication : "-"}</td>
                      <td style={{ textAlign: 'center' }}>
                        <b style={{ color: student.foundationalCompleted ? '#2563eb' : '#999' }}>
                          {student.foundationalCompleted ? student.overallScore : "-"}
                        </b>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {student.coreCompleted ? (
                          <span className="badge active-b" style={{ background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '4px' }}>
                            {student.coreTechnical}
                          </span>
                        ) : (
                          <span style={{ color: '#999', fontStyle: 'italic' }}>Not Attempted</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResults;
