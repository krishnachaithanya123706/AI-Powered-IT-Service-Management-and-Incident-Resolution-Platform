import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AlertCircle, CheckCircle, Server, FileText, Plus } from 'lucide-react';

export default function Dashboard({ onSelectIncident, onOpenNewIncident }) {
  const [metrics, setMetrics] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, inc] = await Promise.all([
        api.getMetrics(),
        api.getIncidents({ status: 'All' })
      ]);
      setMetrics(m);
      setRecentIncidents(inc.slice(0, 5));
    } catch (err) {
      console.error('Failed to load metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !metrics) {
    return <div style={{ padding: '2rem', color: '#64748b' }}>Loading dashboard data...</div>;
  }

  return (
    <div className="page-body">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e293b' }}>
            IT Operations Dashboard
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Overview of IT incidents, system health, and service desk status
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewIncident}>
          <Plus size={16} /> Create New Incident
        </button>
      </div>

      {/* Basic Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div className="basic-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>ACTIVE INCIDENTS</span>
            <AlertCircle size={18} color="#dc2626" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {metrics?.activeIncidents ?? 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Open support tickets</span>
        </div>

        <div className="basic-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>RESOLVED TICKETS</span>
            <CheckCircle size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#16a34a' }}>
            {metrics?.resolvedIncidents ?? 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Completed resolutions</span>
        </div>

        <div className="basic-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>TOTAL ASSETS</span>
            <Server size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b' }}>
            {metrics?.activeAssetsCount ?? 0}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Monitored servers & nodes</span>
        </div>

        <div className="basic-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>SYSTEM HEALTH</span>
            <FileText size={18} color="#059669" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#059669' }}>
            {metrics?.infrastructureHealthScore ?? 100}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Healthy nodes ratio</span>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="basic-card">
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.85rem' }}>
          Recent IT Incidents
        </h2>

        <div className="table-container">
          <table className="simple-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentIncidents.map(inc => (
                <tr key={inc.id}>
                  <td style={{ fontWeight: 600, color: '#2563eb' }}>{inc.ticket_number}</td>
                  <td style={{ fontWeight: 500 }}>{inc.title}</td>
                  <td>
                    <span className={`badge badge-${inc.priority ? inc.priority.toLowerCase() : 'p3'}`}>
                      {inc.priority}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{inc.category}</td>
                  <td>
                    <span className={`badge ${inc.status === 'Resolved' ? 'badge-resolved' : 'badge-open'}`}>
                      {inc.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                      onClick={() => onSelectIncident(inc)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
