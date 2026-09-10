import React from 'react';
import { Bot, User, Sparkles, Send } from 'lucide-react';
import { AIMessage } from '@shared';

interface AIConversationViewProps {
  messages: AIMessage[];
  onSendMessage: (text: string) => void;
}

export const AIConversationView: React.FC<AIConversationViewProps> = ({ messages, onSendMessage }) => {
  return (
    <div className="glass-panel custom-scroll" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2>
          <Bot size={18} color="#06b6d4" /> Gemini AI Progressive Assistant
        </h2>
        <span style={{ fontSize: '0.75rem', background: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9', padding: '0.2rem 0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Sparkles size={12} /> Context Collector
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: '0.5rem',
                alignSelf: isAI ? 'flex-start' : 'flex-end',
                maxWidth: '90%',
              }}
            >
              {isAI && (
                <div style={{ width: '28px', height: '28px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid #06b6d4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={14} color="#06b6d4" />
                </div>
              )}

              <div>
                <div
                  style={{
                    background: isAI ? 'rgba(15, 23, 42, 0.9)' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
                    border: isAI ? '1px solid rgba(6, 182, 212, 0.3)' : 'none',
                    color: '#f8fafc',
                    padding: '0.65rem 0.85rem',
                    borderRadius: isAI ? '0 12px 12px 12px' : '12px 12px 0 12px',
                    fontSize: '0.82rem',
                    lineHeight: '1.4',
                  }}
                >
                  {msg.content}
                </div>

                {/* Suggested clickable answers */}
                {isAI && msg.suggested_answers && msg.suggested_answers.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                    {msg.suggested_answers.map((ans: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => onSendMessage(ans)}
                        style={{
                          background: 'rgba(30, 41, 59, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#67e8f9',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                        }}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
