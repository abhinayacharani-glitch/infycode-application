import React, { useState } from "react";

const Reports = () => {
  const [exporting, setExporting] = useState(null);
  
  const exports = [
    { title: "Monthly Registration Data", date: "Mar 18, 2026", type: "CSV", size: "45 KB" },
    { title: "Trainer Performance Index Q1", date: "Jan 10, 2026", type: "PDF", size: "1.2 MB" },
    { title: "Batch B12 Attendance Log", date: "Mar 15, 2026", type: "XLSX", size: "85 KB" },
    { title: "System Access Audit - Weekly", date: "Mar 17, 2026", type: "CSV", size: "230 KB" },
  ];

  const handleExport = (reportName) => {
    setExporting(reportName);
    setTimeout(() => {
      setExporting(null);
      alert(`${reportName} has been generated and downloaded successfully.`);
    }, 2000);
  };

  return (
    <div className="page active">
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Generate Reports</h3>
              <p className="card-sub">Export system operations and analytics data.</p>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: "Student Enrollment Trends", desc: "By demographics, courses, and timeframes.", type: "CSV", icon: "📊" },
            ].map(item => (
              <div key={item.title} className="schedule-item" style={{ alignItems: 'center' }}>
                <div className="sch-icon" style={{ fontSize: '24px', marginRight: '16px' }}>{item.icon}</div>
                <div className="sch-info" style={{ flex: 1 }}>
                  <div className="sch-course">{item.title}</div>
                  <div className="sch-batch">{item.desc}</div>
                </div>
                <button 
                  className={exporting === item.title ? "btn-secondary" : "btn-primary"} 
                  style={{ minWidth: '130px' }}
                  onClick={() => handleExport(item.title)}
                  disabled={!!exporting}
                >
                  {exporting === item.title ? 'Generating...' : `Export ${item.type}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Recent Exports</h3>
              <p className="card-sub">Previously generated report files.</p>
            </div>
          </div>
          <div className="card-body">
            <table className="batch-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Format</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {exports.map((exp, idx) => (
                  <tr key={idx}>
                    <td><b>{exp.title}</b></td>
                    <td><span className={`badge ${exp.type === 'PDF' ? 'offline' : 'active-b'}`} style={{ fontSize: '10px' }}>{exp.type}</span></td>
                    <td>{exp.date}</td>
                    <td><button className="btn-secondary btn-small" style={{ margin: 0 }} onClick={() => alert(`Downloading ${exp.title}...`)}>Download</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
