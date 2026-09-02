import React from 'react';
import { 
  LayoutDashboard, 
  AlertCircle, 
  Server, 
  ShoppingBag, 
  GitPullRequest,
  BookOpen,
  BarChart3,
  Bot,
  Zap,
  Activity
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core Desk' },
    { id: 'incidents', label: 'Incidents Desk', icon: AlertCircle, section: 'Core Desk' },
    { id: 'infrastructure', label: 'IT Asset Health', icon: Server, section: 'Core Desk' },
    { id: 'catalog', label: 'Service Requests', icon: ShoppingBag, section: 'Operations' },
    { id: 'changes', label: 'CAB Changes', icon: GitPullRequest, section: 'Operations' },
    { id: 'kb', label: 'Knowledge Base', icon: BookOpen, section: 'Intelligence', isNew: true },
    { id: 'analytics', label: 'ITSM Analytics', icon: BarChart3, section: 'Intelligence', isNew: true },
    { id: 'copilot', label: 'AI Copilot Assistant', icon: Bot, section: 'Intelligence' }
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 1rem',
      height: '100vh',
      flexShrink: 0,
      zIndex: 20
    }}>
      {/* Brand Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        padding: '0.5rem 0.5rem 1.25rem 0.5rem', 
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1.25rem'
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0b0f19',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)'
        }}>
          <Zap size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Nexus ITSM
          </h2>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI Ops Engine v2.4
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const showSectionHeader = index === 0 || menuItems[index - 1].section !== item.section;

          return (
            <React.Fragment key={item.id}>
              {showSectionHeader && (
                <div style={{ 
                  padding: '0.85rem 0.6rem 0.35rem 0.6rem', 
                  fontSize: '0.65rem', 
                  fontWeight: 800, 
                  color: 'var(--text-muted)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em' 
                }}>
                  {item.section}
                </div>
              )}
              <button
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(0, 242, 254, 0.3)' : 'transparent',
                  background: isActive ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.isNew && (
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                    color: '#ffffff',
                    textTransform: 'uppercase'
                  }}>
                    NEW
                  </span>
                )}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* System Status Footer Pill */}
      <div style={{
        marginTop: 'auto',
        padding: '0.85rem',
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--accent-emerald)',
          boxShadow: '0 0 8px var(--accent-emerald)'
        }} className="pulse-glow" />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffffff' }}>System Active</div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SQLite / In-Memory DB</div>
        </div>
        <Activity size={16} color="var(--accent-cyan)" />
      </div>
    </aside>
  );
}
