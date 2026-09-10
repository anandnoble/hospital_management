import React, { useState } from 'react';
import { 
  AlertCircle, 
  Clock, 
  MapPin, 
  Truck, 
  FileText, 
  Navigation, 
  CheckCircle2,
  ChevronRight,
  User,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface EmergencyListProps {
  emergencies: any[];
  selectedEmergencyId: string | null;
  onSelectEmergency: (emergency: any) => void;
  onOpenDetails: (emergency: any) => void;
}

export const EmergencyList: React.FC<EmergencyListProps> = ({
  emergencies,
  selectedEmergencyId,
  onSelectEmergency,
  onOpenDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING' | 'HISTORY'>('ACTIVE');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
      case 'HOSPITAL_NOTIFIED':
        return <span className="badge badge-requested">PENDING ACCEPTANCE</span>;
      case 'HOSPITAL_ACCEPTED':
        return <span className="badge badge-accepted">HOSPITAL ACCEPTED</span>;
      case 'AMBULANCE_SEARCHING':
      case 'AMBULANCE_ASSIGNED':
        return <span className="badge badge-navigating">DISPATCHING AMBULANCE</span>;
      case 'DRIVER_NAVIGATING':
        return <span className="badge badge-navigating">DRIVER EN ROUTE TO PATIENT</span>;
      case 'ARRIVED_AT_PATIENT':
        return <span className="badge badge-arrived">ARRIVED AT PATIENT</span>;
      case 'PATIENT_PICKED_UP':
      case 'NAVIGATING_TO_HOSPITAL':
        return <span className="badge badge-navigating">INBOUND TO ER BAY</span>;
      case 'ARRIVED_AT_HOSPITAL':
        return <span className="badge badge-arrived">ARRIVED AT ER BAY</span>;
      case 'COMPLETED':
        return <span className="badge badge-completed">CASE COMPLETED</span>;
      default:
        return <span className="badge badge-completed">{status}</span>;
    }
  };

  const getElapsedTime = (timestamp: string) => {
    if (!timestamp) return 'Just now';
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 min ago';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours} hr ago`;
  };

  const activeEmergencies = emergencies.filter(e => 
    ['HOSPITAL_ACCEPTED', 'AMBULANCE_SEARCHING', 'AMBULANCE_ASSIGNED', 'DRIVER_NAVIGATING', 'ARRIVED_AT_PATIENT', 'PATIENT_PICKED_UP', 'NAVIGATING_TO_HOSPITAL', 'ARRIVED_AT_HOSPITAL'].includes(e.status)
  );

  const pendingEmergencies = emergencies.filter(e => 
    ['REQUESTED', 'HOSPITAL_NOTIFIED'].includes(e.status)
  );

  const historyEmergencies = emergencies.filter(e => 
    ['COMPLETED', 'HOSPITAL_DECLINED', 'DRIVER_DECLINED'].includes(e.status)
  );

  const displayedList = activeTab === 'ACTIVE' 
    ? activeEmergencies 
    : activeTab === 'PENDING' 
      ? pendingEmergencies 
      : historyEmergencies;

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity style={{ width: '20px', height: '20px', color: '#ef4444' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            EMERGENCY TRIAGE DASHBOARD
          </h2>
        </div>

        {/* Filter Tabs */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '3px',
          borderRadius: '10px',
          display: 'flex',
          gap: '4px'
        }}>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            style={{
              background: activeTab === 'ACTIVE' ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
              color: activeTab === 'ACTIVE' ? '#38bdf8' : '#94a3b8',
              border: activeTab === 'ACTIVE' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid transparent',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            INBOUND & ACTIVE ({activeEmergencies.length})
          </button>

          <button
            onClick={() => setActiveTab('PENDING')}
            style={{
              background: activeTab === 'PENDING' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              color: activeTab === 'PENDING' ? '#fca5a5' : '#94a3b8',
              border: activeTab === 'PENDING' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid transparent',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            PENDING ({pendingEmergencies.length})
          </button>

          <button
            onClick={() => setActiveTab('HISTORY')}
            style={{
              background: activeTab === 'HISTORY' ? 'rgba(107, 114, 128, 0.2)' : 'transparent',
              color: activeTab === 'HISTORY' ? '#e2e8f0' : '#94a3b8',
              border: activeTab === 'HISTORY' ? '1px solid rgba(107, 114, 128, 0.4)' : '1px solid transparent',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            HISTORY ({historyEmergencies.length})
          </button>
        </div>
      </div>

      {/* List Container */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
        {displayedList.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b',
            background: 'rgba(15, 23, 42, 0.4)',
            borderRadius: '12px',
            border: '1px dashed rgba(255, 255, 255, 0.08)'
          }}>
            <ShieldCheck style={{ width: '36px', height: '36px', margin: '0 auto 10px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No emergencies in this category</p>
            <span style={{ fontSize: '0.75rem' }}>Active emergency updates will populate here automatically</span>
          </div>
        ) : (
          displayedList.map((item) => {
            const isSelected = item.id === selectedEmergencyId;
            const patient = item.patient_profiles || item.patient_profile;

            return (
              <div
                key={item.id}
                onClick={() => onSelectEmergency(item)}
                style={{
                  background: isSelected 
                    ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(15, 23, 42, 0.9))' 
                    : 'rgba(15, 23, 42, 0.5)',
                  border: isSelected 
                    ? '1px solid rgba(6, 182, 212, 0.5)' 
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                {/* Header Row: Status Badge & Elapsed Time */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  {getStatusBadge(item.status)}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>
                    <Clock style={{ width: '12px', height: '12px' }} />
                    {getElapsedTime(item.created_at)}
                  </div>
                </div>

                {/* Patient Name & Chief Complaint */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User style={{ width: '15px', height: '15px', color: '#38bdf8' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>
                      {patient?.full_name || 'Rahul Sharma'}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      ({patient?.age ? `${patient.age} y/o` : '54 y/o'} {patient?.gender || 'M'})
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '4px', fontStyle: 'italic', fontWeight: 500 }}>
                    "{item.chief_complaint}"
                  </p>
                </div>

                {/* Location & Vehicle Details */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.78rem', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin style={{ width: '13px', height: '13px', color: '#ef4444' }} />
                    <span>{item.patient_address || 'Rajahmundry Main Road'}</span>
                  </div>

                  {item.ambulance && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 600 }}>
                      <Truck style={{ width: '13px', height: '13px' }} />
                      <span>{item.ambulance.vehicle_number || 'AP 05 AB 1234'}</span>
                    </div>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetails(item);
                    }}
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: '#67e8f9',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginLeft: 'auto'
                    }}
                  >
                    <FileText style={{ width: '12px', height: '12px' }} />
                    Vitals & Documents
                    <ChevronRight style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
