import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, Check } from 'lucide-react';
import EditChangeModal from '../components/EditChangeModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function ChangeManagement({ onOpenNewChange }) {
  const [changes, setChanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit & Delete states
  const [editingChange, setEditingChange] = useState(null);
  const [deletingChange, setDeletingChange] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadChanges = async () => {
    try {
      setLoading(true);
      const data = await api.getChangeRequests();
      setChanges(data);
    } catch (err) {
      console.error('Failed to load changes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChanges();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.updateChangeRequest(id, { cab_approval: 'Approved', status: 'Scheduled' });
      await loadChanges();
    } catch (err) {
      alert('Error approving change: ' + err.message);
    }
  };

  const handleUpdateChange = async (id, formData) => {
    await api.updateChangeRequest(id, formData);
    await loadChanges();
  };

  const handleDeleteChange = async () => {
    if (!deletingChange) return;
    setDeleteLoading(true);
    try {
      await api.deleteChangeRequest(deletingChange.id);
      setDeletingChange(null);
      await loadChanges();
    } catch (err) {
      alert('Failed to delete change request: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e293b' }}>
            Change Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Submit, review, edit, approve, and track system infrastructure change requests (RFC)
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewChange}>
          <Plus size={16} /> Submit Change (RFC)
        </button>
      </div>

      <div className="basic-card">
        {loading ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>Loading changes...</div>
        ) : changes.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No change requests found. Click "Submit Change (RFC)" to create one.
          </div>
        ) : (
          <div className="table-container">
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Change ID</th>
                  <th>Title</th>
                  <th>Risk Level</th>
                  <th>Target Date</th>
                  <th>Assigned Lead</th>
                  <th>CAB Approval</th>
                  <th>RFC Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {changes.map(chg => (
                  <tr key={chg.id}>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{chg.change_number}</td>
                    <td style={{ fontWeight: 500 }}>{chg.title}</td>
                    <td>
                      <span className={`badge ${chg.risk_level === 'High' ? 'badge-high' : 'badge-medium'}`}>
                        {chg.risk_level}
                      </span>
                    </td>
                    <td>{chg.implementation_date}</td>
                    <td>{chg.assigned_lead}</td>
                    <td>
                      <span className={`badge ${chg.cab_approval === 'Approved' ? 'badge-resolved' : 'badge-open'}`}>
                        {chg.cab_approval}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, color: '#475569' }}>{chg.status}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {chg.cab_approval !== 'Approved' && (
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem' }}
                            title="Approve RFC"
                            onClick={() => handleApprove(chg.id)}
                          >
                            <Check size={12} /> Approve
                          </button>
                        )}
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', color: '#2563eb' }}
                          title="Edit RFC"
                          onClick={() => setEditingChange(chg)}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', color: '#dc2626' }}
                          title="Delete RFC"
                          onClick={() => setDeletingChange(chg)}
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

      {/* Edit Change Modal */}
      {editingChange && (
        <EditChangeModal
          change={editingChange}
          onClose={() => setEditingChange(null)}
          onSubmit={handleUpdateChange}
        />
      )}

      {/* Delete Change Modal */}
      {deletingChange && (
        <ConfirmDeleteModal
          title="Delete Change Request RFC"
          itemType="Change Request"
          itemName={`${deletingChange.change_number}: ${deletingChange.title}`}
          onClose={() => setDeletingChange(null)}
          onConfirm={handleDeleteChange}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
