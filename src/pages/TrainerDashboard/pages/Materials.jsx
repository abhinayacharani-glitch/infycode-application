import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, X, Upload, Eye, Download, FileText, Video, File, Archive, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTrainer } from '../../../context/TrainerContext';
import { getTrainerBatchesAPI, getAllSyllabuses, getBatchMaterialsAPI, uploadMaterialAPI } from '../../../services/api';
import './Materials.css';

const Materials = () => {
  const { trainerData } = useTrainer();
  const [batches, setBatches] = useState([]);
  const [syllabuses, setSyllabuses] = useState([]);
  const [allMaterials, setAllMaterials] = useState({}); // { batchId: [materials] }
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, uploaded, pending
  
  // Form State
  const [uploadData, setUploadData] = useState({
    batchId: '',
    moduleName: '',
    fileName: '',
    file: null
  });

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch Trainer Batches
        const batchesRes = await getTrainerBatchesAPI();
        const fetchedBatches = batchesRes.batches || [];
        setBatches(fetchedBatches);

        // Fetch All Syllabuses
        const syllabusRes = await getAllSyllabuses();
        setSyllabuses(syllabusRes.syllabuses || []);

        // Fetch Materials for each batch
        const materialsMap = {};
        for (const batch of fetchedBatches) {
          const matRes = await getBatchMaterialsAPI(batch.id);
          materialsMap[batch.id] = matRes.materials || [];
        }
        setAllMaterials(materialsMap);

      } catch (err) {
        console.error("Failed to fetch materials data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Logic: Process Batches with Syllabus and Materials
  const processedBatches = useMemo(() => {
    return batches.map(batch => {
      // Find syllabus for this batch's course
      const syllabus = syllabuses.find(s => 
        s.title.toLowerCase().includes(batch.course.toLowerCase()) ||
        batch.course.toLowerCase().includes(s.title.toLowerCase())
      );

      if (!syllabus) return { ...batch, modules: [] };

      const batchMaterials = allMaterials[batch.id] || [];
      
      let foundOngoing = false;
      const modules = syllabus.modules.map((mod, index) => {
        const material = batchMaterials.find(m => m.moduleName === mod.name);
        
        let status = 'pending';
        if (material) {
          status = 'uploaded';
        } else if (!foundOngoing) {
          status = 'ongoing';
          foundOngoing = true;
        }

        return {
          ...mod,
          status,
          material: material || null
        };
      });

      return { ...batch, modules };
    });
  }, [batches, syllabuses, allMaterials]);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        batchId: uploadData.batchId,
        moduleName: uploadData.moduleName,
        fileName: uploadData.fileName || (uploadData.file ? uploadData.file.name : 'Module_Resource.pdf'),
        trainerId: trainerData?.id || trainerData?._id,
        trainerName: trainerData?.fullName || trainerData?.fullname || trainerData?.name || "Trainer"
      };

      await uploadMaterialAPI(payload);

      // Refresh data
      const matRes = await getBatchMaterialsAPI(uploadData.batchId);
      setAllMaterials(prev => ({
        ...prev,
        [uploadData.batchId]: matRes.materials
      }));

      setShowUploadModal(false);
      setUploadData({ batchId: '', moduleName: '', fileName: '', file: null });
      alert("Material uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload material.");
    }
  };

  const openUpload = (batchId, moduleName) => {
    setUploadData({
      batchId,
      moduleName,
      fileName: '',
      file: null
    });
    setShowUploadModal(true);
  };

  const filteredBatches = processedBatches.filter(b => 
    b.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="materials-page-wrapper">Loading Materials...</div>;
  }

  return (
    <div className="materials-page-wrapper">
      <div className="mat-header-container">
        <div className="mat-title-row">
          <h1 className="mat-page-title">Course & Materials</h1>
          <p className="mat-page-subtitle">Manage module-wise resources for your active batches</p>
        </div>

        <div className="mat-controls-row">
          <div className="mat-search-wrapper">
            <div className="mat-search-box">
              <Search size={16} />
              <input
                type="text"
                className="mat-input-field"
                placeholder="Search by batch or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mat-actions-right">
             <div className="mat-filters-group">
                <div className="mat-filter-wrapper">
                  <span className="mat-filter-label">Filter Status</span>
                  <select 
                    className="mat-select-field"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Modules</option>
                    <option value="uploaded">Uploaded Only</option>
                    <option value="ongoing">Ongoing Only</option>
                    <option value="pending">Pending Only</option>
                  </select>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mat-batch-grid">
        {filteredBatches.map((batch, idx) => (
          <div key={batch.id} className="mat-batch-card" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="mat-batch-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 className="mat-batch-title">{batch.course}</h2>
                  <div className="mat-tag" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '12px' }}>
                    Batch: {batch.id}
                  </div>
                </div>
                <div className="mat-progress-wrapper" style={{ width: '120px' }}>
                  <div className="mat-progress-label" style={{ fontSize: '11px' }}>
                    <span>{batch.modules.filter(m => m.status === 'uploaded').length}/{batch.modules.length} Modules</span>
                  </div>
                  <div className="mat-progress-track">
                    <div 
                      className="mat-progress-fill" 
                      style={{ width: `${(batch.modules.filter(m => m.status === 'uploaded').length / batch.modules.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mat-batch-body">
              <div className="mat-section">
                <h3 className="mat-section-title">Course Modules</h3>
                <div className="mat-item-list">
                  {batch.modules.map((mod, mIdx) => {
                    if (filterStatus !== 'all' && mod.status !== filterStatus) return null;

                    return (
                      <div 
                        key={mIdx} 
                        className={`mat-pending-item ${mod.status}`}
                        style={{ 
                          borderStyle: mod.status === 'uploaded' ? 'solid' : 'dashed',
                          background: mod.status === 'ongoing' ? '#eff6ff' : mod.status === 'uploaded' ? '#f0fdf4' : '#f8fafc',
                          borderColor: mod.status === 'ongoing' ? '#3b82f6' : mod.status === 'uploaded' ? '#22c55e' : '#e2e8f0'
                        }}
                      >
                        <div className="mat-pending-info" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {mod.status === 'uploaded' ? <CheckCircle size={16} color="#22c55e" /> : 
                             mod.status === 'ongoing' ? <Clock size={16} color="#3b82f6" /> : 
                             <AlertCircle size={16} color="#94a3b8" />}
                            <div className="mat-pending-name" style={{ color: mod.status === 'pending' ? '#94a3b8' : '#1e293b' }}>
                              {mod.name}
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginLeft: '24px', marginTop: '4px' }}>
                            {mod.topics.slice(0, 3).join(', ')}{mod.topics.length > 3 ? '...' : ''}
                          </div>
                        </div>

                        {mod.status === 'uploaded' ? (
                          <div className="mat-item-actions">
                            <button className="mat-btn-action" onClick={() => setPreviewItem(mod.material)}>
                              <Eye size={16} /> View
                            </button>
                            <button className="mat-btn-action download" onClick={() => window.open(mod.material.fileUrl, '_blank')}>
                              <Download size={16} /> Get
                            </button>
                          </div>
                        ) : mod.status === 'ongoing' ? (
                          <button className="mat-btn-primary mat-btn-xs" onClick={() => openUpload(batch.id, mod.name)}>
                            <Upload size={14} /> Upload PDF
                          </button>
                        ) : (
                          <span className="mat-pending-label">Locked</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="mat-overlay">
          <div className="mat-modal animate-pop">
            <div className="mat-modal-title">
              <span>Upload Module Material</span>
              <button className="mat-btn-close" onClick={() => setShowUploadModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUploadSubmit}>
              <div className="mat-form-group">
                <label>Module Name</label>
                <input
                  type="text"
                  className="mat-input-field"
                  value={uploadData.moduleName}
                  readOnly
                  style={{ background: '#f1f5f9' }}
                />
              </div>

              <div className="mat-form-group">
                <label>Material Title</label>
                <input
                  type="text"
                  className="mat-input-field"
                  value={uploadData.fileName}
                  onChange={(e) => setUploadData({ ...uploadData, fileName: e.target.value })}
                  placeholder="e.g. JavaScript Basics Guide.pdf"
                  required
                />
              </div>

              <div className="mat-form-group">
                <label>Choose PDF File</label>
                <div className="mat-file-input-wrapper">
                  <input
                    type="file"
                    className="mat-file-input"
                    accept=".pdf"
                    onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0], fileName: e.target.files[0]?.name })}
                    required
                  />
                  <div className="mat-file-placeholder">
                    <Upload size={18} />
                    {uploadData.file ? uploadData.file.name : 'Drag or click to upload PDF'}
                  </div>
                </div>
              </div>

              <div className="mat-modal-footer">
                <button type="button" className="mat-btn-cancel" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="mat-btn-primary">Save Material</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="mat-overlay" onClick={() => setPreviewItem(null)}>
          <div className="mat-modal mat-modal-lg animate-pop" onClick={e => e.stopPropagation()}>
            <div className="mat-modal-title">
              <span>Preview: {previewItem.fileName}</span>
              <button className="mat-btn-close" onClick={() => setPreviewItem(null)}><X size={20} /></button>
            </div>
            <div className="mat-preview-content">
              <div className="mat-preview-placeholder">
                <div className={`mat-preview-icon type-pdf`}>
                  <FileText size={80} />
                </div>
                <h4 className="mat-preview-title">{previewItem.fileName}</h4>
                <p>Uploaded on {new Date(previewItem.uploadedAt).toLocaleDateString()}</p>
                <div className="mat-preview-meta">
                  <div className="mat-meta-badge"><span>Size:</span> 1.5 MB</div>
                  <div className="mat-meta-badge"><span>Module:</span> {previewItem.moduleName}</div>
                  <div className="mat-meta-badge"><span>Trainer:</span> {previewItem.trainerName}</div>
                </div>
              </div>
              <div className="mat-modal-footer">
                <button className="mat-btn-primary" onClick={() => window.open(previewItem.fileUrl, '_blank')}>
                  <Download size={16} /> Open Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
