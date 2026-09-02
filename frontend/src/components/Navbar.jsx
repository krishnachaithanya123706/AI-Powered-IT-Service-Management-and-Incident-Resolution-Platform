import React from 'react';
import { ShieldCheck, User, Search, Bell, AlertTriangle } from 'lucide-react';

export default function Navbar({ activeIncidentsCount = 0 }) {
  return (
    <header style={{
      height: '65px',
      background: 'var(--bg-navbar)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Search Input Mock */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: '#f1f5f9',
        border: '1px solid #cbd5e1',
        padding: '0.45rem 0.9rem',
        borderRadius: '8px',
        width: '320px'
      }}>
        <Search size={15} color="var(--text-muted)" />
        <input 
          type="text" 
          placeholder="Search incidents, assets, runbooks..." 
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#0f172a',
            fontSize: '0.82rem',
            width: '100%',
            fontFamily: 'var(--font-sans)'
          }}
        />
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: '#e2e8f0', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
          Ctrl+K
        </span>
      </div>

      {/* Right Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Active Incidents Alert Chip */}
        {activeIncidentsCount > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#e11d48',
            background: 'rgba(225, 29, 72, 0.1)',
            border: '1px solid rgba(225, 29, 72, 0.25)',
            padding: '0.3rem 0.75rem',
            borderRadius: '9999px'
          }}>
            <AlertTriangle size={14} />
            <span>{activeIncidentsCount} Active Incident{activeIncidentsCount > 1 ? 's' : ''}</span>
          </div>
        )}

        {/* System Health Normal */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: 'var(--accent-emerald)',
          background: 'rgba(5, 150, 105, 0.1)',
          border: '1px solid rgba(5, 150, 105, 0.25)',
          padding: '0.3rem 0.75rem',
          borderRadius: '9999px'
        }}>
          <ShieldCheck size={15} />
          <span>SLA Healthy (96.4%)</span>
        </div>

        {/* Notification Bell */}
        <button style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: '#f1f5f9',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <Bell size={17} />
        </button>

        {/* User Operator Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          padding: '0.3rem 0.6rem 0.3rem 0.3rem',
          borderRadius: '9999px',
          background: '#f1f5f9',
          border: '1px solid var(--border-color)'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.75rem'
          }}>
            <User size={15} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
              Alex Vance
            </span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Site Reliability Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
