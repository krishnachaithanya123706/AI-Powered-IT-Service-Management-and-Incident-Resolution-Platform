import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDeleteModal({ title, itemType, itemName, onClose, onConfirm, loading }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626', fontWeight: 600 }}>
            <AlertTriangle size={20} />
            <span>{title || `Delete ${itemType || 'Item'}`}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '0.75rem' }}>
            Are you sure you want to delete <strong style={{ color: '#0f172a' }}>{itemName}</strong>?
          </p>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
            This action will permanently remove the record from the ITSM database and log an entry into the activity stream. This action cannot be undone.
          </p>
        </div>

        <div style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem'
        }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}
