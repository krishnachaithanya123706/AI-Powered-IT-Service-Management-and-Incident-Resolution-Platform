import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Server, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import NewAssetModal from '../components/NewAssetModal';
import EditAssetModal from '../components/EditAssetModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function Infrastructure({ onAlertSimulated, onMetricsUpdate }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isNewAssetOpen, setIsNewAssetOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [deletingAsset, setDeletingAsset] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await api.getAssets();
      setAssets(data);
    } catch (err) {
      console.error('Failed to load assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleCreateAsset = async (formData) => {
    await api.createAsset(formData);
    await loadAssets();
    if (onMetricsUpdate) onMetricsUpdate();
  };

  const handleUpdateAsset = async (id, formData) => {
    await api.updateAsset(id, formData);
    await loadAssets();
    if (onMetricsUpdate) onMetricsUpdate();
  };

  const handleDeleteAsset = async () => {
    if (!deletingAsset) return;
    setDeleteLoading(true);
    try {
      await api.deleteAsset(deletingAsset._id || deletingAsset.id);
      setDeletingAsset(null);
      await loadAssets();
      if (onMetricsUpdate) onMetricsUpdate();
    } catch (err) {
      alert('Failed to delete asset: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSimulateAlert = async (assetId) => {
    try {
      const res = await api.simulateAssetAlert(assetId);
      alert(`Alert simulated for server node! Triggered incident ticket ${res.ticketNumber}`);
      await loadAssets();
      if (onAlertSimulated) onAlertSimulated();
      if (onMetricsUpdate) onMetricsUpdate();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Server size={24} color="var(--accent-cyan)" />
            <span>IT Infrastructure & Asset Telemetry</span>
          </h1>
          <p className="page-subtitle">
            Real-time server node metrics, hardware health monitoring, and interactive fault simulation.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsNewAssetOpen(true)}>
          <Plus size={16} /> Add IT Asset
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading IT assets...</div>
        ) : assets.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No infrastructure assets configured. Click "Add IT Asset" to create one.
          </div>
        ) : (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Server Hostname</th>
                <th>Type</th>
                <th>Environment</th>
                <th>IP Address</th>
                <th>Telemetry Utilization</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset._id || asset.id}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{asset.asset_tag}</td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{asset.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{asset.type}</td>
                  <td>
                    <span className="badge badge-cyan">{asset.environment}</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{asset.ip_address}</td>
                  <td style={{ fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CPU: {asset.cpu_usage ?? 0}%</span>
                      <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                        <div style={{ height: '100%', width: `${asset.cpu_usage ?? 0}%`, background: asset.cpu_usage > 85 ? 'var(--accent-rose)' : 'var(--accent-cyan)', borderRadius: '2px' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      asset.status === 'Healthy' ? 'badge-healthy' :
                      asset.status === 'Warning' ? 'badge-warning' : 'badge-critical'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
                        title="Simulate Fault Alert"
                        onClick={() => handleSimulateAlert(asset._id || asset.id)}
                      >
                        <AlertTriangle size={12} /> Fault Alert
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-cyan)' }}
                        title="Edit Asset"
                        onClick={() => setEditingAsset(asset)}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
                        title="Delete Asset"
                        onClick={() => setDeletingAsset(asset)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Asset Modal */}
      {isNewAssetOpen && (
        <NewAssetModal
          onClose={() => setIsNewAssetOpen(false)}
          onSubmit={handleCreateAsset}
        />
      )}

      {/* Edit Asset Modal */}
      {editingAsset && (
        <EditAssetModal
          asset={editingAsset}
          onClose={() => setEditingAsset(null)}
          onSubmit={handleUpdateAsset}
        />
      )}

      {/* Delete Confirm Modal */}
      {deletingAsset && (
        <ConfirmDeleteModal
          title="Delete Infrastructure Asset"
          itemType="Asset"
          itemName={`${deletingAsset.asset_tag} (${deletingAsset.name})`}
          onClose={() => setDeletingAsset(null)}
          onConfirm={handleDeleteAsset}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
