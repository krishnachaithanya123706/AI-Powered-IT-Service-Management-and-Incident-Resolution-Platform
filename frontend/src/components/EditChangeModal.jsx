import React, { useState } from 'react';
import { X, GitPullRequest } from 'lucide-react';

export default function EditChangeModal({ change, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: change.title || '',
    risk_level: change.risk_level || 'Medium',
    implementation_date: change.implementation_date || new Date().toISOString().split('T')[0],
    assigned_lead: change.assigned_lead || 'Lead Architect',
    cab_approval: change.cab_approval || 'Pending Review',
    status: change.status || 'Planning'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit(change._id || change.id, formData);
      onClose();
    } catch (err) {
      alert('Error updating RFC: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <GitPullRequest size={18} color="var(--accent-purple)" />
            <h3 className="modal-title">Edit Change Request ({change.change_number})</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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
                <label className="form-label">Risk Assessment</label>
                <select
                  className="form-select"
                  value={formData.risk_level}
                  onChange={(e) => setFormData({ ...formData, risk_level: e.target.value })}
                >
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Target Implementation Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.implementation_date}
                  onChange={(e) => setFormData({ ...formData, implementation_date: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">CAB Board Approval</label>
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

              <div className="form-group">
                <label className="form-label">RFC Lifecycle Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Planning">Planning</option>
                  <option value="In Review">In Review</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
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

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update RFC'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
