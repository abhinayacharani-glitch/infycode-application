import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";

const BatchSetup = () => {
  const { batches, trainers, courses, addBatch } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [newBatch, setNewBatch] = useState({ name: '', course: '', trainer: '', capacity: 30, status: 'Draft' });

  const handleCreateBatch = (e) => {
    e.preventDefault();
    addBatch(newBatch);
    setShowForm(false);
    setNewBatch({ name: '', course: '', trainer: '', capacity: 30, status: 'Draft' });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="badge active-b">Active</span>;
      case 'Completed': return <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>Completed</span>;
      case 'Draft': return <span className="badge amber">Draft</span>;
      default: return <span className="badge upcoming">{status}</span>;
    }
  };

  return (
    <div className="page active">
      <div className="card">
        <div className="card-header">
           <div>
             <h3 className="card-title">Batch Creation and Management</h3>
             <p className="card-sub">Create training batches, assign trainers, and configure schedules.</p>
           </div>
           <div style={{ display: 'flex', gap: '8px' }}>
             <button 
               className={showForm ? 'btn-secondary' : 'btn-primary'} 
               onClick={() => setShowForm(!showForm)}
             >
               {showForm ? 'Cancel' : '+ Schedule Batch'}
             </button>
           </div>
        </div>

        {showForm && (
          <div className="card-body" style={{ borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
            <form onSubmit={handleCreateBatch} className="admin-filter-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Batch Name</label>
                <input 
                  type="text" 
                  className="admin-filter-input" 
                  style={{ width: '100%' }}
                  value={newBatch.name}
                  onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Select Course</label>
                <select 
                  className="admin-filter-select" 
                  style={{ width: '100%' }}
                  value={newBatch.course}
                  onChange={(e) => setNewBatch({...newBatch, course: e.target.value})}
                  required
                >
                  <option value="">Choose Course</option>
                  {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Assign Trainer</label>
                <select 
                  className="admin-filter-select" 
                  style={{ width: '100%' }}
                  value={newBatch.trainer}
                  onChange={(e) => setNewBatch({...newBatch, trainer: e.target.value})}
                  required
                >
                  <option value="">Choose Trainer</option>
                  {trainers.filter(t => t.status === 'Onboarded' || t.status === 'Selected').map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Max Capacity</label>
                <input 
                  type="number" 
                  className="admin-filter-input" 
                  style={{ width: '100%' }}
                  value={newBatch.capacity}
                  onChange={(e) => setNewBatch({...newBatch, capacity: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', margin: 0, height: '40px' }}>Create Batch</button>
              </div>
            </form>
          </div>
        )}

        <div className="card-body">
            <table className="batch-table">
               <thead>
                 <tr>
                   <th>Batch ID</th>
                   <th>Course</th>
                   <th>Trainer</th>
                   <th>Enrollment Progress</th>
                   <th>Status</th>
                   <th>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {batches.map(batch => {
                   const progress = (batch.enrolled / batch.capacity) * 100;
                   return (
                    <tr key={batch.id}>
                      <td><b>{batch.batchId}</b></td>
                      <td>{batch.course}</td>
                      <td>{batch.trainer}</td>
                      <td style={{ width: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${progress}%`, 
                              background: progress > 80 ? 'var(--red-500)' : 'var(--blue-500)', 
                              height: '100%',
                              transition: 'width 0.4s ease'
                            }}></div>
                          </div>
                          <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '40px' }}>{batch.enrolled}/{batch.capacity}</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(batch.status)}</td>
                      <td>
                        <button className="btn-secondary btn-small" style={{ margin: 0 }}>Manage</button>
                      </td>
                    </tr>
                   );
                 })}
               </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default BatchSetup;
