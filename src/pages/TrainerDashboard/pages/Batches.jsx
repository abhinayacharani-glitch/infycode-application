import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTrainerBatchesAPI, startBatchAPI } from '../../../services/api';
import {
  Users,
  Layers,
  Clock,
  Monitor,
  Search,
  Plus,
  X,
  Calendar,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import './Batches.css';

// --- HELPERS ---
const calculateDuration = (start, end) => {
  if (!start || !end) return "Unknown";
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e - s);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;

  if (months > 0) {
    return `${months} Month${months > 1 ? 's' : ''}${remainingDays > 0 ? ` ${remainingDays}d` : ''}`;
  }
  return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "Never updated";
  const now = new Date();
  const diff = now - new Date(timestamp);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(timestamp).toLocaleDateString();
};

// Global History Helper
const addHistoryEntry = (batchId, type, title) => {
  const key = `batch_history_v2_${batchId}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  const newEntry = {
    id: Date.now(),
    type, // 'System', 'Session', 'Student'
    title,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(key, JSON.stringify([newEntry, ...existing]));
};

const Batches = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic State for Batches
  const [batches, setBatches] = useState([]);

  const [newBatch, setNewBatch] = useState({
    id: '',
    course: '',
    startDate: '',
    endDate: '',
    mode: 'Online',
    students: ''
  });

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setLoading(true);
        const response = await getTrainerBatchesAPI();
        if (response.success) {
          setBatches(response.batches || []);
        }
      } catch (error) {
        console.error("Error fetching trainer batches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  const handleStartBatch = async (e, firebaseId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to start this batch? All enrolled students will be notified.")) return;

    // Optimistic Update
    const originalBatches = [...batches];
    setBatches(prev => prev.map(b => b.firebaseId === firebaseId ? { ...b, status: 'Active' } : b));

    try {
      const response = await startBatchAPI(firebaseId);
      if (response.success) {
        // Refresh list silently in background to sync with server
        getTrainerBatchesAPI().then(res => {
          if (res.success) setBatches(res.batches || []);
        });
      }
    } catch (error) {
      console.error("Error starting batch:", error);
      // Revert on failure
      setBatches(originalBatches);
      alert(error.message || "Failed to start batch");
    }
  };

  const handleAddBatch = (e) => {
    e.preventDefault();
    // This local add is kept for UI if needed, but admin is the primary source
    const batchToAdd = {
      ...newBatch,
      students: parseInt(newBatch.students) || 0,
      lastUpdated: new Date().toISOString()
    };

    setBatches([...batches, batchToAdd]);
    addHistoryEntry(batchToAdd.id, 'System', `Batch ${batchToAdd.id} created`);

    setShowModal(false);
    setNewBatch({ id: '', course: '', startDate: '', endDate: '', mode: 'Online', students: '' });
  };

  const filteredBatches = batches.filter(b =>
    (b.course || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = batches.reduce((acc, b) => acc + (parseInt(b.students) || 0), 0);

  return (
    <div className="batches-page-production">
      <div className="main-content">
        {/* 0. HEADER */}
        <div className="batches-header">
          <h1 className="batches-title">Batches</h1>
          <p className="batches-subtitle">Overview of all your active and upcoming batches</p>
        </div>

        {/* 1. KPI SECTION */}
        <div className="batches-kpi-row-saas">
          <div className="kpi-card-saas blue">
            <div className="kpi-icon-saas"><Layers size={22} /></div>
            <div className="kpi-content-saas">
              <div className="kpi-val-row-saas">
                <h3 className="kpi-value-saas">{batches.length}</h3>
                <span className="kpi-trend-saas"><TrendingUp size={12} /> +1 this week</span>
              </div>
              <p className="kpi-label-saas">Total Batches</p>
            </div>
          </div>
          <div className="kpi-card-saas green">
            <div className="kpi-icon-saas"><Users size={22} /></div>
            <div className="kpi-content-saas">
              <div className="kpi-val-row-saas">
                <h3 className="kpi-value-saas">{totalStudents}</h3>
                <span className="kpi-trend-saas"><TrendingUp size={12} /> +12 this month</span>
              </div>
              <p className="kpi-label-saas">Total Students</p>
            </div>
          </div>
        </div>

        {/* 2. ACTIONS HEADER */}
        <div className="batches-actions-header-saas">
          <div className="search-bar-saas">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search your batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-add-batch-saas" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            <span>New Batch</span>
          </button>
        </div>

        {/* 3. BATCH CARDS GRID */}
        <div className="batches-grid-saas">
          {loading ? (
            <div className="loading-state-saas">Loading batches...</div>
          ) : filteredBatches.length > 0 ? (
            filteredBatches.map((batch) => (
              <div
                key={batch.id}
                className="batch-card-saas-v3"
                onClick={() => navigate(`/trainer-dashboard/batches/${batch.id}`)}
              >
                <div className="batch-card-accent-border"></div>

                <div className="batch-card-body-saas">
                  <div className="batch-card-header-v3">
                    <span className="batch-id-pill-v3">{batch.id}</span>
                    <span className="last-updated-saas">{formatTimeAgo(batch.lastUpdated)}</span>
                  </div>

                  <h2 className="batch-card-title-v3">{batch.course}</h2>

                  <div className="batch-item-details">
                    <div className="detail">
                      <span className="label">Starts</span>
                      <span className="value">
                        {batch.startDateTime ?
                          new Date(batch.startDateTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : (batch.name && batch.name.includes(' - ')) ? batch.name.split(' - ').pop() : "-"
                        }
                      </span>
                    </div>
                    <div className="detail">
                      <span className="label">Students</span>
                      <span className="value">{batch.students || batch.enrolled || 0} / {batch.capacity || 30} Seats</span>
                    </div>
                  </div>

                  <div className="batch-card-meta-v3">
                    <div className="meta-item-saas">
                      {batch.mode === 'Offline' ? <Users size={14} /> : <Monitor size={14} />}
                      <span>{batch.duration} - {batch.mode || "Online"}</span>
                    </div>
                  </div>

                  <div className="card-divider-saas"></div>

                  <div className="batch-card-footer-v3">
                    <div className="footer-left-saas">
                      <span className="view-details-v3">View Overview</span>
                      <ArrowRight size={16} />
                    </div>

                    <div className="footer-actions-saas">
                      {batch.status === 'Ready' && (
                        <button
                          className="btn-start-batch-action"
                          onClick={(e) => handleStartBatch(e, batch.firebaseId)}
                        >
                          Start Batch
                        </button>
                      )}
                      {batch.status === 'Active' && (
                        <button
                          className="btn-connect-students-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/trainer-dashboard/student-connect/${batch.id}`);
                          }}
                        >
                          Connect Students
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-saas">No batches found for you.</div>
          )}
        </div>

        {/* 4. NEW BATCH MODAL */}
        {showModal && (
          <div className="modal-overlay-saas">
            <div className="modal-content-saas">
              <div className="modal-header-saas">
                <h2 className="modal-title-saas">Create New Batch</h2>
                <button className="close-btn-saas" onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>

              <form className="modal-form-saas" onSubmit={handleAddBatch}>
                <div className="form-grid-saas">
                  <div className="form-group-saas">
                    <label>Batch ID</label>
                    <input type="text" placeholder="e.g. B5" value={newBatch.id} onChange={e => setNewBatch({ ...newBatch, id: e.target.value })} required />
                  </div>
                  <div className="form-group-saas full">
                    <label>Course Name</label>
                    <input type="text" placeholder="Full Stack Web Dev" value={newBatch.course} onChange={e => setNewBatch({ ...newBatch, course: e.target.value })} required />
                  </div>
                  <div className="form-group-saas">
                    <label>Start Date</label>
                    <input type="date" value={newBatch.startDate} onChange={e => setNewBatch({ ...newBatch, startDate: e.target.value })} required />
                  </div>
                  <div className="form-group-saas">
                    <label>End Date</label>
                    <input type="date" value={newBatch.endDate} onChange={e => setNewBatch({ ...newBatch, endDate: e.target.value })} required />
                  </div>
                  <div className="form-group-saas">
                    <label>Students Count</label>
                    <input type="number" placeholder="0" value={newBatch.students} onChange={e => setNewBatch({ ...newBatch, students: e.target.value })} required />
                  </div>
                  <div className="form-group-saas">
                    <label>Mode</label>
                    <select value={newBatch.mode} onChange={e => setNewBatch({ ...newBatch, mode: e.target.value })}>
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div className="modal-actions-saas">
                  <button type="button" className="btn-cancel-saas" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn-submit-saas">Create Batch</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Batches;
