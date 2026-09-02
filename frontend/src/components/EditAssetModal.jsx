import React, { useState } from 'react';
import { X, Server } from 'lucide-react';

export default function EditAssetModal({ asset, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: asset.name || '',
    type: asset.type || 'Kubernetes Cluster',
    environment: asset.environment || 'Production',
    ip_address: asset.ip_address || '10.0.0.1',
    status: asset.status || 'Healthy',
    cpu_usage: asset.cpu_usage ?? 25,
    memory_usage: asset.memory_usage ?? 40
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setLoading(true);
    try {
      await onSubmit(asset._id || asset.id, formData);
      onClose();
    } catch (err) {
      alert('Error updating asset: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Server size={18} color="var(--accent-cyan)" />
            <h3 className="modal-title">Edit Asset ({asset.asset_tag})</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Server Hostname / Asset Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Asset Type</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Kubernetes Cluster">Kubernetes Cluster</option>
                  <option value="DB Cluster (PostgreSQL)">DB Cluster (PostgreSQL)</option>
                  <option value="API Gateway">API Gateway</option>
                  <option value="In-Memory Cache">In-Memory Cache</option>
                  <option value="Auth Bridge">Auth Bridge</option>
                  <option value="Virtual Machine">Virtual Machine</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Environment</label>
                <select
                  className="form-select"
                  value={formData.environment}
                  onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                >
                  <option value="Production">Production</option>
                  <option value="Staging">Staging</option>
                  <option value="Development">Development</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">IP Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ip_address}
                  onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Health Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">CPU Usage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  value={formData.cpu_usage}
                  onChange={(e) => setFormData({ ...formData, cpu_usage: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">RAM Usage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-input"
                  value={formData.memory_usage}
                  onChange={(e) => setFormData({ ...formData, memory_usage: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Update Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
