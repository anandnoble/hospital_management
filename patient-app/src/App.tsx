import React, { useState } from 'react';
import { ShieldAlert, Heart, User, Home, FileText, PhoneCall, RefreshCw } from 'lucide-react';
import { HomeSelector } from './components/HomeSelector';
import { EmergencyInputModal } from './components/EmergencyInputModal';
import { LiveAmbulanceMap } from './components/LiveAmbulanceMap';
import { AIChatDrawer } from './components/AIChatDrawer';
import { PatientProfileView } from './components/PatientProfileView';
import { EmergencyStatusHeader } from './components/EmergencyStatusHeader';
import { EmergencyRequest, PatientProfile, AIMessage, EmergencyStatus } from '@shared';

const MOCK_PATIENT_PROFILE: PatientProfile = {
  id: 'a1111111-1111-1111-1111-111111111111',
  user_id: '11111111-1111-1111-1111-111111111111',
  full_name: 'Rahul Sharma',
  age: 54,
  gender: 'Male',
  phone: '+919876543210',
  blood_group: 'O+',
  allergies: ['Penicillin'],
  medical_conditions: ['Diabetes Type 2', 'Hypertension'],
  regular_medications: ['Metformin 500mg', 'Amlodipine 5mg'],
  created_at: new Date().toISOString(),
};

const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-1',
    emergency_id: 'emg-live',
    sender: 'ai',
    content: 'What problem are you facing right now?',
    created_at: new Date().toISOString(),
  },
  {
    id: 'msg-2',
    emergency_id: 'emg-live',
    sender: 'ai',
    content: 'Is the patient conscious and responsive right now?',
    suggested_answers: ['Yes, fully conscious', 'Drowsy / Confused', 'Unconscious'],
    created_at: new Date().toISOString(),
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'active_emergency' | 'profile'>('home');
  const [showInputModal, setShowInputModal] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<EmergencyRequest | null>(null);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(MOCK_PATIENT_PROFILE);

  const handleStartEmergencyModal = () => {
    setShowInputModal(true);
  };

  const handleSubmitEmergency = (complaint: string, inputType: 'voice' | 'text') => {
    setShowInputModal(false);

    const newEmergency: EmergencyRequest = {
      id: `emg-${Date.now().toString().slice(-4)}`,
      patient_id: patientProfile.id,
      chief_complaint: complaint,
      input_type: inputType,
      status: 'HOSPITAL_NOTIFIED',
      patient_latitude: 17.0005,
      patient_longitude: 81.7800,
      patient_address: 'Main Road, Rajahmundry',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      patient_profile: patientProfile,
      hospital: {
        id: 'c1111111-1111-1111-1111-111111111111',
        name: 'City General Emergency Hospital',
        address: 'Main Road, Rajahmundry',
        latitude: 17.0005,
        longitude: 81.7800,
        phone: '+918832441122',
        available_icui_beds: 4,
        is_active: true,
      },
      ambulance: {
        id: 'b1111111-1111-1111-1111-111111111111',
        vehicle_number: 'AP 05 AB 1234',
        driver_name: 'Suresh Kumar',
        driver_phone: '+919876543212',
        current_latitude: 17.0020,
        current_longitude: 81.7820,
        status: 'ON_EMERGENCY',
      },
    };

    setActiveEmergency(newEmergency);
    setActiveTab('active_emergency');

    // Add initial user complaint to AI chat log
    setAiMessages([
      ...INITIAL_AI_MESSAGES,
      {
        id: `msg-${Date.now()}`,
        emergency_id: newEmergency.id,
        sender: 'patient',
        content: complaint,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleSendAIMessage = (text: string) => {
    if (!activeEmergency) return;

    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      emergency_id: activeEmergency.id,
      sender: 'patient',
      content: text,
      created_at: new Date().toISOString(),
    };

    const aiReply: AIMessage = {
      id: `msg-${Date.now() + 1}`,
      emergency_id: activeEmergency.id,
      sender: 'ai',
      content: 'Understood. Adding to ER triage context. Is someone currently with the patient?',
      suggested_answers: ['Yes, family member', 'Bystanders present', 'Patient is alone'],
      created_at: new Date().toISOString(),
    };

    setAiMessages((prev) => [...prev, userMsg, aiReply]);
  };

  return (
    <div className="mobile-app-container">
      {/* Top Mobile App Bar Header */}
      <header className="patient-header">
        <div className="brand-badge">
          <div className="brand-logo">
            <ShieldAlert size={22} color="#ffffff" />
          </div>
          <div className="brand-text">
            <h1>AI Patient Assistant</h1>
            <span>Emergency Healthcare Booking</span>
          </div>
        </div>

        {activeEmergency && (
          <button
            onClick={() => setActiveTab('active_emergency')}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '0.35rem 0.65rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span className="pulse-dot" /> Live Active
          </button>
        )}
      </header>

      {/* Active Status Bar when on Active Emergency tab */}
      {activeTab === 'active_emergency' && activeEmergency && (
        <EmergencyStatusHeader
          status={activeEmergency.status}
          hospitalName={activeEmergency.hospital?.name}
          ambulanceVehicle={activeEmergency.ambulance?.vehicle_number}
        />
      )}

      {/* Main Tab Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'home' && (
          <HomeSelector
            onTriggerEmergency={handleStartEmergencyModal}
            onOpenProfile={() => setActiveTab('profile')}
            patientProfile={patientProfile}
          />
        )}

        {activeTab === 'active_emergency' && activeEmergency && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
            <LiveAmbulanceMap emergency={activeEmergency} />
            <AIChatDrawer messages={aiMessages} onSendMessage={handleSendAIMessage} />
          </div>
        )}

        {activeTab === 'profile' && (
          <PatientProfileView profile={patientProfile} onClose={() => setActiveTab('home')} />
        )}
      </main>

      {/* Emergency Voice/Text Input Modal */}
      {showInputModal && (
        <EmergencyInputModal
          onClose={() => setShowInputModal(false)}
          onSubmitEmergency={handleSubmitEmergency}
        />
      )}

      {/* Bottom Mobile Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'active_emergency' ? 'active' : ''}`}
          onClick={() => {
            if (activeEmergency) {
              setActiveTab('active_emergency');
            } else {
              handleStartEmergencyModal();
            }
          }}
        >
          <ShieldAlert size={20} color={activeEmergency ? '#ef4444' : undefined} />
          <span>{activeEmergency ? 'Active Trip' : 'Emergency'}</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
