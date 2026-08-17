import React, { useState } from 'react';
import { X, GitPullRequest } from 'lucide-react';

export default function EditChangeModal({ change, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: change.title || '',
    risk_level: change.risk_level || 'Medium',
    cab_approval: change.cab_approval || 'Pending Review',
    implementation_date: change.implementation_date || new Date().toISOString().split('T')[0],
    assigned_lead: change.assigned_lead || '',
    status: change.status || 'Planning'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit(change.id, formData);
      onClose();
    } catch (err) {
      alert('Error updating change request: ' + err.message);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#1e293b' }}>
            <GitPullRequest size={18} color="#2563eb" />
            <span>Edit Change Request RFC ({change.change_number})</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">RFC Title *</label>
              <input
                type="text"
                className="form-input"
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
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">CAB Approval</label>
                <select
                  className="form-select"
                  value={formData.cab_approval}
                  onChange={(e) => setFormData({ ...formData, cab_approval: e.target.value })}
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Target Implementation Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.implementation_date}
                  onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">RFC Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Review">In Review</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Rolled Back">Rolled Back</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned Lead Architect</label>
              <input
                type="text"
                className="form-input"
                value={formData.assigned_lead}
                onChange={(e) => setFormData({ ...formData, assigned_lead: e.target.value })}
              />
            </div>
          </div>

          <div style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem'
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save RFC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
