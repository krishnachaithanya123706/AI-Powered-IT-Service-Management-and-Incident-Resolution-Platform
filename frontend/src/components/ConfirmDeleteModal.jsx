import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDeleteModal({ title, itemType, itemName, onClose, onConfirm, loading }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--accent-rose)', fontWeight: 700 }}>
            <AlertTriangle size={20} />
            <span>{title || `Delete ${itemType || 'Item'}`}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.9rem', color: '#f8fafc', marginBottom: '0.75rem' }}>
            Are you sure you want to delete <strong style={{ color: 'var(--accent-rose)' }}>{itemName}</strong>?
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            This action will permanently remove the record from the ITSM platform and log an audit entry. This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
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
