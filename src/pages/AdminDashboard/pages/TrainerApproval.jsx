import React, { useState } from "react";
import { useAdmin } from "../../../context/AdminContext";

const TrainerApproval = () => {
  const { trainers, updateTrainerStatus } = useAdmin();
  const [viewingTrainerId, setViewingTrainerId] = useState(null);
  const viewingTrainer = trainers.find(t => t.id === viewingTrainerId);

  const stages = ['Applied', 'Screening', 'Interview', 'Selected', 'Onboarded'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied': return '#64748b';
      case 'Screening': return '#3b82f6';
      case 'Interview': return '#f59e0b';
      case 'Selected': return '#10b981';
      case 'Onboarded': return '#8b5cf6';
      case 'Hold': return '#ef4444';
      case 'Rejected': return '#e11d48';
      default: return '#ccc';
    }
  };

  return (
    <div className="page active">
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Trainer Recruitment Pipeline</h3>
            <p className="card-sub">Evaluate trainer registrations, schedule interviews, and trigger onboarding.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
          </div>
        </div>
        <div className="card-body">
          <table className="batch-table">
            <thead>
              <tr>
                <th>Trainer Name</th>
                <th>Current Stage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map(trainer => (
                <tr key={trainer.id}>
                  <td style={{ padding: '24px 12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{trainer.name}</span>
                        <span style={{ fontSize: '13px', color: '#666' }}>{trainer.specialty}</span>
                      </div>
                      <div style={{ position: 'relative', marginTop: '16px', width: '380px' }}>
                        <div style={{ position: 'absolute', top: '10px', left: 0, right: 0, height: '2px', background: '#e2e8f0', zIndex: 0 }}></div>
                        <div style={{
                          position: 'absolute', top: '10px', left: 0,
                          width: `${Math.max(0, (stages.indexOf(trainer.status === 'Hold' ? (trainer.prevStatus || 'Applied') : trainer.status) / (stages.length - 1))) * 100}%`,
                          height: '2px', background: getStatusColor(trainer.status), zIndex: 1,
                          transition: 'width 0.4s ease'
                        }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2, position: 'relative' }}>
                          {stages.map((stage, idx) => {
                            const currentStageIdx = stages.indexOf(trainer.status === 'Hold' ? (trainer.prevStatus || 'Applied') : trainer.status);
                            const isCompleted = currentStageIdx >= idx;
                            const isCurrent = trainer.status === stage;
                            return (
                              <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div style={{
                                  width: '20px', height: '20px', borderRadius: '50%',
                                  background: isCompleted ? getStatusColor(stage) : 'white',
                                  border: `2px solid ${isCompleted ? getStatusColor(stage) : '#e2e8f0'}`,
                                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                                  color: isCompleted ? 'white' : '#666', fontWeight: 'bold', fontSize: '10px',
                                  transition: 'all 0.3s ease'
                                }}>
                                  {isCompleted && currentStageIdx > idx ? '✓' : idx + 1}
                                </div>
                                <span style={{
                                  marginTop: '4px', fontSize: '9px', fontWeight: isCurrent ? 'bold' : '500',
                                  color: isCurrent ? 'var(--text-dark)' : '#94a3b8',
                                  textAlign: 'center'
                                }}>{stage}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '24px 12px' }}>
                    <span className="badge" style={{
                      background: getStatusColor(trainer.status) + '15',
                      color: getStatusColor(trainer.status),
                      border: `1px solid ${getStatusColor(trainer.status)}`,
                      padding: '6px 12px'
                    }}>{trainer.status}</span>
                  </td>
                  <td style={{ padding: '24px 12px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn-secondary btn-small"
                        style={{ margin: 0 }}
                        onClick={() => setViewingTrainerId(trainer.id)}
                      >View Pipeline</button>
                      {trainer.status !== 'Onboarded' && (
                        <button
                          className="badge active-b"
                          onClick={() => updateTrainerStatus(trainer.id, 'next')}
                        >Promote</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trainer Recruitment Modal */}
      {viewingTrainer && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }} onClick={() => setViewingTrainerId(null)}>
          <div style={{
            background: 'white', padding: '32px', borderRadius: '12px', maxWidth: '700px', width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div>
                <h3 style={{ margin: 0 }}>Recruitment Workflow: {viewingTrainer.name}</h3>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>Move trainer through hiring stages</p>
              </div>
              <button
                onClick={() => setViewingTrainerId(null)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
              >×</button>
            </div>

            {/* Stepper UI */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '40px' }}>
              <div style={{
                position: 'absolute', top: '15px', left: 0, right: 0, height: '2px', background: '#e2e8f0', zIndex: 0
              }}></div>
              <div style={{
                position: 'absolute', top: '15px', left: 0,
                width: `${Math.max(0, (stages.indexOf(viewingTrainer.status) / (stages.length - 1))) * 100}%`,
                height: '2px', background: getStatusColor(viewingTrainer.status), zIndex: 1,
                transition: 'width 0.4s ease'
              }}></div>

              {stages.map((stage, idx) => {
                const currentStageIdx = stages.indexOf(viewingTrainer.status);
                const isCompleted = currentStageIdx >= idx;
                const isCurrent = viewingTrainer.status === stage;
                return (
                  <div key={stage} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%',
                      background: isCompleted ? getStatusColor(stage) : 'white',
                      border: `2px solid ${isCompleted ? getStatusColor(stage) : '#e2e8f0'}`,
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      color: isCompleted ? 'white' : '#666', fontWeight: 'bold', fontSize: '14px',
                      transition: 'all 0.3s ease'
                    }}>
                      {isCompleted && currentStageIdx > idx ? '✓' : idx + 1}
                    </div>
                    <span style={{
                      marginTop: '8px', fontSize: '12px', fontWeight: isCurrent ? 'bold' : '500',
                      color: isCurrent ? 'var(--text-dark)' : '#94a3b8'
                    }}>{stage}</span>
                    {isCurrent && (
                      <span style={{ fontSize: '10px', color: getStatusColor(stage), fontWeight: '600', marginTop: '2px', textAlign: 'center' }}>
                        {viewingTrainer.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
                <h4 style={{ marginTop: 0 }}>Application Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px', fontSize: '14px' }}>
                  <div style={{ color: '#64748b' }}>Experience:</div><div>{viewingTrainer.experience} Years</div>
                  <div style={{ color: '#64748b' }}>Skills:</div><div>{viewingTrainer.specialty}</div>
                  <div style={{ color: '#64748b' }}>Location:</div><div>{viewingTrainer.location || 'Not provided'}</div>
                  <div style={{ color: '#64748b' }}>Resume:</div>
                  <div>
                    {viewingTrainer.resume ? (
                      <a 
                        href={viewingTrainer.resume} 
                        download={`Resume_${viewingTrainer.name.replace(/\s+/g, '_')}.pdf`}
                        style={{ color: 'var(--blue-600)', cursor: 'pointer', textDecoration: 'none', fontWeight: '600' }}
                      >📄 Download PDF Resume</a>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>No resume uploaded</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  className="btn-primary"
                  style={{ width: '100%', margin: 0 }}
                  onClick={() => updateTrainerStatus(viewingTrainer.id, 'next')}
                  disabled={viewingTrainer.status === 'Onboarded' || viewingTrainer.status === 'Rejected'}
                >Promote Stage</button>
                <button
                  className="btn-secondary"
                  style={{ width: '100%', margin: 0, color: '#e11d48', borderColor: '#fecdd3' }}
                  onClick={() => updateTrainerStatus(viewingTrainer.id, 'hold')}
                >{viewingTrainer.status === 'Hold' ? 'Release Hold' : 'Hold'}</button>
                <button
                  className="btn-secondary"
                  style={{ width: '100%', margin: 0, color: '#e11d48', border: '1px solid #fecdd3', background: '#fff1f2' }}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to reject this trainer?")) {
                      updateTrainerStatus(viewingTrainer.id, 'reject');
                    }
                  }}
                  disabled={viewingTrainer.status === 'Rejected'}
                >Reject</button>
                <button
                  className="btn-secondary"
                  style={{ width: '100%', margin: 0 }}
                  onClick={() => setViewingTrainerId(null)}
                >Close View</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerApproval;
