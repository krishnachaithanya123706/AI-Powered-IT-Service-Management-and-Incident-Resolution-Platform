import React, { useState } from 'react';
import { api } from '../services/api';
import { Bot, Send, Sparkles, User, Terminal, CheckCircle2, RefreshCw } from 'lucide-react';

export default function AICopilot() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I am your **Aether ITSM AI Operations Assistant**.
I continuously analyze system logs, knowledge playbooks, SLA countdowns, and active alerts.

How can I assist your IT operations team today?`,
      suggestedActions: [
        'How to resolve database deadlocks?',
        'Draft P1 incident post-mortem',
        'Summarize critical infrastructure alerts'
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
    <div className="page-body" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px - 3.5rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          padding: '0.5rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
          border: '1px solid rgba(139, 92, 246, 0.4)'
        }}>
          <Bot size={24} color="#a78bfa" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            AI Operations & Incident Copilot
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
            Query runbooks, diagnose root causes, generate incident post-mortems, and execute resolution playbooks
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Messages Scroll View */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{
              display: 'flex',
              gap: '0.75rem',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}>
              {msg.sender === 'ai' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Sparkles size={16} color="white" />
                </div>
              )}

              <div style={{
                background: msg.sender === 'user' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                border: msg.sender === 'user' ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '0.75rem',
                padding: '0.85rem 1.1rem',
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
                          background: 'rgba(139, 92, 246, 0.15)',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          color: '#c4b5fd',
                          borderRadius: '16px',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
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
                  width: '32px',
                  height: '32px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa', fontSize: '0.85rem' }}>
              <RefreshCw className="animate-spin" size={16} /> AI Assistant is analyzing IT knowledge base...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(9, 13, 22, 0.8)',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask AI Copilot for playbook steps, root cause analysis, or post-mortem summaries..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ borderRadius: '0.5rem' }}
          />
          <button className="btn btn-ai" onClick={() => handleSend()} disabled={loading}>
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
