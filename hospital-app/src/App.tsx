import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { EmergencyList } from './components/EmergencyList';
import { LiveTrackingMap } from './components/LiveTrackingMap';
import { EmergencyAlertBanner } from './components/EmergencyAlertBanner';
import { PatientDetailsModal } from './components/PatientDetailsModal';
import { supabase } from './lib/supabase';
import { PlusCircle, RefreshCw, AlertOctagon } from 'lucide-react';

export default function App() {
  const [currentHospitalId, setCurrentHospitalId] = useState<string>('c1111111-1111-1111-1111-111111111111');
  const [emergencies, setEmergencies] = useState<any[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<any>(null);
  const [alertEmergency, setAlertEmergency] = useState<any>(null);
  const [detailsEmergency, setDetailsEmergency] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hospitalInfo, setHospitalInfo] = useState<any>({
    name: 'City General Emergency Hospital',
    latitude: 17.0005,
    longitude: 81.7800
  });

  useEffect(() => {
    fetchHospitalInfo();
    fetchEmergencies();

    // Setup Supabase Realtime Subscription for emergencies table
    const channel = supabase
      .channel('hospital-emergencies-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'emergencies' },
        (payload) => {
          console.log('Realtime emergency update:', payload);
          fetchEmergencies();

          // Check if payload is a NEW high-priority emergency for this hospital
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const newRecord = payload.new;
            if (
              ['REQUESTED', 'HOSPITAL_NOTIFIED'].includes(newRecord.status) &&
              (!newRecord.hospital_id || newRecord.hospital_id === currentHospitalId)
            ) {
              setAlertEmergency(newRecord);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentHospitalId]);

  const fetchHospitalInfo = async () => {
    try {
      const { data } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', currentHospitalId)
        .maybeSingle();

      if (data) {
        setHospitalInfo({
          name: data.name,
          latitude: data.latitude,
          longitude: data.longitude
        });
      }
    } catch (e) {
      console.error('Error fetching hospital info:', e);
    }
  };

  const fetchEmergencies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('emergencies')
        .select(`
          *,
          patient_profiles (*),
          ambulances (*)
        `)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setEmergencies(data);

        // Check if there is an active pending alert
        const pending = data.find(e => 
          ['REQUESTED', 'HOSPITAL_NOTIFIED'].includes(e.status) &&
          (!e.hospital_id || e.hospital_id === currentHospitalId)
        );
        if (pending && !alertEmergency) {
          setAlertEmergency(pending);
        }

        // Set selected emergency for map
        if (!selectedEmergency) {
          setSelectedEmergency(data[0]);
        }
      } else {
        // Fallback mock emergencies for demonstration if DB table is empty
        const mockList = [
          {
            id: 'e1111111-1111-1111-1111-111111111111',
            patient_id: 'a1111111-1111-1111-1111-111111111111',
            hospital_id: currentHospitalId,
            chief_complaint: 'Severe chest pain, breathlessness and elevated heart rate',
            input_type: 'voice',
            status: 'HOSPITAL_ACCEPTED',
            patient_latitude: 17.0005,
            patient_longitude: 81.7800,
            patient_address: 'Rajahmundry Main Road, Near Clock Tower',
            created_at: new Date(Date.now() - 4 * 60000).toISOString(),
            patient_profiles: {
              full_name: 'Rahul Sharma',
              age: 54,
              gender: 'Male',
              phone: '+919876543210',
              blood_group: 'O+',
              allergies: ['Penicillin'],
              medical_conditions: ['Diabetes Type 2', 'Hypertension'],
              regular_medications: ['Metformin 500mg', 'Amlodipine 5mg']
            },
            ambulance: {
              id: 'b1111111-1111-1111-1111-111111111111',
              vehicle_number: 'AP 05 AB 1234',
              driver_name: 'Suresh Kumar',
              current_latitude: 17.0020,
              current_longitude: 81.7820,
              status: 'ON_EMERGENCY'
            }
          }
        ];
        setEmergencies(mockList);
        setSelectedEmergency(mockList[0]);
      }
    } catch (e) {
      console.error('Error fetching emergencies:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateEmergency = async () => {
    try {
      const newEmergency = {
        patient_id: 'a1111111-1111-1111-1111-111111111111',
        hospital_id: currentHospitalId,
        chief_complaint: 'Acute respiratory distress and dizziness',
        input_type: 'voice',
        status: 'HOSPITAL_NOTIFIED',
        patient_latitude: 17.0080,
        patient_longitude: 81.7850,
        patient_address: 'Danavaipeta, Rajahmundry',
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('emergencies')
        .insert(newEmergency)
        .select(`
          *,
          patient_profiles (*)
        `)
        .single();

      if (data) {
        setAlertEmergency(data);
        fetchEmergencies();
      }
    } catch (e) {
      console.error('Failed to trigger simulated emergency', e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Bar Header */}
      <Header
        currentHospitalId={currentHospitalId}
        onHospitalChange={(id) => setCurrentHospitalId(id)}
      />

      {/* Main Body Dashboard Grid */}
      <main style={{
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '24px'
      }}>
        
        {/* Quick Simulator & Control Bar */}
        <div style={{
          gridColumn: 'span 12',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 20px',
          borderRadius: '12px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>
            <AlertOctagon style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
            <span>Emergency Command Center active on <strong>{hospitalInfo.name}</strong></span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={fetchEmergencies}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw style={{ width: '14px', height: '14px' }} />
              Refresh Feeds
            </button>

            <button
              onClick={handleSimulateEmergency}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 12px rgba(239, 68, 68, 0.4)'
              }}
            >
              <PlusCircle style={{ width: '15px', height: '15px' }} />
              Simulate Incoming Dispatch
            </button>
          </div>
        </div>

        {/* Left Column: Triage List */}
        <div style={{ gridColumn: 'span 12', minHeight: '550px' }} className="lg-span-5">
          <EmergencyList
            emergencies={emergencies}
            selectedEmergencyId={selectedEmergency?.id}
            onSelectEmergency={(e) => setSelectedEmergency(e)}
            onOpenDetails={(e) => setDetailsEmergency(e)}
          />
        </div>

        {/* Right Column: Live Map Radar */}
        <div style={{ gridColumn: 'span 12', minHeight: '550px' }} className="lg-span-7">
          <LiveTrackingMap
            emergency={selectedEmergency}
            hospitalLocation={hospitalInfo}
          />
        </div>

      </main>

      {/* High-Priority Realtime Alert Banner Popup */}
      {alertEmergency && (
        <EmergencyAlertBanner
          emergency={alertEmergency}
          currentHospitalId={currentHospitalId}
          onActionComplete={() => {
            setAlertEmergency(null);
            fetchEmergencies();
          }}
        />
      )}

      {/* Patient Medical Details Modal */}
      {detailsEmergency && (
        <PatientDetailsModal
          emergency={detailsEmergency}
          onClose={() => setDetailsEmergency(null)}
        />
      )}

    </div>
  );
}
