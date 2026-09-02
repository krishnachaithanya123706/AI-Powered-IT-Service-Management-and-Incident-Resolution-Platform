import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Tag, Eye, Star, Trash2, CheckCircle2, ChevronRight } from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeBase({ onOpenNewArticle }) {
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Infrastructure', 'Database', 'Security', 'Network', 'General'];

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await api.getKnowledgeBase(selectedCategory, searchQuery);
      setArticles(data);
      if (data.length > 0 && !activeArticle) {
        setActiveArticle(data[0]);
      }
    } catch (err) {
      console.error('Failed to load KB articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this Knowledge Base article?')) {
      await api.deleteKBArticle(id);
      if (activeArticle && activeArticle._id === id) {
        setActiveArticle(null);
      }
      loadArticles();
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-title">
            <BookOpen size={24} color="var(--accent-cyan)" />
            <span>IT Knowledge Base & Runbooks</span>
            <span className="page-title-badge">FEATURE 1</span>
          </div>
          <p className="page-subtitle">Standard operating procedures, automated playbooks, and troubleshooting runbooks.</p>
        </div>

        <button className="btn btn-primary" onClick={onOpenNewArticle}>
          <Plus size={16} />
          <span>New KB Article</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            className="filter-input"
            placeholder="Search runbooks by title, tags, or problem keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="btn btn-sm"
              style={{
                background: selectedCategory === cat ? 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                border: '1px solid',
                borderColor: selectedCategory === cat ? 'transparent' : '#cbd5e1'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Split Screen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 1.4fr)', gap: '1.5rem' }}>
        {/* Article Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {loading ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading KB runbooks...
            </div>
          ) : articles.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No articles found in this category.
            </div>
          ) : (
            articles.map(article => {
              const isSelected = activeArticle && activeArticle._id === article._id;
              return (
                <div
                  key={article._id}
                  onClick={() => setActiveArticle(article)}
                  className="glass-card glass-card-hover"
                  style={{
                    cursor: 'pointer',
                    padding: '1.1rem 1.25rem',
                    borderLeft: isSelected ? '4px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                    background: isSelected ? 'rgba(2, 132, 199, 0.06)' : 'var(--bg-card)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span className="badge badge-purple">{article.kb_id}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Eye size={12} /> {article.view_count || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-amber)' }}>
                        <Star size={12} fill="var(--accent-amber)" /> {article.rating || 4.8}
                      </span>
                      <button
                        onClick={(e) => handleDelete(article._id, e)}
                        style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer', opacity: 0.7 }}
                        title="Delete Article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                    {article.title}
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.65rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {article.problem_summary}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-cyan">{article.category}</span>
                    {article.tags && article.tags.map((tag, idx) => (
                      <span key={idx} style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: '#f1f5f9', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Article Detail Reader Panel */}
        <div>
          {activeArticle ? (
            <div className="glass-card" style={{ padding: '1.75rem', position: 'sticky', top: '85px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <span className="badge badge-cyan" style={{ fontSize: '0.78rem' }}>{activeArticle.kb_id} • {activeArticle.category}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authored by {activeArticle.author}</span>
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem', lineHeight: 1.3 }}>
                {activeArticle.title}
              </h2>

              <div style={{ marginBottom: '1.25rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.04em' }}>
                  Problem Summary & Context
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {activeArticle.problem_summary}
                </p>
              </div>

              <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.85rem', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} />
                Standard Resolution Execution Playbook
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {activeArticle.resolution_steps && activeArticle.resolution_steps.length > 0 ? (
                  activeArticle.resolution_steps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem 0.9rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#0f172a', fontFamily: 'monospace' }}>
                        {step}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No resolution steps documented.</p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={14} color="var(--text-muted)" />
                  {activeArticle.tags && activeArticle.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', background: 'rgba(0, 242, 254, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      #{t}
                    </span>
                  ))}
                </div>

                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => alert(`Playbook ${activeArticle.kb_id} attached to active incident desk session!`)}
                >
                  <span>Apply SOP to Active Incident</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
              Select a Knowledge Base article to view resolution steps.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
