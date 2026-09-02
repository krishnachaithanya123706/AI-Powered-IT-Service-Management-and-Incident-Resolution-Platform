import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { AlertCircle, CheckCircle, Server, FileText, Plus, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export default function Dashboard({ onSelectIncident, onOpenNewIncident }) {
  const [metrics, setMetrics] = useState(null);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [m, inc, logs] = await Promise.all([
        api.getMetrics(),
        api.getIncidents({ status: 'All' }),
        api.getActivityLogs()
      ]);
      setMetrics(m);
      setRecentIncidents(inc.slice(0, 5));
      setActivityLogs(logs.slice(0, 5));
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
    return (
      <div className="page-body">
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading Executive Dashboard telemetry...
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <span>Executive Operations Dashboard</span>
          </h1>
          <p className="page-subtitle">
            Real-time IT operational metrics, priority incident queue, and system telemetry stream.
          </p>
        </div>
        <button className="btn btn-primary" onClick={onOpenNewIncident}>
          <Plus size={16} />
          <span>Create New Incident</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card accent-rose">
          <div>
            <div className="metric-label">Active Incidents</div>
            <div className="metric-val" style={{ color: 'var(--accent-rose)' }}>
              {metrics?.activeIncidents ?? 0}
            </div>
            <div className="metric-sub" style={{ color: 'var(--accent-rose)' }}>{metrics?.p1Incidents ?? 0} P1 Critical Outages</div>
          </div>
          <div className="metric-icon-box">
            <AlertCircle size={22} color="var(--accent-rose)" />
          </div>
        </div>

        <div className="metric-card accent-emerald">
          <div>
            <div className="metric-label">Resolved Tickets</div>
            <div className="metric-val" style={{ color: 'var(--accent-emerald)' }}>
              {metrics?.resolvedIncidents ?? 0}
            </div>
            <div className="metric-sub">SLA Rate {metrics?.slaComplianceRate ?? 96.4}%</div>
          </div>
          <div className="metric-icon-box">
            <CheckCircle size={22} color="var(--accent-emerald)" />
          </div>
        </div>

        <div className="metric-card accent-cyan">
          <div>
            <div className="metric-label">Total Assets Monitored</div>
            <div className="metric-val" style={{ color: 'var(--accent-cyan)' }}>
              {metrics?.activeAssetsCount ?? 0}
            </div>
            <div className="metric-sub">K8s, DB & Ingress Clusters</div>
          </div>
          <div className="metric-icon-box">
            <Server size={22} color="var(--accent-cyan)" />
          </div>
        </div>

        <div className="metric-card accent-purple">
          <div>
            <div className="metric-label">Infrastructure Health</div>
            <div className="metric-val" style={{ color: 'var(--accent-purple)' }}>
              {metrics?.infrastructureHealthScore ?? 100}%
            </div>
            <div className="metric-sub">Mean MTTR {metrics?.meanTimeToResolveMinutes ?? 38}m</div>
          </div>
          <div className="metric-icon-box">
            <ShieldCheck size={22} color="var(--accent-purple)" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Incidents & Live Activity Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1.8fr) minmax(300px, 1fr)', gap: '1.5rem' }}>
        {/* Recent Incidents Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
              Active & Recent IT Incidents
            </h3>
            <span className="badge badge-cyan">{recentIncidents.length} Tickets</span>
          </div>

          <div className="table-container" style={{ border: 'none' }}>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Title & Service</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentIncidents.map(inc => (
                  <tr key={inc._id || inc.id}>
                    <td style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{inc.ticket_number}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{inc.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inc.impacted_service || inc.category}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${inc.priority ? inc.priority.toLowerCase() : 'p3'}`}>
                        {inc.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${inc.status === 'Resolved' ? 'badge-healthy' : 'badge-open'}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectIncident(inc)}
                      >
                        <span>Details</span>
                        <ArrowRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Stream Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={16} color="var(--accent-cyan)" />
              Live Audit Stream
            </h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Real-time</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activityLogs.map((log, idx) => (
              <div key={idx} style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                    {log.action}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#0f172a', marginBottom: '0.2rem' }}>
                  {log.details}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  Triggered by: {log.user}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
