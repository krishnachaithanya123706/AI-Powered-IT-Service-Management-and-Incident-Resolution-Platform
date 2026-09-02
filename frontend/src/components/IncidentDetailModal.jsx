import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';

export default function IncidentDetailModal({ incident, onClose, onResolveWithAI }) {
  const [isResolving, setIsResolving] = useState(false);

  if (!incident) return null;

  const handleResolve = async () => {
    setIsResolving(true);
    try {
      await onResolveWithAI(incident._id || incident.id);
      onClose();
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setIsResolving(false);
    }
  };

  const isResolved = incident.status === 'Resolved' || incident.status === 'Closed';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '1.05rem' }}>{incident.ticket_number}</span>
            <span className={`badge badge-${incident.priority ? incident.priority.toLowerCase() : 'p3'}`}>
              {incident.priority}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            {incident.title}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {incident.description || 'No detailed description provided.'}
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '0.9rem 1.1rem',
            fontSize: '0.82rem',
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.6rem'
          }}>
            <div><strong style={{ color: 'var(--text-muted)' }}>Impacted Service:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{incident.impacted_service || 'General API'}</span></div>
            <div><strong style={{ color: 'var(--text-muted)' }}>Assigned Team:</strong> <span style={{ color: '#0f172a', fontWeight: 600 }}>{incident.assigned_team || 'Tier-1 IT Desk'}</span></div>
            <div><strong style={{ color: 'var(--text-muted)' }}>Category:</strong> <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{incident.category || 'Infrastructure'}</span></div>
            <div><strong style={{ color: 'var(--text-muted)' }}>AI Confidence:</strong> <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>{incident.ai_confidence || 94}%</span></div>
          </div>

          <div style={{
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(2, 132, 199, 0.25)',
            borderRadius: '10px',
            padding: '1.1rem',
            marginBottom: '1.25rem'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={16} />
              AI Recommended Resolution Playbook
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#0f172a', whiteSpace: 'pre-line', lineHeight: 1.5, fontFamily: 'monospace' }}>
              {incident.ai_suggested_resolution || '1. Verify service connectivity.\n2. Restart affected process queue.'}
            </p>
          </div>

          {!isResolved && (
            <button
              className="btn btn-success"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
              onClick={handleResolve}
              disabled={isResolving}
            >
              <CheckCircle size={18} />
              <span>{isResolving ? 'Applying Playbook...' : 'Execute Playbook & Mark Resolved'}</span>
            </button>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
