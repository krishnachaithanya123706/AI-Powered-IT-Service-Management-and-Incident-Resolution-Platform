import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';
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
      await api.deleteServiceRequest(deletingReq.id);
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e293b' }}>
            Service Request Catalog
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Submit, track, edit, and manage user requests for hardware, access, and software licenses
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewRequest}>
          <Plus size={16} /> New Request
        </button>
      </div>

      <div className="basic-card">
        {loading ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No service requests found. Click "New Request" to create one.
          </div>
        ) : (
          <div className="table-container">
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Requested By</th>
                  <th>Urgency</th>
                  <th>Approval</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td style={{ fontWeight: 600, color: '#16a34a' }}>{req.request_number}</td>
                    <td style={{ fontWeight: 500 }}>{req.title}</td>
                    <td style={{ color: '#64748b' }}>{req.category}</td>
                    <td>{req.requested_by}</td>
                    <td>
                      <span className={`badge ${req.urgency === 'High' ? 'badge-high' : 'badge-medium'}`}>
                        {req.urgency || 'Medium'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        req.approval_status === 'Approved' ? 'badge-resolved' :
                        req.approval_status === 'Rejected' ? 'badge-critical' : 'badge-open'
                      }`}>
                        {req.approval_status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, color: '#334155' }}>{req.status}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', color: '#2563eb' }}
                          title="Edit Service Request"
                          onClick={() => setEditingReq(req)}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.45rem', fontSize: '0.75rem', color: '#dc2626' }}
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
          </div>
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
