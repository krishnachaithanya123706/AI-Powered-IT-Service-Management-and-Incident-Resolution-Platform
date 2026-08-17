import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import EditIncidentModal from '../components/EditIncidentModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

export default function Incidents({ onSelectIncident, onOpenNewIncident, onMetricsUpdate }) {
  const [incidents, setIncidents] = useState([]);
  const [filters, setFilters] = useState({ status: 'All', priority: 'All' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit & Delete Modal states
  const [editingIncident, setEditingIncident] = useState(null);
  const [deletingIncident, setDeletingIncident] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await api.getIncidents(filters);
      setIncidents(data);
    } catch (err) {
      console.error('Failed to load incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, [filters]);

  const handleUpdateIncident = async (id, formData) => {
    await api.updateIncident(id, formData);
    await loadIncidents();
    if (onMetricsUpdate) onMetricsUpdate();
  };

  const handleDeleteIncident = async () => {
    if (!deletingIncident) return;
    setDeleteLoading(true);
    try {
      await api.deleteIncident(deletingIncident.id);
      setDeletingIncident(null);
      await loadIncidents();
      if (onMetricsUpdate) onMetricsUpdate();
    } catch (err) {
      alert('Failed to delete incident: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = incidents.filter(inc => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      inc.ticket_number?.toLowerCase().includes(q) ||
      inc.title?.toLowerCase().includes(q) ||
      inc.category?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-body">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e293b' }}>
            Incident Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            View, edit, track, and resolve IT service desk tickets
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewIncident}>
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="basic-card" style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by ticket # or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select
              className="form-select"
              style={{ width: '140px' }}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              className="form-select"
              style={{ width: '140px' }}
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            >
              <option value="All">All Priorities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="basic-card">
        {loading ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>Loading tickets...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
            No tickets found matching your search.
          </div>
        ) : (
          <div className="table-container">
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Assigned Team</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inc => (
                  <tr key={inc.id}>
                    <td style={{ fontWeight: 600, color: '#2563eb' }}>{inc.ticket_number}</td>
                    <td style={{ fontWeight: 500 }}>{inc.title}</td>
                    <td style={{ color: '#64748b' }}>{inc.category}</td>
                    <td>
                      <span className={`badge badge-${inc.priority ? inc.priority.toLowerCase() : 'p3'}`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td style={{ color: '#475569' }}>{inc.assigned_team || 'Tier-1 Desk'}</td>
                    <td>
                      <span className={`badge ${inc.status === 'Resolved' || inc.status === 'Closed' ? 'badge-resolved' : 'badge-open'}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          title="View Details"
                          onClick={() => onSelectIncident(inc)}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: '#2563eb' }}
                          title="Edit Ticket"
                          onClick={() => setEditingIncident(inc)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: '#dc2626' }}
                          title="Delete Ticket"
                          onClick={() => setDeletingIncident(inc)}
                        >
                          <Trash2 size={13} />
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

      {/* Edit Incident Modal */}
      {editingIncident && (
        <EditIncidentModal
          incident={editingIncident}
          onClose={() => setEditingIncident(null)}
          onSubmit={handleUpdateIncident}
        />
      )}

      {/* Delete Incident Modal */}
      {deletingIncident && (
        <ConfirmDeleteModal
          title="Delete Incident Ticket"
          itemType="Incident"
          itemName={`${deletingIncident.ticket_number}: ${deletingIncident.title}`}
          onClose={() => setDeletingIncident(null)}
          onConfirm={handleDeleteIncident}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
