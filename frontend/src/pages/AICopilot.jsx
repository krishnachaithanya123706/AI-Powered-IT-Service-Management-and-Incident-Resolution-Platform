import React, { useState } from 'react';
import { api } from '../services/api';
import { Bot, Send, Sparkles, User, RefreshCw } from 'lucide-react';

export default function AICopilot() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your Nexus ITSM AI Operations Copilot.
I continuously analyze system logs, knowledge playbooks, SLA countdowns, and active infrastructure telemetry.

How can I assist your IT operations team today?`,
      suggestedActions: [
        'How to resolve database connection pool exhaustion?',
        'Draft P1 incident post-mortem report',
        'Summarize critical Kubernetes cluster alerts'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend) => {
    const prompt = textToSend || input;
    if (!prompt.trim()) return;

    // Add User Message
    const userMsg = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.sendCopilotPrompt(prompt);
      const aiMsg = {
        sender: 'ai',
        text: res.response,
        suggestedActions: res.suggestedActions || []
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: '⚠️ Error reaching AI engine: ' + err.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px - 4rem)' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <div>
          <h1 className="page-title">
            <Bot size={26} color="var(--accent-purple)" />
            <span>AI Operations & Incident Copilot</span>
          </h1>
          <p className="page-subtitle">
            Query runbooks, diagnose root causes, generate incident post-mortems, and execute resolution playbooks.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Messages Scroll View */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '0.75rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}>
              {msg.sender === 'ai' && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 12px rgba(168, 85, 247, 0.4)'
                }}>
                  <Sparkles size={16} color="white" />
                </div>
              )}

              <div style={{
                background: msg.sender === 'user' ? 'rgba(0, 242, 254, 0.12)' : 'rgba(13, 17, 28, 0.85)',
                border: msg.sender === 'user' ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                color: '#f8fafc',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div style={{ marginTop: '0.85rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {msg.suggestedActions.map((action, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleSend(action)}
                        style={{
                          background: 'rgba(168, 85, 247, 0.15)',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                          color: '#c084fc',
                          borderRadius: '16px',
                          padding: '0.3rem 0.85rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        ⚡ {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={16} color="#cbd5e1" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.85rem' }}>
              <RefreshCw className="animate-spin" size={16} /> AI Operations Copilot is querying knowledge base & telemetry...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(11, 15, 25, 0.9)',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask AI Copilot for runbook steps, error log diagnosis, or incident post-mortems..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="btn btn-primary" onClick={() => handleSend()} disabled={loading}>
            <Send size={16} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
