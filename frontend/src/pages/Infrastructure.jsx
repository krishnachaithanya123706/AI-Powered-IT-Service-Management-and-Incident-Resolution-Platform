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
      await api.deleteAsset(deletingAsset.id);
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
      alert(`Alert simulated for server! Created incident ticket ${res.ticketNumber}`);
      await loadAssets();
      if (onAlertSimulated) onAlertSimulated();
      if (onMetricsUpdate) onMetricsUpdate();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e293b' }}>
            IT Infrastructure & Assets
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Manage, monitor, edit, and provision enterprise IT servers, DBs, and network nodes
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsNewAssetOpen(true)}>
          <Plus size={16} /> Add New Asset
        </button>
      </div>

      <div className="basic-card">
        {loading ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>Loading assets...</div>
        ) : assets.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No infrastructure assets configured. Click "Add New Asset" to create one.
          </div>
        ) : (
          <div className="table-container">
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Asset Tag</th>
                  <th>Server Name</th>
                  <th>Type</th>
                  <th>Environment</th>
                  <th>IP Address</th>
                  <th>CPU / Mem</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => (
                  <tr key={asset.id}>
                    <td style={{ fontWeight: 600, color: '#64748b' }}>{asset.asset_tag}</td>
                    <td style={{ fontWeight: 500, color: '#1e293b' }}>{asset.name}</td>
                    <td style={{ color: '#475569' }}>{asset.type}</td>
                    <td>{asset.environment}</td>
                    <td style={{ fontFamily: 'monospace' }}>{asset.ip_address}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      CPU {asset.cpu_usage ?? 0}% | RAM {asset.memory_usage ?? 0}%
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
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                          title="Simulate Alert"
                          onClick={() => handleSimulateAlert(asset.id)}
                        >
                          <AlertTriangle size={12} color="#dc2626" /> Alert
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', color: '#2563eb' }}
                          title="Edit Asset"
                          onClick={() => setEditingAsset(asset)}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', color: '#dc2626' }}
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
          </div>
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
