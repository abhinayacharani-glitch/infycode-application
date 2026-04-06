import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";

const CourseConfig = () => {
  const { courses, toggleCourseStatus } = useAdmin();
  const [showForm, setShowForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', duration: '', level: 'Beginner', mode: 'Online' });

  const handleAddCourse = (e) => {
    e.preventDefault();
    // In a real app, this would call an addCourse action from context
    alert(`Course "${newCourse.name}" would be added in a real implementation.`);
    setShowForm(false);
    setNewCourse({ name: '', duration: '', level: 'Beginner', mode: 'Online' });
  };

  return (
    <div className="page active">
      <div className="card">
        <div className="card-header">
           <div>
             <h3 className="card-title">Course Configuration</h3>
             <p className="card-sub">Define course objectives, syllabus structure, and supported learning modes.</p>
           </div>
           <div style={{ display: 'flex', gap: '8px' }}>
             <button 
               className={showForm ? 'btn-secondary' : 'btn-primary'} 
               onClick={() => setShowForm(!showForm)}
             >
               {showForm ? 'Cancel' : '+ Add New Course'}
             </button>
           </div>
        </div>
        
        {showForm && (
          <div className="card-body" style={{ borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
            <form onSubmit={handleAddCourse} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Course Name</label>
                <input 
                  type="text" 
                  className="filter-select-premium" 
                  style={{ width: '100%', padding: '10px' }}
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Duration</label>
                <input 
                  type="text" 
                  placeholder="e.g. 8 Weeks"
                  className="filter-select-premium" 
                  style={{ width: '100%', padding: '10px' }}
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Skill Level</label>
                <select 
                  className="filter-select-premium" 
                  style={{ width: '100%' }}
                  value={newCourse.level}
                  onChange={(e) => setNewCourse({...newCourse, level: e.target.value})}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>Mode</label>
                <select 
                  className="filter-select-premium" 
                  style={{ width: '100%' }}
                  value={newCourse.mode}
                  onChange={(e) => setNewCourse({...newCourse, mode: e.target.value})}
                >
                  <option>Online</option>
                  <option>Offline</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%', margin: 0 }}>Create Course</button>
              </div>
            </form>
          </div>
        )}

        <div className="card-body">
            <table className="batch-table">
               <thead>
                 <tr>
                   <th>Course Code</th>
                   <th>Course Name</th>
                   <th>Duration</th>
                   <th>Level</th>
                   <th>Mode</th>
                   <th>Status</th>
                   <th>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {courses.map(course => (
                    <tr key={course.id}>
                      <td><b>{course.id}</b></td>
                      <td>{course.name}</td>
                      <td>{course.duration}</td>
                      <td>{course.level}</td>
                      <td>{course.mode}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className={`badge ${course.status === 'Active' ? 'active-b' : 'offline'}`}>{course.status}</span>
                          <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '34px', height: '20px' }}>
                            <input 
                              type="checkbox" 
                              checked={course.status === 'Active'} 
                              onChange={() => toggleCourseStatus(course.id)}
                              style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span style={{
                              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                              backgroundColor: course.status === 'Active' ? 'var(--blue-600)' : '#ccc',
                              transition: '.4s', borderRadius: '20px'
                            }}>
                              <span style={{
                                position: 'absolute', content: '""', height: '14px', width: '14px', left: course.status === 'Active' ? '17px' : '3px', bottom: '3px',
                                backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                              }}></span>
                            </span>
                          </label>
                        </div>
                      </td>
                      <td>
                        <button className="btn-secondary btn-small" style={{ margin: 0 }}>Edit</button>
                      </td>
                    </tr>
                 ))}
               </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default CourseConfig;
