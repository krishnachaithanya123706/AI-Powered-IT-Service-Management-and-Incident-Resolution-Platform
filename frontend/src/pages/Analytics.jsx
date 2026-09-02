import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, ShieldCheck, Download, Users, AlertOctagon, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await api.getAnalytics();
        setData(res);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    if (!data) return;
    const summary = data.summary;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Incidents,${summary.totalIncidents}\n`
      + `Open Incidents,${summary.openIncidents}\n`
      + `Resolved Incidents,${summary.resolvedIncidents}\n`
      + `SLA Compliance %,${summary.slaCompliancePercentage}%\n`
      + `Average MTTR (Minutes),${summary.avgResolutionTimeMinutes}\n`
      + `Total Assets,${summary.totalAssets}\n`
      + `Healthy Assets,${summary.healthyAssets}\n`
      + `Total KB Articles,${summary.totalKbArticles}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `itsm_analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !data) {
    return (
      <div className="page-body">
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading enterprise ITSM analytics metrics...
        </div>
      </div>
    );
  }

  const { summary, categoryDistribution, priorityDistribution, teamWorkload, recentPerformanceTrends } = data;

  return (
    <div className="page-body">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div className="page-title">
            <BarChart3 size={24} color="var(--accent-cyan)" />
            <span>ITSM Operational Analytics & SLA Matrix</span>
            <span className="page-title-badge">FEATURE 2</span>
          </div>
          <p className="page-subtitle">Real-time performance metrics, team resolution velocity, MTTR trends, and SLA risk monitoring.</p>
        </div>

        <button className="btn btn-primary" onClick={handleExportCSV}>
          <Download size={16} />
          <span>Export Executive Report (.CSV)</span>
        </button>
      </div>

      {/* Metric Cards Top Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div>
            <div className="metric-label">SLA Compliance</div>
            <div className="metric-val" style={{ color: 'var(--accent-emerald)' }}>{summary.slaCompliancePercentage}%</div>
            <div className="metric-sub">Target: 95.0% SLA Threshold</div>
          </div>
          <div className="metric-icon-box">
            <ShieldCheck size={22} color="var(--accent-emerald)" />
          </div>
        </div>

        <div className="metric-card accent-cyan">
          <div>
            <div className="metric-label">Mean Time to Resolve</div>
            <div className="metric-val" style={{ color: 'var(--accent-cyan)' }}>{summary.avgResolutionTimeMinutes}m</div>
            <div className="metric-sub">Target: &lt; {summary.mttrTargetMinutes}m MTTR</div>
          </div>
          <div className="metric-icon-box">
            <Clock size={22} color="var(--accent-cyan)" />
          </div>
        </div>

        <div className="metric-card accent-amber">
          <div>
            <div className="metric-label">Total Incidents</div>
            <div className="metric-val" style={{ color: '#0f172a' }}>{summary.totalIncidents}</div>
            <div className="metric-sub" style={{ color: 'var(--accent-amber)' }}>{summary.openIncidents} Pending Triage</div>
          </div>
          <div className="metric-icon-box">
            <AlertOctagon size={22} color="var(--accent-amber)" />
          </div>
        </div>

        <div className="metric-card accent-purple">
          <div>
            <div className="metric-label">Resolved & Closed</div>
            <div className="metric-val" style={{ color: 'var(--accent-purple)' }}>{summary.resolvedIncidents}</div>
            <div className="metric-sub" style={{ color: 'var(--accent-purple)' }}>100% AI Playbook Assisted</div>
          </div>
          <div className="metric-icon-box">
            <TrendingUp size={22} color="var(--accent-purple)" />
          </div>
        </div>
      </div>

      {/* Analytics Visualization Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Category Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent-cyan)" />
              Incident Volume by Category
            </h3>
            <span className="badge badge-cyan">{categoryDistribution.length} Categories</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {categoryDistribution.map((item, idx) => {
              const pct = summary.totalIncidents > 0 ? Math.round((item.count / summary.totalIncidents) * 100) : 0;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.category}</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{item.count} tickets ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(0, 0, 0, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${Math.max(pct, 5)}%`, 
                        background: 'linear-gradient(90deg, #0284c7 0%, #2563eb 100%)',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertOctagon size={18} color="var(--accent-rose)" />
              Severity Priority Matrix
            </h3>
            <span className="badge badge-p1">Live Queue</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {priorityDistribution.map((item, idx) => {
              let color = 'var(--accent-cyan)';
              let bg = 'rgba(2, 132, 199, 0.1)';
              if (item.priority === 'P1') { color = 'var(--accent-rose)'; bg = 'rgba(225, 29, 72, 0.1)'; }
              if (item.priority === 'P2') { color = 'var(--accent-amber)'; bg = 'rgba(217, 119, 6, 0.1)'; }

              return (
                <div key={idx} style={{ padding: '1.25rem', background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '10px', textAlign: 'center' }}>
                  <span className={`badge badge-${item.priority.toLowerCase()}`} style={{ marginBottom: '0.5rem' }}>{item.priority}</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: color, margin: '0.2rem 0' }}>{item.count}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Incidents Logged</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Workload Distribution */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--accent-purple)" />
              Support Team Workload Allocation
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {teamWorkload.map((team, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{team.team}</span>
                <span className="badge badge-purple">{team.count} active tickets</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly MTTR Trend Data */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--accent-emerald)" />
              Weekly MTTR Velocity Trend (7-Day)
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', padding: '0 0.5rem 1rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            {recentPerformanceTrends.map((trend, idx) => {
              const barHeight = Math.min((trend.mttrMinutes / 50) * 100, 100);
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>{trend.mttrMinutes}m</span>
                  <div style={{ width: '18px', height: `${barHeight}%`, background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)', borderRadius: '4px 4px 0 0' }} />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{trend.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
