import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";

const FileIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
);

const StudentVerification = () => {
  const { students, approveStudent, rejectStudent, batches, moveStudentsToBatch } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [exportState, setExportState] = useState('idle'); // idle | downloading | success
  
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [isMoving, setIsMoving] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleExportCSV = () => {
    if (exportState !== 'idle') return;
    setExportState('downloading');
    
    // Simulate real-world delay for feedback
    setTimeout(() => {
      // 1. Prepare CSV Content from current filtered results
      const headers = ["ID", "Name", "Email", "Course", "Status", "Date"];
      const rows = filteredStudents.map(s => [
        s.id, 
        `"${s.name}"`, 
        s.email, 
        `"${s.course}"`, 
        s.status, 
        s.date || new Date().toLocaleDateString()
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(e => e.join(","))
      ].join("\n");

      // 2. Trigger browser Download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `admin-data-students.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 3. Update UI to success indication
      setExportState('success');
      
      // 4. Revert to idle after delay
      setTimeout(() => {
        setExportState('idle');
      }, 2500);
    }, 1500);
  };

  const filteredStudents = students
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "All" || s.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0);
      const dateB = new Date(b.createdAt || b.date || 0);
      return dateB - dateA;
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
      case 'Enrolled': return <span className="badge active-b">Enrolled</span>;
      default: return <span className="badge amber">{status}</span>;
    }
  };

  const handleMoveConfirm = async () => {
    if (!selectedBatchId || selectedStudents.length === 0) return;
    
    setIsMoving(true);
    try {
      await moveStudentsToBatch(selectedBatchId, selectedStudents);
      alert(`Successfully moved ${selectedStudents.length} students.`);
      setSelectedStudents([]);
      setIsMoveModalOpen(false);
      setSelectedBatchId("");
    } catch (error) {
      alert("Failed to move students: " + error.message);
    } finally {
      setIsMoving(false);
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
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    if (selectedStudents.length === 0) return;
                    setIsMoveModalOpen(true);
                  }}
                  disabled={selectedStudents.length === 0}
                  style={{ 
                    minWidth: '100px', 
                    opacity: selectedStudents.length === 0 ? 0.6 : 1,
                    cursor: selectedStudents.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Move {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''}
                </button>
                <button 
                  className={`btn-primary ${exportState === 'success' ? 'btn-export-success' : ''}`}
                  onClick={handleExportCSV}
                  disabled={exportState !== 'idle'}
                  style={{ minWidth: '135px', transition: 'all 0.3s ease' }}
                >
                  {exportState === 'downloading' && <span className="adm-btn-loader"></span>}
                  {exportState === 'idle' && "Export CSV"}
                  {exportState === 'downloading' && "Downloading..."}
                  {exportState === 'success' && "Downloaded ✓"}
                </button>
              </div>
           </div>

           <div className="admin-filter-container" style={{ width: '100%', flexWrap: 'wrap' }}>
             <input 
               type="text" 
               placeholder="Search students..." 
               className="admin-filter-input" 
               style={{ flex: 1, minWidth: '200px' }}
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <select 
               className="admin-filter-select" 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
             >
               <option value="All">All Status</option>
               <option value="Pending">Pending</option>
               <option value="Enrolled">Enrolled</option>
             </select>
           </div>
        </div>

        <div className="card-body" style={{ overflowX: 'auto' }}>
            <table className="batch-table">
               <thead>
                 <tr>
                   <th style={{ width: '40px' }}><input type="checkbox" checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} onChange={selectAll} /></th>
                   <th style={{ width: '35%' }}>Name</th>
                   <th style={{ textAlign: 'center', width: '20%' }}>Date</th>
                   <th style={{ textAlign: 'center', width: '25%' }}>Course</th>
                   <th style={{ textAlign: 'center', width: '15%' }}>Status</th>
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
                      <td style={{ textAlign: 'center' }}>{formatDate(student.createdAt || student.date)}</td>
                      <td style={{ textAlign: 'center' }}>{student.course || "N/A"}</td>
                      <td style={{ textAlign: 'center' }}>{getStatusBadge(student.status)}</td>
                    </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>No students found matching your criteria.</td>
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
              <div style={{ color: '#666' }}>ID Proof:</div><div style={{ color: 'var(--blue-600)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><FileIcon /> document-092.pdf</div>
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

      {/* Move Students Modal */}
      {isMoveModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setIsMoveModalOpen(false)}>
          <div style={{
            background: 'white', padding: '32px', borderRadius: '12px', maxWidth: '500px', width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ margin: 0 }}>Move Students to Batch</h3>
              <button onClick={() => setIsMoveModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            
            <p style={{ marginBottom: '16px', color: '#666' }}>
              Select a target batch for the {selectedStudents.length} selected students.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Batch</label>
              <select 
                value={selectedBatchId} 
                onChange={(e) => setSelectedBatchId(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
              >
                <option value="">— Select a batch —</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name || batch.courseName} ({batch.enrolled || 0} / {batch.capacity} Students)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn-secondary" onClick={() => setIsMoveModalOpen(false)}>Cancel</button>
              <button 
                className="btn-primary" 
                onClick={handleMoveConfirm}
                disabled={!selectedBatchId || isMoving}
              >
                {isMoving ? "Moving..." : "Confirm Move"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentVerification;
