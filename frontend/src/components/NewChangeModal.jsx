import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function NewChangeModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    risk_level: 'Medium',
    implementation_date: new Date().toISOString().split('T')[0],
    assigned_lead: 'DevOps Team'
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
          <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1e293b' }}>Submit Change Request (RFC)</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Change Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Upgrade Database Server or OS Patching"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Risk Level</label>
              <select
                className="form-select"
                value={formData.risk_level}
                onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Implementation Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.implementation_date}
                onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit RFC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
