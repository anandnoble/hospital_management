/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://demo-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Helper to subscribe to live updates on active emergency requests.
 */
export function subscribeToEmergencyRequests(onUpdate: (payload: any) => void) {
  return supabase
    .channel('public:emergency_requests')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_requests' }, onUpdate)
    .subscribe();
}

/**
 * Helper to subscribe to real-time ambulance GPS location updates.
 */
export function subscribeToAmbulanceLocations(emergencyId: string, onLocationUpdate: (payload: any) => void) {
  return supabase
    .channel(`public:ambulance_locations:${emergencyId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ambulance_locations' }, onLocationUpdate)
    .subscribe();
}
