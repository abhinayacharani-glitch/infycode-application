import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, X, Upload, Eye, Download, FileText, Video, File, Archive } from 'lucide-react';
import './Materials.css';

const initialBatches = [
  {
    id: 'B1', 
    title: 'JavaScript Fundamentals',
    uploaded: [
      { id: '11', title: 'JavaScript Arrays.docx', size: '0.9 MB', date: 'Apr 3', tag: 'JS', type: 'DOC' },
      { id: '12', title: 'Interview Tips.mp4', size: '84 MB', date: 'Apr 5', tag: 'Interview', type: 'VID' }
    ],
    pending: [
      { id: '13', title: 'Promises' },
      { id: '14', title: 'Async/Await' }
    ]
  },
  {
    id: 'B2', 
    title: 'Node.js',
    uploaded: [
      { id: '21', title: 'React Basics.pdf', size: '3.1 MB', date: 'Mar 28', tag: 'React', type: 'PDF' }
    ],
    pending: [
      { id: '22', title: 'Hooks' },
      { id: '23', title: 'Context API' }
    ]
  },
  {
    id: 'B3', 
    title: 'Interview Prep',
    uploaded: [],
    pending: [
      { id: '31', title: 'React Performance' },
      { id: '32', title: 'Custom Hooks' }
    ]
  },
  {
    id: 'B4', 
    title: 'React.js',
    uploaded: [
      { id: '41', title: 'React Hooks Deep Dive.pdf', size: '2.4 MB', date: 'Apr 9', tag: 'React', type: 'PDF' }
    ],
    pending: [
      { id: '42', title: 'Redux' },
      { id: '43', title: 'Testing' }
    ]
  }
];

const Materials = () => {
  const [batches, setBatches] = useState(initialBatches);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, uploaded, pending

  // Form State
  const [uploadData, setUploadData] = useState({
    title: '',
    batchId: 'B1',
    pendingId: '',
    tag: '',
    fileName: ''
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return <FileText size={18} />;
      case 'VID': return <Video size={18} />;
      case 'DOC': return <File size={18} />;
      case 'ZIP': return <Archive size={18} />;
      default: return <File size={18} />;
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'PDF': return 'type-pdf';
      case 'VID': return 'type-vid';
      case 'DOC': return 'type-doc';
      case 'ZIP': return 'type-zip';
      default: return 'type-doc';
    }
  };

  const calculateProgress = (b) => {
    const active = b.uploaded.length;
    const total = active + b.pending.length;
    if (total === 0) return 0;
    return Math.round((active / total) * 100);
  };

  const openGeneralUpload = () => {
    setUploadData({ title: '', batchId: 'B1', pendingId: '', tag: '', fileName: '' });
    setShowUploadModal(true);
  };

  const openInlineUpload = (batchId, pendingItem) => {
    setUploadData({ 
      title: pendingItem.title, 
      batchId: batchId, 
      pendingId: pendingItem.id, 
      tag: 'New',
      fileName: ''
    });
    setShowUploadModal(true);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const { batchId, pendingId, title, tag } = uploadData;
    
    setBatches(curr => curr.map(b => {
      if (b.id === batchId) {
        let updatedPending = [...b.pending];
        if (pendingId) {
          updatedPending = updatedPending.filter(p => p.id === pendingId ? false : true);
        } else {
          // If general upload, maybe it matches a pending topic?
          const match = updatedPending.find(p => p.title.toLowerCase() === title.toLowerCase());
          if (match) {
            updatedPending = updatedPending.filter(p => p.id !== match.id);
          }
        }

        const fileExt = title.split('.').pop().toLowerCase();
        let type = 'DOC';
        if (['pdf'].includes(fileExt)) type = 'PDF';
        else if (['mp4', 'mov', 'avi'].includes(fileExt)) type = 'VID';
        else if (['zip', 'rar'].includes(fileExt)) type = 'ZIP';
        
        const newItem = {
          id: Date.now().toString(),
          title: title,
          size: '1.5 MB',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          tag: tag || 'General',
          type: type
        };
        return { ...b, uploaded: [...b.uploaded, newItem], pending: updatedPending };
      }
      return b;
    }));
    setShowUploadModal(false);
  };

  const handleDownload = (item) => {
    // Create a dummy link and click it
    const element = document.createElement("a");
    const file = new Blob(["Simulated content for " + item.title], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = item.title;
    document.body.appendChild(element); 
    element.click();
    document.body.removeChild(element);
  };

  // Advanced Filtering Logic
  const filteredBatches = useMemo(() => {
    return batches.map(batch => {
      const filteredUploaded = batch.uploaded.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filteredPending = batch.pending.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Status filters
      const showUploaded = filterStatus === 'all' || filterStatus === 'uploaded';
      const showPending = filterStatus === 'all' || filterStatus === 'pending';

      const finalUploaded = showUploaded ? filteredUploaded : [];
      const finalPending = showPending ? filteredPending : [];

      if (finalUploaded.length === 0 && finalPending.length === 0) return null;

      // If filterStatus is 'uploaded', only return if there are uploaded items
      if (filterStatus === 'uploaded' && finalUploaded.length === 0) return null;
      // If filterStatus is 'pending', only return if there are pending items
      if (filterStatus === 'pending' && finalPending.length === 0) return null;

      return { ...batch, uploaded: finalUploaded, pending: finalPending };
    }).filter(Boolean);
  }, [batches, searchQuery, filterStatus]);

  // Derived state for Modal topic dropdown
  const selectedBatchPendingTopics = useMemo(() => {
    const selectedBatch = batches.find(b => b.id === uploadData.batchId);
    return selectedBatch ? selectedBatch.pending : [];
  }, [batches, uploadData.batchId]);

  return (
    <div className="materials-page-wrapper">
      
      {/* Header Row */}
      <div className="mat-header-row">
        <div>
          <h1 className="mat-page-title">Course Materials</h1>
          <p className="mat-page-subtitle">Upload and manage course content</p>
        </div>
        
        <div className="mat-controls">
          <div className="mat-search-box">
            <Search size={16} />
            <input 
              type="text" 
              className="mat-input-field" 
              placeholder="Search by file or topic..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mat-filter-wrapper">
            <span className="mat-filter-label">All Status</span>
            <select 
              className="mat-select-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="uploaded">Uploaded</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button className="mat-btn-primary header-btn" onClick={openGeneralUpload}>
            <Plus size={16} /> Upload General
          </button>
        </div>
      </div>

      {/* 2-Column Batch Grid */}
      <div className="mat-batch-grid">
        {filteredBatches.map((batch, idx) => {
          const progress = calculateProgress(batch);
          const showUploaded = filterStatus === 'all' || filterStatus === 'uploaded';
          const showPending = filterStatus === 'all' || filterStatus === 'pending';
          
          return (
            <div key={batch.id} className="mat-batch-card" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="mat-batch-header">
                <h2 className="mat-batch-title">{batch.id} – {batch.title}</h2>
                <div className="mat-progress-wrapper">
                  <div className="mat-progress-label">
                    <span>{batch.uploaded.length} / {batch.uploaded.length + batch.pending.length} Topics Uploaded</span>
                  </div>
                  <div className="mat-progress-track">
                    <div className="mat-progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mat-batch-body">
                {/* Uploaded Section */}
                {showUploaded && batch.uploaded.length > 0 && (
                  <div className="mat-section">
                    <h3 className="mat-section-title">Uploaded</h3>
                    <div className="mat-item-list">
                      {batch.uploaded.map(item => (
                        <div key={item.id} className="mat-uploaded-item">
                          <div className="mat-item-left">
                            <div className={`mat-icon-type ${getTypeClass(item.type)}`}>
                              {getTypeIcon(item.type)}
                            </div>
                            <div className="mat-item-info">
                              <div className="mat-item-name">{item.title}</div>
                              <div className="mat-item-meta">
                                <span>{item.size} • {item.date}</span>
                                <span className="mat-tag">{item.tag}</span>
                              </div>
                            </div>
                          </div>
                          <div className="mat-item-actions">
                            <button className="mat-btn-action" onClick={() => setPreviewItem(item)}>
                              <Eye size={16} /> View
                            </button>
                            <button className="mat-btn-action download" onClick={() => handleDownload(item)}>
                              <Download size={16} /> Down
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pending Section */}
                {showPending && batch.pending.length > 0 && (
                  <div className="mat-section">
                    <h3 className="mat-section-title">Pending Topics</h3>
                    <div className="mat-item-list">
                      {batch.pending.map(item => (
                        <div key={item.id} className="mat-pending-item">
                          <div className="mat-pending-info">
                            <div className="mat-pending-name">{item.title}</div>
                            <span className="mat-pending-label">(Pending)</span>
                          </div>
                          <button className="mat-btn-primary mat-btn-xs" onClick={() => openInlineUpload(batch.id, item)}>
                            Upload
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {batch.uploaded.length === 0 && batch.pending.length === 0 && (
                  <div className="mat-empty-section">No materials found matching your criteria.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBatches.length === 0 && (
        <div className="mat-empty-global">
          <div className="mat-empty-icon">📁</div>
          <p>No materials found matching your search or filters.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="mat-overlay">
          <div className="mat-modal animate-pop">
            <div className="mat-modal-title">
              <span>{uploadData.pendingId ? 'Complete Topic Upload' : 'Upload Material'}</span>
              <button className="mat-btn-close" onClick={() => setShowUploadModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUploadSubmit}>
              <div className="mat-form-grid">
                <div className="mat-form-group">
                  <label>Batch</label>
                  <select 
                    className="mat-select-field width-full" 
                    value={uploadData.batchId}
                    onChange={(e) => setUploadData({...uploadData, batchId: e.target.value, pendingId: ''})}
                    disabled={!!uploadData.pendingId}
                  >
                    {batches.map(b => <option key={b.id} value={b.id}>{b.id} – {b.title}</option>)}
                  </select>
                </div>
                
                <div className="mat-form-group">
                  <label>Topic</label>
                  <select 
                    className="mat-select-field width-full" 
                    value={uploadData.pendingId}
                    onChange={(e) => {
                      const selected = selectedBatchPendingTopics.find(p => p.id === e.target.value);
                      setUploadData({...uploadData, pendingId: e.target.value, title: selected ? selected.title : uploadData.title});
                    }}
                    disabled={!!uploadData.pendingId}
                  >
                    <option value="">Select Topic</option>
                    {selectedBatchPendingTopics.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
              </div>

              <div className="mat-form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="mat-input-field" 
                  value={uploadData.title}
                  onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                  placeholder="e.g. JavaScript Arrays Deep Dive"
                  required 
                />
              </div>

              <div className="mat-form-group">
                <label>Tag (Optional)</label>
                <input 
                  type="text" 
                  className="mat-input-field" 
                  value={uploadData.tag}
                  onChange={(e) => setUploadData({...uploadData, tag: e.target.value})}
                  placeholder="e.g. JS, React, Interview"
                />
              </div>

              <div className="mat-form-group">
                <label>Upload File</label>
                <div className="mat-file-input-wrapper">
                   <input 
                    type="file" 
                    className="mat-file-input" 
                    onChange={(e) => setUploadData({...uploadData, fileName: e.target.files[0]?.name})}
                    required 
                   />
                   <div className="mat-file-placeholder">
                    <Upload size={18} /> 
                    {uploadData.fileName || 'Choose file...'}
                   </div>
                </div>
              </div>

              <div className="mat-modal-footer">
                <button type="button" className="mat-btn-cancel" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="mat-btn-primary">Submit & Upload</button>
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
              <span>File Preview: {previewItem.title}</span>
              <button className="mat-btn-close" onClick={() => setPreviewItem(null)}><X size={20} /></button>
            </div>
            <div className="mat-preview-content">
              <div className="mat-preview-placeholder">
                <div className={`mat-preview-icon ${getTypeClass(previewItem.type)}`}>
                  {previewItem.type === 'VID' ? <Video size={80} /> : <FileText size={80} />}
                </div>
                <h4 className="mat-preview-title">{previewItem.title}</h4>
                <p>This is a simulated preview of the uploaded content.</p>
                <div className="mat-preview-meta">
                   <div className="mat-meta-badge"><span>Size:</span> {previewItem.size}</div>
                   <div className="mat-meta-badge"><span>Type:</span> {previewItem.type}</div>
                   <div className="mat-meta-badge"><span>Date:</span> {previewItem.date}</div>
                </div>
              </div>
              <div className="mat-modal-footer">
                <button className="mat-btn-primary" onClick={() => handleDownload(previewItem)}>
                  <Download size={16} /> Download Copy
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
