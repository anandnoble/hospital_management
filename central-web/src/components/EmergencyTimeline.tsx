import React from 'react';
import { Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { EmergencyRequest, EmergencyStatus, EMERGENCY_STATUS_ORDER, getStatusLabel } from '@shared';

interface EmergencyTimelineProps {
  emergency: EmergencyRequest | null;
}

export const EmergencyTimeline: React.FC<EmergencyTimelineProps> = ({ emergency }) => {
  const currentStatusIndex = emergency
    ? EMERGENCY_STATUS_ORDER.indexOf(emergency.status)
    : 3;

  return (
    <div className="glass-panel custom-scroll" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2>
          <Clock size={18} color="#f59e0b" /> Real-time Audit Timeline
        </h2>
      </div>

      <div style={{ padding: '0.5rem 0.25rem' }}>
        {EMERGENCY_STATUS_ORDER.map((statusStep: EmergencyStatus, idx: number) => {
          const isPassed = idx <= currentStatusIndex;
          const isCurrent = idx === currentStatusIndex;

          return (
            <div
              key={statusStep}
              style={{
                display: 'flex',
                gap: '0.85rem',
                position: 'relative',
                paddingBottom: idx === EMERGENCY_STATUS_ORDER.length - 1 ? 0 : '1.25rem',
              }}
            >
              {/* Connecting line */}
              {idx !== EMERGENCY_STATUS_ORDER.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '11px',
                    top: '22px',
                    bottom: 0,
                    width: '2px',
                    background: isPassed ? 'linear-gradient(#ef4444, #06b6d4)' : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              )}

              {/* Status node icon */}
              <div style={{ zIndex: 2, background: '#07090e', borderRadius: '50%', padding: '2px' }}>
                {isPassed ? (
                  <CheckCircle size={20} color={isCurrent ? '#ef4444' : '#10b981'} />
                ) : (
                  <Circle size={20} color="#475569" />
                )}
              </div>

              {/* Status text */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: isCurrent ? 700 : 500,
                      color: isCurrent ? '#ef4444' : isPassed ? '#f8fafc' : '#64748b',
                    }}
                  >
                    {getStatusLabel(statusStep)}
                  </span>
                  {isPassed && (
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                      10:{30 + idx * 2} AM
                    </span>
                  )}
                </div>

                {isCurrent && (
                  <p style={{ fontSize: '0.78rem', color: '#fca5a5', marginTop: '0.25rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    Current active phase: System managing realtime routing & updates.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
