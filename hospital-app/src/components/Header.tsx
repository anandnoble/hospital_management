import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Activity, 
  BedDouble, 
  User, 
  Power, 
  Plus, 
  Minus, 
  Radio
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  currentHospitalId: string;
  onHospitalChange: (hospitalId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentHospitalId, onHospitalChange }) => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [isOnDuty, setIsOnDuty] = useState<boolean>(true);
  const [icuBeds, setIcuBeds] = useState<number>(4);
  const [updatingBeds, setUpdatingBeds] = useState<boolean>(false);

  useEffect(() => {
    fetchHospitals();
    fetchStaffDetails();
  }, [currentHospitalId]);

  const fetchHospitals = async () => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name');
      if (data && data.length > 0) {
        setHospitals(data);
        const current = data.find((h: any) => h.id === currentHospitalId);
        if (current) {
          setIcuBeds(current.available_icu_beds || 0);
        }
      }
    } catch (e) {
      console.error('Error fetching hospitals:', e);
    }
  };

  const fetchStaffDetails = async () => {
    try {
      const { data } = await supabase
        .from('hospital_staff')
        .select('*, users(full_name, email)')
        .eq('hospital_id', currentHospitalId)
        .limit(1)
        .maybeSingle();

      if (data) {
        setStaffInfo(data);
        setIsOnDuty(data.is_on_duty);
      }
    } catch (e) {
      console.error('Error fetching staff details:', e);
    }
  };

  const toggleDutyStatus = async () => {
    const nextStatus = !isOnDuty;
    setIsOnDuty(nextStatus);

    if (staffInfo?.id) {
      try {
        await supabase
          .from('hospital_staff')
          .update({ is_on_duty: nextStatus })
          .eq('id', staffInfo.id);
      } catch (e) {
        console.error('Failed to update duty status', e);
      }
    }
  };

  const handleBedChange = async (delta: number) => {
    const newCount = Math.max(0, icuBeds + delta);
    setIcuBeds(newCount);
    setUpdatingBeds(true);

    try {
      await supabase
        .from('hospitals')
        .update({ available_icu_beds: newCount })
        .eq('id', currentHospitalId);
    } catch (e) {
      console.error('Error updating bed count:', e);
    } finally {
      setUpdatingBeds(false);
    }
  };

  const activeHospital = hospitals.find((h) => h.id === currentHospitalId) || {
    name: 'City General Emergency Hospital',
    address: 'Main Road, Rajahmundry'
  };

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand & Hospital Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #ef4444, #9333ea)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
          }}>
            <Building2 style={{ width: '24px', height: '24px', color: '#fff' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                ER COMMAND CENTER
              </h1>
              <span style={{
                fontSize: '0.7rem',
                background: 'rgba(6, 182, 212, 0.15)',
                color: '#67e8f9',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                fontWeight: 600
              }}>
                AGENT 2
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <Building2 style={{ width: '13px', height: '13px', color: '#94a3b8' }} />
              <select 
                value={currentHospitalId}
                onChange={(e) => onHospitalChange(e.target.value)}
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {hospitals.length > 0 ? (
                  hospitals.map((h) => (
                    <option key={h.id} value={h.id} style={{ background: '#0f172a', color: '#fff' }}>
                      {h.name} ({h.address})
                    </option>
                  ))
                ) : (
                  <option value={currentHospitalId} style={{ background: '#0f172a', color: '#fff' }}>
                    {activeHospital.name}
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Live Status & ICU Bed Quick Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* ICU Bed Counter */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BedDouble style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
              <div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
                  Available ICU Beds
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: icuBeds > 0 ? '#38bdf8' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                  {icuBeds} {icuBeds === 1 ? 'Bed' : 'Beds'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                onClick={() => handleBedChange(-1)}
                disabled={icuBeds === 0 || updatingBeds}
                title="Decrease available beds"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: icuBeds === 0 ? 0.3 : 1
                }}
              >
                <Minus style={{ width: '14px', height: '14px' }} />
              </button>

              <button 
                onClick={() => handleBedChange(1)}
                disabled={updatingBeds}
                title="Increase available beds"
                style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: '#38bdf8',
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          </div>

          {/* Duty Status Switch */}
          <div 
            onClick={toggleDutyStatus}
            style={{
              background: isOnDuty ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${isOnDuty ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              padding: '6px 14px',
              borderRadius: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: isOnDuty ? '#10b981' : '#ef4444',
              boxShadow: isOnDuty ? '0 0 10px #10b981' : '0 0 10px #ef4444'
            }} />
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isOnDuty ? '#6ee7b7' : '#fca5a5' }}>
                {isOnDuty ? 'ON DUTY' : 'OFF DUTY'}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                {isOnDuty ? 'Receiving Priority Emergencies' : 'Alerts Paused'}
              </span>
            </div>

            <Power style={{ width: '16px', height: '16px', color: isOnDuty ? '#10b981' : '#ef4444', marginLeft: '4px' }} />
          </div>

          {/* Staff Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              color: '#fff',
              fontSize: '0.9rem'
            }}>
              <User style={{ width: '18px', height: '18px' }} />
            </div>

            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f1f5f9' }}>
                {staffInfo?.users?.full_name || 'Dr. Ananya Rao'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                ER Duty Officer
              </div>
            </div>
          </div>

          {/* Realtime Live Pulse */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
            <Radio style={{ width: '14px', height: '14px', animation: 'pulse 1.5s infinite' }} />
            <span>REALTIME</span>
          </div>

        </div>

      </div>
    </header>
  );
};
