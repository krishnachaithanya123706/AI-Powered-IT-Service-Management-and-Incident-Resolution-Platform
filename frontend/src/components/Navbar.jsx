import React from 'react';
import { ShieldCheck, User } from 'lucide-react';

export default function Navbar({ activeIncidentsCount = 0 }) {
  return (
    <header style={{
      height: '60px',
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '6px',
          background: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          IT
        </div>
        <div>
          <h1 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            IT Service Management System
          </h1>
          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Incident Resolution & IT Operations</p>
        </div>
      </div>

      {/* Right Header Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: '#16a34a',
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          padding: '0.25rem 0.6rem',
          borderRadius: '4px'
        }}>
          <ShieldCheck size={14} />
          <span>System Normal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={16} color="#475569" />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#334155' }}>IT Administrator</span>
        </div>
      </div>
    </header>
  );
}
