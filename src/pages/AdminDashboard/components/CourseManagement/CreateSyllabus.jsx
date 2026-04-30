import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  BookOpen, 
  List, 
  CheckCircle2, 
  Send, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAdmin } from '../../../../context/AdminContext';
import './CreateSyllabus.css';

const CreateSyllabus = ({ onSyllabusPublished }) => {
  const { addSyllabus } = useAdmin();
  const [title, setTitle] = useState('');
  const [modules, setModules] = useState([
    { name: '', topics: [''] }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddModule = () => {
    setModules([...modules, { name: '', topics: [''] }]);
  };

  const handleRemoveModule = (index) => {
    if (modules.length > 1) {
      const newModules = modules.filter((_, i) => i !== index);
      setModules(newModules);
    }
  };

  const handleModuleChange = (index, value) => {
    const newModules = [...modules];
    newModules[index].name = value;
    setModules(newModules);
  };

  const handleAddTopic = (moduleIndex) => {
    const newModules = [...modules];
    newModules[moduleIndex].topics.push('');
    setModules(newModules);
  };

  const handleRemoveTopic = (moduleIndex, topicIndex) => {
    if (modules[moduleIndex].topics.length > 1) {
      const newModules = [...modules];
      newModules[moduleIndex].topics = newModules[moduleIndex].topics.filter((_, i) => i !== topicIndex);
      setModules(newModules);
    }
  };

  const handleTopicChange = (moduleIndex, topicIndex, value) => {
    const newModules = [...modules];
    newModules[moduleIndex].topics[topicIndex] = value;
    setModules(newModules);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Syllabus title is required');
      return;
    }
    
    // Validate modules
    const isValid = modules.every(m => m.name.trim() && m.topics.every(t => t.trim()));
    if (!isValid) {
      setError('Please fill in all module names and sub-topics');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await addSyllabus({ title, modules });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setModules([{ name: '', topics: [''] }]);
        if (onSyllabusPublished) onSyllabusPublished();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to publish syllabus');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="cs-success-card">
        <div className="cs-success-icon"><CheckCircle2 size={48} /></div>
        <h3>Syllabus Published!</h3>
        <p>Your new syllabus "{title}" has been saved and is ready to use.</p>
      </div>
    );
  }

  return (
    <div className="cs-container">
      <div className="cs-header">
        <div className="cs-header-info">
          <BookOpen className="cs-header-icon" size={24} />
          <div>
            <h2>Syllabus Builder</h2>
            <p>Design a structured curriculum for your courses</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="cs-form">
        {error && (
          <div className="cs-error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="cs-section">
          <label className="cs-label">
            <FileText size={16} /> Syllabus Title
          </label>
          <input
            type="text"
            className="cs-input cs-title-input"
            placeholder="e.g., Full Stack Development 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="cs-modules-list">
          {modules.map((module, mIdx) => (
            <div key={mIdx} className="cs-module-card">
              <div className="cs-module-header">
                <div className="cs-module-number">Module {mIdx + 1}</div>
                <button 
                  type="button" 
                  className="cs-remove-btn"
                  onClick={() => handleRemoveModule(mIdx)}
                  title="Remove Module"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="cs-field">
                <label className="cs-label small">Module Name</label>
                <input
                  type="text"
                  className="cs-input"
                  placeholder="e.g., Introduction to React"
                  value={module.name}
                  onChange={(e) => handleModuleChange(mIdx, e.target.value)}
                  required
                />
              </div>

              <div className="cs-topics-section">
                <label className="cs-label small">Sub-topics</label>
                {module.topics.map((topic, tIdx) => (
                  <div key={tIdx} className="cs-topic-row">
                    <div className="cs-topic-bullet" />
                    <input
                      type="text"
                      className="cs-input cs-topic-input"
                      placeholder={`Topic ${tIdx + 1}`}
                      value={topic}
                      onChange={(e) => handleTopicChange(mIdx, tIdx, e.target.value)}
                      required
                    />
                    <button 
                      type="button" 
                      className="cs-remove-topic"
                      onClick={() => handleRemoveTopic(mIdx, tIdx)}
                    >
                      <Plus size={14} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className="cs-add-topic-btn"
                  onClick={() => handleAddTopic(mIdx)}
                >
                  <Plus size={14} /> Add Sub-topic
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cs-actions">
          <button 
            type="button" 
            className="cs-add-module-btn"
            onClick={handleAddModule}
          >
            <Plus size={18} /> Add More Modules
          </button>
          
          <button 
            type="submit" 
            className="cs-publish-btn"
            disabled={submitting}
          >
            {submitting ? 'Publishing...' : (
              <>
                <Send size={18} /> Publish Syllabus
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSyllabus;
