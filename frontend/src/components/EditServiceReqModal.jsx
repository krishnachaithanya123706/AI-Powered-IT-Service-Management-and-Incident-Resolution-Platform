import React, { useState } from 'react';
import { X, ShoppingBag } from 'lucide-react';

export default function EditServiceReqModal({ request, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: request.title || '',
    category: request.category || 'General Service',
    requested_by: request.requested_by || 'Employee User',
    urgency: request.urgency || 'Medium',
    approval_status: request.approval_status || 'Pending Approval',
    status: request.status || 'Submitted'
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setLoading(true);
    try {
      await onSubmit(request._id || request.id, formData);
      onClose();
    } catch (err) {
      alert('Error updating service request: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={18} color="var(--accent-emerald)" />
            <h3 className="modal-title">Edit Request ({request.request_number})</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Request Title *</label>
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
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Access Management">Access Management</option>
                  <option value="Hardware Request">Hardware Request</option>
                  <option value="Software License">Software License</option>
                  <option value="General Service">General Service</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urgency</label>
                <select
                  className="form-select"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Approval Status</label>
                <select
                  className="form-select"
                  value={formData.approval_status}
                  onChange={(e) => setFormData({ ...formData, approval_status: e.target.value })}
                >
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Fulfillment Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Submitted">Submitted</option>
                  <option value="In Fulfillment">In Fulfillment</option>
                  <option value="Fulfilled">Fulfilled</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Requested By</label>
              <input
                type="text"
                className="form-input"
                value={formData.requested_by}
                onChange={(e) => setFormData({ ...formData, requested_by: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
