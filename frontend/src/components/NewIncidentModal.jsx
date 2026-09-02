import React, { useState } from 'react';
import { X, AlertCircle, Plus } from 'lucide-react';

export default function NewIncidentModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    reporter: 'IT Support Engineer',
    impacted_service: 'API Gateway Ingress'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert('Error creating incident: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertCircle size={18} color="var(--accent-rose)" />
            <h3 className="modal-title">Create Incident Ticket</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Incident Summary Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 504 Gateway Timeout on Payment Processing Service"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Incident Symptom Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Detailed log snippets, error messages, and customer impact..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Database">Database</option>
                  <option value="Security & Identity">Security & Identity</option>
                  <option value="Application & API">Application & API</option>
                  <option value="Network Desk">Network Desk</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Impacted Service Component</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.impacted_service}
                  onChange={(e) => setFormData({ ...formData, impacted_service: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reporter Name / System Alert</label>
              <input
                type="text"
                className="form-input"
                value={formData.reporter}
                onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Plus size={16} />
              <span>{loading ? 'Creating...' : 'Create Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
