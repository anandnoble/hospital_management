import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, Building2, Truck, CheckCircle2, Sparkles, Navigation } from 'lucide-react';
import { EmergencyRequest } from '@shared';

interface EmergencySimulatorProps {
  currentEmergency: EmergencyRequest | null;
  onUpdateStatus: (newStatus: any) => void;
  onResetDemo: () => void;
  onCreateNewEmergency: (complaint: string) => void;
}

export const EmergencySimulator: React.FC<EmergencySimulatorProps> = ({
  currentEmergency,
  onUpdateStatus,
  onResetDemo,
  onCreateNewEmergency,
}) => {
  const [customComplaint, setCustomComplaint] = useState('My father has severe chest pain and dizziness.');
  const [isOpen, setIsOpen] = useState(false);

  const status = currentEmergency?.status || 'REQUESTED';

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px', padding: '1rem 1.25rem', marginBottom: '1.25rem', boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sparkles size={20} color="#ef4444" />
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              Judge Demo — Emergency Lifecycle Simulator
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Simulate Patient, Hospital, Ambulance Driver & AI actions live
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
          >
            {isOpen ? 'Hide Controls' : 'Show Controls'}
          </button>
          <button
            onClick={onResetDemo}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick Action Step Buttons */}
          <div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              Trigger State Transitions:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                onClick={() => onUpdateStatus('HOSPITAL_NOTIFIED')}
                disabled={status !== 'REQUESTED'}
                className="btn-secondary"
                style={{ opacity: status === 'REQUESTED' ? 1 : 0.5, fontSize: '0.75rem' }}
              >
                1. 🔔 Notify Hospital
              </button>
              <button
                onClick={() => onUpdateStatus('HOSPITAL_ACCEPTED')}
                disabled={status !== 'HOSPITAL_NOTIFIED'}
                className="btn-secondary"
                style={{ opacity: status === 'HOSPITAL_NOTIFIED' ? 1 : 0.5, fontSize: '0.75rem' }}
              >
                2. 🏥 Hospital Accepts
              </button>
              <button
                onClick={() => onUpdateStatus('AMBULANCE_ASSIGNED')}
                disabled={status !== 'HOSPITAL_ACCEPTED' && status !== 'AMBULANCE_SEARCHING'}
                className="btn-secondary"
                style={{ opacity: status === 'HOSPITAL_ACCEPTED' || status === 'AMBULANCE_SEARCHING' ? 1 : 0.5, fontSize: '0.75rem' }}
              >
                3. 🚑 Driver Accepts
              </button>
              <button
                onClick={() => onUpdateStatus('DRIVER_NAVIGATING')}
                disabled={status !== 'AMBULANCE_ASSIGNED'}
                className="btn-secondary"
                style={{ opacity: status === 'AMBULANCE_ASSIGNED' ? 1 : 0.5, fontSize: '0.75rem' }}
              >
                4. 🧭 Start Navigation
              </button>
              <button
                onClick={() => onUpdateStatus('ARRIVED_AT_PATIENT')}
                disabled={status !== 'DRIVER_NAVIGATING'}
                className="btn-secondary"
                style={{ opacity: status === 'DRIVER_NAVIGATING' ? 1 : 0.5, fontSize: '0.75rem' }}
              >
                5. 📍 Arrived Patient
              </button>
              <button
                onClick={() => onUpdateStatus('PATIENT_PICKED_UP')}
                disabled={status !== 'ARRIVED_AT_PATIENT'}
                className="btn-secondary"
                style={{ opacity: status === 'ARRIVED_AT_PATIENT' ? 1 : 0.5, fontSize: '0.75rem' }}
              >
                6. 🩺 Patient Picked Up
              </button>
              <button
                onClick={() => onUpdateStatus('ARRIVED_AT_HOSPITAL')}
                disabled={status !== 'PATIENT_PICKED_UP' && status !== 'NAVIGATING_TO_HOSPITAL'}
                className="btn-secondary"
                style={{ opacity: status === 'PATIENT_PICKED_UP' || status === 'NAVIGATING_TO_HOSPITAL' ? 1 : 0.5, fontSize: '0.75rem' }}
              >
                7. 🏥 Arrived ER Bay
              </button>
              <button
                onClick={() => onUpdateStatus('COMPLETED')}
                disabled={status !== 'ARRIVED_AT_HOSPITAL'}
                className="btn-primary"
                style={{ opacity: status === 'ARRIVED_AT_HOSPITAL' ? 1 : 0.5, fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
              >
                8. ✅ Complete Emergency
              </button>
            </div>
          </div>

          {/* Trigger Custom New Emergency */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="text"
              value={customComplaint}
              onChange={(e) => setCustomComplaint(e.target.value)}
              placeholder="Enter patient emergency problem..."
              style={{
                flex: 1,
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                color: '#f8fafc',
                fontSize: '0.85rem',
              }}
            />
            <button
              onClick={() => onCreateNewEmergency(customComplaint)}
              className="btn-primary"
              style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}
            >
              <AlertTriangle size={14} /> Create Emergency
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
