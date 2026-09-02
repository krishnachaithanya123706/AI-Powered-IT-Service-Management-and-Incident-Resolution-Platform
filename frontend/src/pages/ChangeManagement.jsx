import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, GitPullRequest, Edit2, Trash2, Check } from 'lucide-react';
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
      await api.deleteChangeRequest(deletingChange._id || deletingChange.id);
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
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <GitPullRequest size={24} color="var(--accent-purple)" />
            <span>Change Advisory Board (CAB) & RFC Portal</span>
          </h1>
          <p className="page-subtitle">
            Request for Change (RFC) tracking, risk assessment scoring, and deployment approvals.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewChange}>
          <Plus size={16} /> Submit Change (RFC)
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading change requests...</div>
        ) : changes.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No change requests found. Click "Submit Change (RFC)" to submit one.
          </div>
        ) : (
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
                <tr key={chg._id || chg.id}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-purple)' }}>{chg.change_number}</td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{chg.title}</td>
                  <td>
                    <span className={`badge ${chg.risk_level === 'High' ? 'badge-high' : 'badge-medium'}`}>
                      {chg.risk_level}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{chg.implementation_date}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{chg.assigned_lead}</td>
                  <td>
                    <span className={`badge ${chg.cab_approval === 'Approved' ? 'badge-healthy' : 'badge-open'}`}>
                      {chg.cab_approval}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{chg.status}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {chg.cab_approval !== 'Approved' && (
                        <button
                          className="btn btn-success btn-sm"
                          title="Approve RFC"
                          onClick={() => handleApprove(chg._id || chg.id)}
                        >
                          <Check size={12} /> Approve
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-cyan)' }}
                        title="Edit RFC"
                        onClick={() => setEditingChange(chg)}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
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
