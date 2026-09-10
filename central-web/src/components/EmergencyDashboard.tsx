import React from 'react';
import { AlertCircle, Building2, Truck, User, Phone, MapPin, Activity, CheckCircle2 } from 'lucide-react';
import { EmergencyRequest, getStatusLabel } from '@shared';

interface EmergencyDashboardProps {
  emergencies: EmergencyRequest[];
  selectedEmergency: EmergencyRequest | null;
  onSelectEmergency: (emergency: EmergencyRequest) => void;
  onSimulateNextStep: () => void;
}

export const EmergencyDashboard: React.FC<EmergencyDashboardProps> = ({
  emergencies,
  selectedEmergency,
  onSelectEmergency,
  onSimulateNextStep,
}) => {
  return (
    <div className="glass-panel custom-scroll" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2>
          <AlertCircle size={20} color="#ef4444" /> Active Emergencies ({emergencies.length})
        </h2>
        <button className="btn-primary" onClick={onSimulateNextStep}>
          <Activity size={16} /> Advance Flow
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {emergencies.map((emg) => {
          const isSelected = selectedEmergency?.id === emg.id;
          const statusClass = emg.status.toLowerCase();

          return (
            <div
              key={emg.id}
              onClick={() => onSelectEmergency(emg)}
              style={{
                background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.5)',
                border: isSelected ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 0 16px rgba(239, 68, 68, 0.2)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span className={`status-pill ${statusClass}`}>
                  {getStatusLabel(emg.status)}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  {new Date(emg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <User size={16} color="#06b6d4" />
                <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                  {emg.patient_profile?.full_name || 'Rahul Sharma'}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  ({emg.patient_profile?.age || 54}y, {emg.patient_profile?.blood_group || 'O+'})
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem', lineHeight: '1.3' }}>
                "{emg.chief_complaint}"
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Building2 size={14} color="#f59e0b" />
                  <span>{emg.hospital?.name || 'City Hospital'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Truck size={14} color="#ef4444" />
                  <span>{emg.ambulance?.vehicle_number || 'AP 05 AB 1234'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
