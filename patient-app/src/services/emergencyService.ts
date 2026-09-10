import { EmergencyRequest, AIMessage, AmbulanceLocation, PatientProfile } from '../types';
import { supabase } from './supabase';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mock-hospital-supabase.supabase.co';

// Local state fallback for offline / disconnected development
let mockEmergencies: Record<string, EmergencyRequest> = {};
let mockMessages: Record<string, AIMessage[]> = {};
let mockLocations: Record<string, AmbulanceLocation> = {};

/**
 * Trigger an emergency request. Connects to Edge Function `/functions/v1/create-emergency`
 * falling back to resilient local mock objects if backend service is offline.
 */
export const createEmergencyRequest = async (
  chiefComplaint: string,
  inputType: 'voice' | 'text',
  location: { latitude: number; longitude: number; address?: string },
  patientId: string = 'mock-patient-123'
): Promise<EmergencyRequest> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-emergency`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patient_id: patientId,
        chief_complaint: chiefComplaint,
        input_type: inputType,
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          address_text: location.address || 'Detected Location',
        },
        requires_ambulance: true,
      }),
    });

    const result = await response.json();
    if (result.success && result.data) {
      return {
        id: result.data.emergency_id,
        patient_id: patientId,
        chief_complaint: chiefComplaint,
        input_type: inputType,
        status: result.data.status || 'REQUESTED',
        patient_latitude: location.latitude,
        patient_longitude: location.longitude,
        patient_address: location.address,
        hospital_id: result.data.notified_hospital_id,
        created_at: result.data.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.log('[EmergencyService] Backend unreachable, utilizing resilient local state.');
  }

  // Resilient Fallback
  const newEmergency: EmergencyRequest = {
    id: `emg-${Date.now()}`,
    patient_id: patientId,
    chief_complaint: chiefComplaint,
    input_type: inputType,
    status: 'AMBULANCE_SEARCHING',
    patient_latitude: location.latitude,
    patient_longitude: location.longitude,
    patient_address: location.address || 'Detected GPS Location',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ambulance: {
      id: 'amb-101',
      vehicle_number: 'AMB-8899',
      driver_name: 'John Doe',
      driver_phone: '+1 (555) 019-2831',
      current_latitude: location.latitude + 0.015,
      current_longitude: location.longitude + 0.015,
      status: 'ON_EMERGENCY'
    }
  };

  mockEmergencies[newEmergency.id] = newEmergency;

  mockMessages[newEmergency.id] = [
    {
      id: `msg-1`,
      emergency_id: newEmergency.id,
      sender: 'ai',
      content: `Emergency request initiated for "${chiefComplaint}". An ambulance search is active. Are you or the patient currently conscious and breathing normally?`,
      suggested_answers: ['Conscious & Breathing', 'Difficulty Breathing', 'Unconscious'],
      created_at: new Date().toISOString()
    }
  ];

  mockLocations[newEmergency.id] = {
    id: `loc-1`,
    ambulance_id: 'amb-101',
    emergency_id: newEmergency.id,
    latitude: location.latitude + 0.015,
    longitude: location.longitude + 0.015,
    heading: 180,
    speed: 45,
    updated_at: new Date().toISOString()
  };

  return newEmergency;
};

/**
 * Fetch emergency status from Supabase table or local memory fallback.
 */
export const fetchEmergencyDetails = async (emergencyId: string): Promise<EmergencyRequest | null> => {
  try {
    const { data, error } = await supabase
      .from('emergency_requests')
      .select('*, patient_profile(*), hospital(*), ambulance(*)')
      .eq('id', emergencyId)
      .single();

    if (data && !error) {
      return data as EmergencyRequest;
    }
  } catch (e) {
    // Fallback
  }
  return mockEmergencies[emergencyId] || null;
};

/**
 * Fetch chat message history.
 */
export const fetchChatMessages = async (emergencyId: string): Promise<AIMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('emergency_id', emergencyId)
      .order('created_at', { ascending: true });

    if (data && !error && data.length > 0) {
      return data as AIMessage[];
    }
  } catch (e) {
    // Fallback
  }
  return mockMessages[emergencyId] || [];
};

/**
 * Send chat message to Edge Function `/functions/v1/ai-chat`
 */
export const sendChatMessage = async (
  emergencyId: string,
  content: string
): Promise<AIMessage[]> => {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emergency_id: emergencyId,
        patient_message: content,
        action: 'NEXT_QUESTION',
      }),
    });

    const result = await response.json();
    if (result.success && result.data) {
      const messages = await fetchChatMessages(emergencyId);
      return messages;
    }
  } catch (e) {
    console.log('[EmergencyService] AI Chat endpoint unreachable, using local fallback.');
  }

  // Fallback AI simulation
  const messages = mockMessages[emergencyId] || [];
  
  const userMsg: AIMessage = {
    id: `msg-${Date.now()}`,
    emergency_id: emergencyId,
    sender: 'patient',
    content,
    created_at: new Date().toISOString()
  };
  messages.push(userMsg);

  let aiReply = "Thank you. Our medical response team has been updated. Please stay calm and keep your location accessible.";
  let suggestions: string[] | undefined = undefined;

  if (content.toLowerCase().includes('unconscious') || content.toLowerCase().includes('difficulty')) {
    aiReply = "CRITICAL UPDATE: Dispatch priority elevated. If safe, turn the patient onto their side in the recovery position. Is there severe bleeding?";
    suggestions = ['No Bleeding', 'Controlled Bleeding', 'Severe Bleeding'];
  } else if (content.toLowerCase().includes('bleeding')) {
    aiReply = "Apply firm, continuous pressure to the wound using a clean cloth. Do not remove the pressure until help arrives.";
    suggestions = ['Under Control', 'Need Instructions'];
  }

  const aiMsg: AIMessage = {
    id: `msg-${Date.now() + 1}`,
    emergency_id: emergencyId,
    sender: 'ai',
    content: aiReply,
    suggested_answers: suggestions,
    created_at: new Date().toISOString()
  };
  
  messages.push(aiMsg);
  mockMessages[emergencyId] = messages;
  return messages;
};

/**
 * Subscribe or poll ambulance live location updates.
 */
export const getAmbulanceLocation = async (emergencyId: string): Promise<AmbulanceLocation | null> => {
  try {
    const { data, error } = await supabase
      .from('ambulance_locations')
      .select('*')
      .eq('emergency_id', emergencyId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (data && !error) {
      return data as AmbulanceLocation;
    }
  } catch (e) {
    // Fallback
  }

  const loc = mockLocations[emergencyId];
  if (loc) {
    const target = mockEmergencies[emergencyId];
    if (target) {
      loc.latitude += (target.patient_latitude - loc.latitude) * 0.1;
      loc.longitude += (target.patient_longitude - loc.longitude) * 0.1;
      loc.updated_at = new Date().toISOString();
    }
  }
  return loc || null;
};

export const mockPatientProfile: PatientProfile = {
  id: 'profile-123',
  user_id: 'usr-456',
  full_name: 'Jane Doe',
  age: 34,
  gender: 'Female',
  phone: '+1 (555) 234-5678',
  blood_group: 'O+',
  allergies: ['Penicillin', 'Peanuts'],
  medical_conditions: ['Asthma'],
  regular_medications: ['Albuterol Inhaler'],
  created_at: new Date().toISOString()
};
