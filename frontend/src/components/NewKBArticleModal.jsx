import React, { useState } from 'react';
import { X, BookOpen, Plus } from 'lucide-react';

export default function NewKBArticleModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Infrastructure',
    tags: '',
    problem_summary: '',
    resolution_steps: '',
    author: 'Lead DevOps Engineer'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.problem_summary) {
      alert('Please enter both title and problem summary.');
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      resolution_steps: formData.resolution_steps.split('\n').map(s => s.trim()).filter(Boolean)
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BookOpen size={20} color="var(--accent-cyan)" />
            <h3 className="modal-title">Create Knowledge Base Runbook</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Article Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Redis Cluster Cache Invalidation & Connection Timeout SOP"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Database">Database</option>
                  <option value="Security">Security</option>
                  <option value="Network">Network</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Author Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Kubernetes, Redis, Cache, Network"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Problem Summary</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Detailed description of symptoms, error codes, and impacted microservices..."
                value={formData.problem_summary}
                onChange={(e) => setFormData({ ...formData, problem_summary: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Resolution Steps (one per line)</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Step 1: Check active connection logs&#10;Step 2: Restart ingress gateway replica&#10;Step 3: Flush cache key queue"
                value={formData.resolution_steps}
                onChange={(e) => setFormData({ ...formData, resolution_steps: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Plus size={16} />
              <span>Publish Runbook</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
