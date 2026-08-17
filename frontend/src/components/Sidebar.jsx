import React from 'react';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Server, 
  ShoppingBag, 
  GitPullRequest,
  Bot
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'incidents', label: 'Incidents', icon: AlertCircle },
    { id: 'infrastructure', label: 'IT Assets', icon: Server },
    { id: 'catalog', label: 'Service Requests', icon: ShoppingBag },
    { id: 'changes', label: 'Change Management', icon: GitPullRequest },
    { id: 'copilot', label: 'AI Operations Copilot', icon: Bot }
  ];

  return (
    <aside style={{
      width: '230px',
      background: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem 0.75rem'
    }}>
      <div style={{ padding: '0 0.5rem 0.75rem 0.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Navigation Menu
        </span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                width: '100%',
                padding: '0.6rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                background: isActive ? '#e0f2fe' : 'transparent',
                color: isActive ? '#0284c7' : '#475569',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Icon size={18} color={isActive ? '#0284c7' : '#64748b'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
