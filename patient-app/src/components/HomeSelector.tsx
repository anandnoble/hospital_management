import React from 'react';
import { AlertCircle, ShieldAlert, Heart, Calendar, FileText, PhoneCall, ChevronRight } from 'lucide-react';
import { PatientProfile } from '@shared';

interface HomeSelectorProps {
  onTriggerEmergency: () => void;
  onOpenProfile: () => void;
  patientProfile: PatientProfile | null;
}

export const HomeSelector: React.FC<HomeSelectorProps> = ({
  onTriggerEmergency,
  onOpenProfile,
  patientProfile,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem 1rem' }}>
      {/* Patient Welcome Banner */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Welcome back,</span>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            {patientProfile?.full_name || 'Rahul Sharma'}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600 }}>
            Blood Group: {patientProfile?.blood_group || 'O+'} • Age {patientProfile?.age || 54}
          </span>
        </div>
        <button
          onClick={onOpenProfile}
          style={{
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: '#67e8f9',
            padding: '0.4rem 0.8rem',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Profile
        </button>
      </div>

      {/* Main Big Emergency Button */}
      <button className="big-emergency-btn" onClick={onTriggerEmergency}>
        <ShieldAlert size={36} />
        <span>EMERGENCY ASSISTANCE</span>
      </button>

      <div style={{ textAlign: 'center', margin: '-0.5rem 0 0.5rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#fca5a5', fontWeight: 600 }}>
          ⚡ Emergency First. Documentation Later. Tap for immediate dispatch.
        </span>
      </div>

      {/* Secondary Normal Care Options */}
      <div style={{ marginTop: '0.5rem' }}>
        <h3 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
          Non-Emergency Health Services
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 0, padding: '1rem', cursor: 'pointer' }} onClick={onOpenProfile}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.6rem', borderRadius: '12px' }}>
                <FileText size={20} color="#06b6d4" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>My Medical Records</h4>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ECG, Blood Reports, Prescriptions</span>
              </div>
            </div>
            <ChevronRight size={18} color="#64748b" />
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 0, padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.6rem', borderRadius: '12px' }}>
                <Calendar size={20} color="#10b981" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Book Regular Appointment</h4>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Schedule doctor OPD visit</span>
              </div>
            </div>
            <ChevronRight size={18} color="#64748b" />
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: 0, padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '0.6rem', borderRadius: '12px' }}>
                <PhoneCall size={20} color="#f59e0b" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Emergency Contacts</h4>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Family & Primary Physician</span>
              </div>
            </div>
            <ChevronRight size={18} color="#64748b" />
          </div>
        </div>
      </div>
    </div>
  );
};
