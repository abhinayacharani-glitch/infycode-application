import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";

const StudentVerification = () => {
  const { students, approveStudent, rejectStudent } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [viewingStudent, setViewingStudent] = useState(null);

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleSelect = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return <span className="badge upcoming">Pending</span>;
      case 'Verified': return <span className="badge active-b">Verified</span>;
      case 'Assigned': return <span className="badge success" style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>Assigned</span>;
      default: return <span className="badge amber">{status}</span>;
    }
  };

  return (
    <div className="page active">
      <div className="card">
        <div className="card-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '16px' }}>
           <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="card-title">Student Registration Verification</h3>
                <p className="card-sub">Review and verify student identities and registration sources.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-primary">Export CSV</button>
              </div>
           </div>

           <div className="table-controls" style={{ width: '100%', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
             <div className="filter-container-premium" style={{ flex: 1, minWidth: '300px' }}>
               <input 
                 type="text" 
                 placeholder="Search students..." 
                 className="filter-select-premium" 
                 style={{ flex: 1, paddingRight: '12px', backgroundImage: 'none' }}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
               <select 
                 className="filter-select-premium" 
                 value={filterStatus}
                 onChange={(e) => setFilterStatus(e.target.value)}
               >
                 <option value="All">All Status</option>
                 <option value="Pending">Pending</option>
                 <option value="Verified">Verified</option>
                 <option value="Assigned">Assigned</option>
               </select>
             </div>
             {selectedStudents.length > 0 && (
               <div style={{ display: 'flex', gap: '8px' }}>
                 <button className="btn-primary btn-small" onClick={() => selectedStudents.forEach(id => approveStudent(id))}>Approve Selected</button>
                 <button className="btn-secondary btn-small" onClick={() => selectedStudents.forEach(id => rejectStudent(id))}>Reject Selected</button>
               </div>
             )}
           </div>
        </div>

        <div className="card-body" style={{ overflowX: 'auto' }}>
            <table className="batch-table">
               <thead>
                 <tr>
                   <th style={{ width: '40px' }}><input type="checkbox" checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} onChange={selectAll} /></th>
                   <th>Name</th>
                   <th>Specialization</th>
                   <th>Date</th>
                   <th>Status</th>
                   <th>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {filteredStudents.length > 0 ? (
                   filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td><input type="checkbox" checked={selectedStudents.includes(student.id)} onChange={() => toggleSelect(student.id)} /></td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '600' }}>{student.name}</span>
                          <span style={{ fontSize: '12px', color: '#666' }}>{student.email}</span>
                        </div>
                      </td>
                      <td>{student.course}</td>
                      <td>{student.date}</td>
                      <td>{getStatusBadge(student.status)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {student.status === 'Pending' && (
                            <>
                              <button className="btn-primary btn-small" onClick={() => approveStudent(student.id)}>Verify</button>
                              <button className="btn-secondary btn-small" onClick={() => rejectStudent(student.id)}>Reject</button>
                            </>
                          )}
                          <button className="btn-secondary btn-small" onClick={() => setViewingStudent(student)}>View Details</button>
                        </div>
                      </td>
                    </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No students found matching your criteria.</td>
                   </tr>
                 )}
               </tbody>
            </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {viewingStudent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setViewingStudent(null)}>
          <div style={{
            background: 'white', padding: '32px', borderRadius: '12px', maxWidth: '500px', width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Student Profile Details</h3>
              <button 
                onClick={() => setViewingStudent(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
              >×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px' }}>
              <div style={{ color: '#666' }}>Full Name:</div><div style={{ fontWeight: '600' }}>{viewingStudent.name}</div>
              <div style={{ color: '#666' }}>Email:</div><div>{viewingStudent.email}</div>
              <div style={{ color: '#666' }}>Course:</div><div>{viewingStudent.course}</div>
              <div style={{ color: '#666' }}>Reg. Date:</div><div>{viewingStudent.date}</div>
              <div style={{ color: '#666' }}>Status:</div><div>{getStatusBadge(viewingStudent.status)}</div>
              <div style={{ color: '#666' }}>ID Proof:</div><div style={{ color: 'var(--blue-600)', cursor: 'pointer' }}>📄 document-092.pdf</div>
            </div>
            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              {viewingStudent.status === 'Pending' && (
                <button 
                  className="btn-primary" 
                  onClick={() => { approveStudent(viewingStudent.id); setViewingStudent(null); }}
                >Verify Student</button>
              )}
              <button 
                className="btn-secondary" 
                onClick={() => setViewingStudent(null)}
              >Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentVerification;
