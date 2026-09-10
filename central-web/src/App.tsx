import React, { useState } from 'react';
import { Activity, ShieldAlert, Radio, Building2, Truck, Clock, RefreshCw } from 'lucide-react';
import { EmergencyDashboard } from './components/EmergencyDashboard';
import { LiveTrackingMap } from './components/LiveTrackingMap';
import { EmergencyTimeline } from './components/EmergencyTimeline';
import { AIConversationView } from './components/AIConversationView';
import { EmergencyRequest, AIMessage, EMERGENCY_STATUS_ORDER } from '@shared';

// Mock initial dataset for Hackathon demo
const MOCK_EMERGENCIES: EmergencyRequest[] = [
  {
    id: 'emg-1024',
    patient_id: 'a1111111-1111-1111-1111-111111111111',
    chief_complaint: 'My father suddenly has severe chest pain and breathlessness.',
    input_type: 'voice',
    status: 'DRIVER_NAVIGATING',
    patient_latitude: 17.0005,
    patient_longitude: 81.7800,
    patient_address: 'Main Road, Rajahmundry',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    updated_at: new Date().toISOString(),
    patient_profile: {
      id: 'p-1',
      user_id: 'u-1',
      full_name: 'Rahul Sharma',
      age: 54,
      gender: 'Male',
      phone: '+919876543210',
      blood_group: 'O+',
      medical_conditions: ['Diabetes Type 2', 'Hypertension'],
      allergies: ['Penicillin'],
      created_at: new Date().toISOString(),
    },
    hospital: {
      id: 'h-1',
      name: 'City General Emergency Hospital',
      address: 'Main Road, Rajahmundry',
      latitude: 17.0080,
      longitude: 81.7850,
      phone: '+918832441122',
      available_icui_beds: 4,
      is_active: true,
    },
    ambulance: {
      id: 'amb-1',
      vehicle_number: 'AP 05 AB 1234',
      driver_name: 'Suresh Kumar',
      driver_phone: '+919876543212',
      current_latitude: 17.0030,
      current_longitude: 81.7820,
      status: 'ON_EMERGENCY',
    },
  },
];

const INITIAL_AI_MESSAGES: AIMessage[] = [
  {
    id: 'msg-1',
    emergency_id: 'emg-1024',
    sender: 'ai',
    content: 'What problem are you facing right now?',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'msg-2',
    emergency_id: 'emg-1024',
    sender: 'patient',
    content: 'My father suddenly has severe chest pain.',
    created_at: new Date(Date.now() - 14 * 60000).toISOString(),
  },
  {
    id: 'msg-3',
    emergency_id: 'emg-1024',
    sender: 'ai',
    content: 'Is he conscious and responsive right now?',
    suggested_answers: ['Yes, conscious', 'Drowsy / Confused', 'Unconscious'],
    created_at: new Date(Date.now() - 13 * 60000).toISOString(),
  },
  {
    id: 'msg-4',
    emergency_id: 'emg-1024',
    sender: 'patient',
    content: 'Yes, conscious.',
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: 'msg-5',
    emergency_id: 'emg-1024',
    sender: 'ai',
    content: 'Is he breathing normally or gasping for air?',
    suggested_answers: ['Breathing normally', 'Shortness of breath', 'Gasping'],
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
];

export function App() {
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(MOCK_EMERGENCIES);
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyRequest>(MOCK_EMERGENCIES[0]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);

  const handleSimulateNextStep = () => {
    if (!selectedEmergency) return;
    const currentIndex = EMERGENCY_STATUS_ORDER.indexOf(selectedEmergency.status);
    const nextIndex = (currentIndex + 1) % EMERGENCY_STATUS_ORDER.length;
    const nextStatus = EMERGENCY_STATUS_ORDER[nextIndex];

    const updated = {
      ...selectedEmergency,
      status: nextStatus,
      updated_at: new Date().toISOString(),
    };

    setSelectedEmergency(updated);
    setEmergencies((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleSendMessage = (text: string) => {
    const userMsg: AIMessage = {
      id: `msg-${Date.now()}`,
      emergency_id: selectedEmergency.id,
      sender: 'patient',
      content: text,
      created_at: new Date().toISOString(),
    };

    const aiReply: AIMessage = {
      id: `msg-${Date.now() + 1}`,
      emergency_id: selectedEmergency.id,
      sender: 'ai',
      content: 'Understood. Updating ER doctor context file. Would you like to share past cardiac scan reports with City Hospital?',
      suggested_answers: ['Grant Access to Reports', 'Skip Report Sharing'],
      created_at: new Date().toISOString(),
    };

    setAiMessages((prev) => [...prev, userMsg, aiReply]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Header Navbar */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <ShieldAlert size={26} color="#ffffff" />
          </div>
          <div className="brand-title">
            <h1>AI Healthcare Access & Emergency Hub</h1>
            <span>Central Coordination Dashboard • Supabase + Gemini</span>
          </div>
        </div>

        <div className="header-badges">
          <div className="live-pulse-badge">
            <span className="pulse-dot"></span>
            Realtime WebSocket Active
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            System Time: <span style={{ color: '#f8fafc', fontWeight: 600 }}>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="dashboard-grid">
        {/* Left Panel: Active Emergencies */}
        <EmergencyDashboard
          emergencies={emergencies}
          selectedEmergency={selectedEmergency}
          onSelectEmergency={setSelectedEmergency}
          onSimulateNextStep={handleSimulateNextStep}
        />

        {/* Middle Panel: Live GPS Map Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <div style={{ flex: 1 }}>
            <LiveTrackingMap emergency={selectedEmergency} />
          </div>
          <div style={{ height: '240px' }}>
            <AIConversationView messages={aiMessages} onSendMessage={handleSendMessage} />
          </div>
        </div>

        {/* Right Panel: Audit Timeline */}
        <EmergencyTimeline emergency={selectedEmergency} />
      </main>
    </div>
  );
}

export default App;
