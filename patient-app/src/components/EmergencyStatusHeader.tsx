import React from 'react';
import { ShieldAlert, Building2, Truck, CheckCircle2, Clock } from 'lucide-react';
import { EmergencyStatus, getStatusLabel } from '@shared';

interface EmergencyStatusHeaderProps {
  status: EmergencyStatus;
  hospitalName?: string;
  ambulanceVehicle?: string;
}

export const EmergencyStatusHeader: React.FC<EmergencyStatusHeaderProps> = ({
  status,
  hospitalName = 'City General Emergency Hospital',
  ambulanceVehicle = 'AP 05 AB 1234',
}) => {
  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(15, 23, 42, 0.95))', borderBottom: '1px solid rgba(239, 68, 68, 0.4)', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="pulse-dot" />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fca5a5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {getStatusLabel(status)}
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
          Live Realtime Stream
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(30, 41, 59, 0.6)', padding: '0.35rem 0.5rem', borderRadius: '8px' }}>
          <Building2 size={14} color="#f59e0b" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hospitalName}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(30, 41, 59, 0.6)', padding: '0.35rem 0.5rem', borderRadius: '8px' }}>
          <Truck size={14} color="#06b6d4" />
          <span>{ambulanceVehicle}</span>
        </div>
      </div>
    </div>
  );
};
