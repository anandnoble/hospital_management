import React, { useState } from 'react';
import { Bot, Sparkles, Send, MessageSquare } from 'lucide-react';
import { AIMessage } from '@shared';

interface AIChatDrawerProps {
  messages: AIMessage[];
  onSendMessage: (text: string) => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ messages, onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '320px', padding: '1rem', margin: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '0.35rem', borderRadius: '50%' }}>
            <Bot size={18} color="#06b6d4" />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>Gemini AI Context Assistant</h4>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Collecting ER vital info ask-by-ask</span>
          </div>
        </div>
        <span style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9', padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600 }}>
          <Sparkles size={10} style={{ display: 'inline', marginRight: '3px' }} /> Active
        </span>
      </div>

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '0.75rem' }}>
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div key={msg.id} style={{ alignSelf: isAI ? 'flex-start' : 'flex-end', maxWidth: '85%' }}>
              <div
                style={{
                  background: isAI ? 'rgba(30, 41, 59, 0.9)' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
                  border: isAI ? '1px solid rgba(6, 182, 212, 0.3)' : 'none',
                  color: '#f8fafc',
                  padding: '0.55rem 0.75rem',
                  borderRadius: isAI ? '0 12px 12px 12px' : '12px 12px 0 12px',
                  fontSize: '0.8rem',
                  lineHeight: '1.4',
                }}
              >
                {msg.content}
              </div>

              {/* Clickable Suggested Answer Chips */}
              {isAI && msg.suggested_answers && msg.suggested_answers.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
                  {msg.suggested_answers.map((ans: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(ans)}
                      style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(6, 182, 212, 0.4)',
                        color: '#67e8f9',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      {ans}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Reply to AI assistant..."
          style={{
            flex: 1,
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '0.5rem 0.75rem',
            color: '#f8fafc',
            fontSize: '0.8rem',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim()}
          style={{
            background: '#06b6d4',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '0.5rem 0.85rem',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            opacity: input.trim() ? 1 : 0.5,
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
