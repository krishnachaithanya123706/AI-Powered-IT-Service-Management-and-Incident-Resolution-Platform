import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Plus, Search, Edit2, Trash2, Eye, AlertOctagon } from 'lucide-react';
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
      await api.deleteIncident(deletingIncident._id || deletingIncident.id);
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
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <AlertOctagon size={24} color="var(--accent-rose)" />
            <span>Incident Desk Management</span>
          </h1>
          <p className="page-subtitle">
            AI-driven auto-triaging, SLA tracking, and 1-click resolution playbooks.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewIncident}>
          <Plus size={16} /> New Incident Ticket
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="filter-bar">
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="filter-input"
            placeholder="Search by ticket # or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '36px', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          <select
            className="form-select"
            style={{ width: '150px' }}
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
            style={{ width: '150px' }}
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

      {/* Incident List Table */}
      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading tickets...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No tickets found matching your search parameters.
          </div>
        ) : (
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
                <tr key={inc._id || inc.id}>
                  <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{inc.ticket_number}</td>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{inc.title}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{inc.category}</td>
                  <td>
                    <span className={`badge badge-${inc.priority ? inc.priority.toLowerCase() : 'p3'}`}>
                      {inc.priority}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{inc.assigned_team || 'Tier-1 Desk'}</td>
                  <td>
                    <span className={`badge ${inc.status === 'Resolved' || inc.status === 'Closed' ? 'badge-healthy' : 'badge-open'}`}>
                      {inc.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        title="View Details"
                        onClick={() => onSelectIncident(inc)}
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-cyan)' }}
                        title="Edit Ticket"
                        onClick={() => setEditingIncident(inc)}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ color: 'var(--accent-rose)' }}
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
