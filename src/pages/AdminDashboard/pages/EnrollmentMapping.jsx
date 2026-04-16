import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";

const EnrollmentMapping = () => {
  const { students, courses, batches } = useAdmin();
  const [mapping, setMapping] = useState({ studentId: '', courseName: '', batchId: '' });
  const [showMappingCard, setShowMappingCard] = useState(false);

  const selectedStudent = students.find(s => s.id === parseInt(mapping.studentId));
  const selectedCourse = courses.find(c => c.name === mapping.courseName);
  const selectedBatch = batches.find(b => b.id === mapping.batchId);

  const handleMap = (e) => {
    e.preventDefault();
    if (selectedBatch && selectedBatch.enrolled >= selectedBatch.capacity) {
      alert("Warning: This batch is already at full capacity!");
      return;
    }
    setShowMappingCard(true);
  };

  return (
    <div className="page active">
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Enrollment Mapping Tool</h3>
              <p className="card-sub">Assign verified students to courses and specific batches.</p>
            </div>
          </div>
          <div className="card-body">
            <form onSubmit={handleMap} className="admin-filter-container" style={{ flexDirection: 'column', gap: '20px', alignItems: 'stretch' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Student</label>
                <select 
                  className="admin-filter-select" 
                  style={{ width: '100%' }}
                  value={mapping.studentId}
                  onChange={(e) => setMapping({...mapping, studentId: e.target.value})}
                  required
                >
                  <option value="" disabled hidden>-- Choose Verified Student --</option>
                  {students.filter(s => s.status === 'Verified' || s.status === 'Pending').map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.course})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Target Course</label>
                <select 
                  className="admin-filter-select" 
                  style={{ width: '100%' }}
                  value={mapping.courseName}
                  onChange={(e) => setMapping({...mapping, courseName: e.target.value, batchId: ''})}
                  required
                >
                   <option value="" disabled hidden>-- Choose Course --</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Available Batch</label>
                <select 
                  className="admin-filter-select" 
                  style={{ width: '100%' }}
                  value={mapping.batchId}
                  onChange={(e) => setMapping({...mapping, batchId: e.target.value})}
                  required
                  disabled={!mapping.courseName}
                >
                   <option value="" disabled hidden>-- Choose Batch --</option>
                  {batches.filter(b => b.course === mapping.courseName).map(b => (
                    <option key={b.id} value={b.id}>{b.name} (Capacity: {b.enrolled}/{b.capacity})</option>
                  ))}
                </select>
              </div>

              {selectedBatch && selectedBatch.enrolled >= selectedBatch.capacity && (
                <div style={{ color: 'var(--red-500)', fontSize: '13px', background: 'var(--red-50)', padding: '10px', borderRadius: '4px' }}>
                  ⚠️ Selected batch is at full capacity.
                </div>
              )}

              <button 
                type="submit" 
                className="btn-primary" 
                style={{ width: '100%', padding: '12px', fontSize: '15px' }}
                disabled={selectedBatch && selectedBatch.enrolled >= selectedBatch.capacity}
              >Generate Mapping & ID</button>
            </form>
          </div>
        </div>

        <div>
          {showMappingCard ? (
            <div className="card" style={{ border: '2px border var(--blue-500)', background: '#f0f9ff' }}>
              <div className="card-header">
                <h3 className="card-title">Mapping Summary</h3>
              </div>
              <div className="card-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ textAlign: 'center', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>Generated Course ID</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--blue-700)', margin: '8px 0' }}>
                      {selectedCourse?.id}-{selectedBatch?.id}-{Math.floor(Math.random() * 9000) + 1000}
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'white', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>Student</div>
                      <div style={{ fontWeight: '600' }}>{selectedStudent?.name}</div>
                    </div>
                    <div style={{ padding: '12px', background: 'white', borderRadius: '6px' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>Course</div>
                      <div style={{ fontWeight: '600' }}>{selectedCourse?.name}</div>
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Batch Details</div>
                    <div style={{ fontWeight: '600' }}>{selectedBatch?.name} (Trainer: {selectedBatch?.trainer})</div>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" style={{ flex: 1, padding: '10px' }} onClick={() => alert("Enrollment confirmed! Mapping saved.")}>Confirm Enrollment</button>
                    <button className="btn-secondary" style={{ flex: 1, padding: '10px' }} onClick={() => setShowMappingCard(false)}>Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed var(--border)', background: 'transparent' }}>
              <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔗</div>
                <p>Select student and batch details to generate mapping summary.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Recent Mappings</h3>
        </div>
        <div className="card-body">
          <table className="batch-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Student</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>FSD-B12-8921</b></td>
                <td>Rohan Kumar</td>
                <td>React Alpha</td>
                <td><span className="badge active-b">Active</span></td>
                <td><button className="btn-secondary btn-small" style={{ margin: 0 }}>View Details</button></td>
              </tr>
              <tr>
                <td><b>UIX-B02-8919</b></td>
                <td>David Lee</td>
                <td>Design Beta</td>
                <td><span className="badge amber">Pending Access</span></td>
                <td><button className="btn-secondary btn-small" style={{ margin: 0 }}>View Details</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentMapping;
