import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, ShoppingBag, Edit2, Trash2 } from 'lucide-react';
import EditServiceReqModal from '../components/EditServiceReqModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function ServiceCatalog({ onOpenNewRequest }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit & Delete states
  const [editingReq, setEditingReq] = useState(null);
  const [deletingReq, setDeletingReq] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getServiceRequests();
      setRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateReq = async (id, formData) => {
    await api.updateServiceRequest(id, formData);
    await loadRequests();
  };

  const handleDeleteReq = async () => {
    if (!deletingReq) return;
    setDeleteLoading(true);
    try {
      await api.deleteServiceRequest(deletingReq._id || deletingReq.id);
      setDeletingReq(null);
      await loadRequests();
    } catch (err) {
      alert('Failed to delete service request: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShoppingBag size={24} color="var(--accent-emerald)" />
            <span>Service Request Catalog</span>
          </h1>
          <p className="page-subtitle">
            Self-service portal for hardware provisioning, IAM cloud access, and software licensing.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewRequest}>
          <Plus size={16} /> New Service Request
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading service requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No service requests found. Click "New Service Request" to submit one.
          </div>
        ) : (
          <table className="simple-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Requested By</th>
                <th>Urgency</th>
                <th>Approval Status</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req._id || req.id}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{req.request_number}</td>
                  <td style={{ fontWeight: 600, color: '#ffffff' }}>{req.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{req.category}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{req.requested_by}</td>
                  <td>
                    <span className={`badge ${req.urgency === 'High' ? 'badge-high' : 'badge-medium'}`}>
                      {req.urgency || 'Medium'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      req.approval_status === 'Approved' ? 'badge-healthy' :
                      req.approval_status === 'Rejected' ? 'badge-critical' : 'badge-open'
                    }`}>
                      {req.approval_status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{req.status}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-cyan)' }}
                        title="Edit Service Request"
                        onClick={() => setEditingReq(req)}
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
                        title="Delete Service Request"
                        onClick={() => setDeletingReq(req)}
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

      {/* Edit Service Request Modal */}
      {editingReq && (
        <EditServiceReqModal
          request={editingReq}
          onClose={() => setEditingReq(null)}
          onSubmit={handleUpdateReq}
        />
      )}

      {/* Confirm Delete Modal */}
      {deletingReq && (
        <ConfirmDeleteModal
          title="Delete Service Request"
          itemType="Service Request"
          itemName={`${deletingReq.request_number}: ${deletingReq.title}`}
          onClose={() => setDeletingReq(null)}
          onConfirm={handleDeleteReq}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
