import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function IncidentDetailModal({ incident, onClose, onResolveWithAI }) {
  const [isResolving, setIsResolving] = useState(false);

  if (!incident) return null;

  const handleResolve = async () => {
    setIsResolving(true);
    try {
      await onResolveWithAI(incident.id);
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsResolving(false);
    }
  };

  const isResolved = incident.status === 'Resolved' || incident.status === 'Closed';

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 700, color: '#2563eb' }}>{incident.ticket_number}</span>
            <span className={`badge badge-${incident.priority ? incident.priority.toLowerCase() : 'p3'}`}>
              {incident.priority}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
            {incident.title}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
            {incident.description || 'No description provided.'}
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '0.75rem',
            fontSize: '0.8rem',
            color: '#334155',
            marginBottom: '1rem'
          }}>
            <div><strong>Impacted Service:</strong> {incident.impacted_service || 'General'}</div>
            <div><strong>Assigned Team:</strong> {incident.assigned_team || 'Tier-1 IT Desk'}</div>
            <div><strong>Category:</strong> {incident.category || 'Infrastructure'}</div>
          </div>

          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '6px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0369a1', marginBottom: '0.35rem' }}>
              💡 AI Recommended Resolution Steps
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#0c4a6e', whiteSpace: 'pre-line', lineHeight: 1.4 }}>
              {incident.ai_suggested_resolution || '1. Verify service connectivity.\n2. Restart affected process queue.'}
            </p>
          </div>

          {!isResolved && (
            <button
              className="btn btn-success"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleResolve}
              disabled={isResolving}
            >
              <CheckCircle size={16} />
              {isResolving ? 'Resolving...' : 'Apply Resolution & Mark Resolved'}
            </button>
          )}
        </div>

        <div style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
