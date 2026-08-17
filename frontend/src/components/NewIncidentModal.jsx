import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function NewIncidentModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Infrastructure',
    reporter: 'IT Support',
    impacted_service: 'Core Network'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>Report New Incident</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Incident Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Server connection timeout or database slowdown"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Impacted Service</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Payment API"
                value={formData.impacted_service}
                onChange={(e) => setFormData({ ...formData, impacted_service: e.target.value })}
              />
            </div>

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
                <option value="Network Operations">Network Operations</option>
                <option value="Application">Application</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Error Details</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Provide brief details about the issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Submit Incident'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
