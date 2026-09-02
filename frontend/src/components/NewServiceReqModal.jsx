import React, { useState } from 'react';
import { X, ShoppingBag, Plus } from 'lucide-react';

export default function NewServiceReqModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Access Management',
    requested_by: 'Alex Rivera',
    urgency: 'Medium'
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
      alert('Error creating service request: ' + err.message);
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
            <h3 className="modal-title">Submit Service Request</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Request Summary *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. AWS Production IAM Developer Role Access"
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
                  <option value="High">High Urgency</option>
                  <option value="Medium">Medium Urgency</option>
                  <option value="Low">Low Urgency</option>
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
              <Plus size={16} />
              <span>{loading ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
