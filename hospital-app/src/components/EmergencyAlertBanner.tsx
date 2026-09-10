import React, { useEffect, useState } from 'react';
import { 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Clock, 
  Mic, 
  FileText, 
  ShieldAlert,
  User,
  HeartPulse
} from 'lucide-react';
import { sirenSynthesizer } from '../utils/audioAlert';
import { supabase } from '../lib/supabase';

interface EmergencyAlertBannerProps {
  emergency: any;
  currentHospitalId: string;
  onActionComplete: () => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  emergency,
  currentHospitalId,
  onActionComplete,
}) => {
  const [muted, setMuted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (emergency && !muted) {
      sirenSynthesizer.playSiren();
    }
    return () => {
      sirenSynthesizer.stopSiren();
    };
  }, [emergency, muted]);

  const toggleMute = () => {
    if (muted) {
      setMuted(false);
      sirenSynthesizer.playSiren();
    } else {
      setMuted(true);
      sirenSynthesizer.stopSiren();
    }
  };

  const handleResponse = async (action: 'ACCEPT' | 'DECLINE') => {
    setSubmitting(true);
    sirenSynthesizer.stopSiren();

    try {
      // 1. Attempt Edge Function invocation first per API contract
      const response = await fetch('https://fqgpmcijsloyjgcoldhe.supabase.co/functions/v1/hospital-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ''}`
        },
        body: JSON.stringify({
          hospital_id: currentHospitalId,
          staff_id: 'e1111111-1111-1111-1111-111111111111',
          emergency_id: emergency.id,
          action
        })
      });

      if (!response.ok) {
        throw new Error('Edge function response not ok');
      }
    } catch (edgeError) {
      console.warn('Edge Function hospital-action call fallback to direct DB update:', edgeError);
      
      // Fallback: Direct table update in Supabase
      const nextStatus = action === 'ACCEPT' ? 'HOSPITAL_ACCEPTED' : 'HOSPITAL_DECLINED';
      await supabase
        .from('emergencies')
        .update({
          status: nextStatus,
          hospital_id: action === 'ACCEPT' ? currentHospitalId : emergency.hospital_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', emergency.id);
    } finally {
      setSubmitting(false);
      onActionComplete();
    }
  };

  if (!emergency) return null;

  const patient = emergency.patient_profiles || emergency.patient_profile;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 7, 13, 0.88)',
      backdropFilter: 'blur(16px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel-alert" style={{
        maxWidth: '680px',
        width: '100%',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        {/* Glowing Top Alert Bar */}
        <div style={{
          background: 'linear-gradient(90deg, #ef4444, #f59e0b)',
          height: '6px',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0
        }} />

        {/* Header Title & Sound Control */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="radar-ring" style={{
              background: '#ef4444',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px #ef4444'
            }}>
              <ShieldAlert style={{ width: '24px', height: '24px', color: '#fff' }} />
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fca5a5', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                CRITICAL EMERGENCY DISPATCH
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                PRIORITY 1 DISPATCH ALERT
              </h2>
            </div>
          </div>

          <button
            onClick={toggleMute}
            style={{
              background: muted ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${muted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(239, 68, 68, 0.5)'}`,
              color: muted ? '#94a3b8' : '#fca5a5',
              padding: '8px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            {muted ? <VolumeX style={{ width: '16px', height: '16px' }} /> : <Volume2 style={{ width: '16px', height: '16px' }} />}
            {muted ? 'SIREN MUTED' : 'SIREN ACTIVE'}
          </button>
        </div>

        {/* Chief Complaint Box */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HeartPulse style={{ width: '14px', height: '14px' }} />
            CHIEF COMPLAINT / SYMPTOMS REPORTED
          </div>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
            "{emergency.chief_complaint}"
          </p>
        </div>

        {/* Patient & Location Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          
          {/* Patient Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User style={{ width: '12px', height: '12px' }} />
              PATIENT SUMMARY
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>
              {patient?.full_name || 'Rahul Sharma'}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>
              {patient?.age ? `${patient.age} yrs` : '54 yrs'} • {patient?.gender || 'Male'} • Blood Group: <strong style={{ color: '#ef4444' }}>{patient?.blood_group || 'O+'}</strong>
            </div>
          </div>

          {/* Location & Input Type */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '14px',
            borderRadius: '10px'
          }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin style={{ width: '12px', height: '12px', color: '#06b6d4' }} />
              LOCATION & TRIGGER METHOD
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '4px' }}>
              {emergency.patient_address || 'Main Road, Rajahmundry'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#38bdf8' }}>
              {emergency.input_type === 'voice' ? <Mic style={{ width: '12px', height: '12px' }} /> : <FileText style={{ width: '12px', height: '12px' }} />}
              Triggered via {emergency.input_type === 'voice' ? 'Patient Voice AI Assist' : 'Emergency Text Trigger'}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '14px' }}>
          <button
            onClick={() => handleResponse('ACCEPT')}
            disabled={submitting}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.7 : 1
            }}
          >
            <CheckCircle2 style={{ width: '22px', height: '22px' }} />
            {submitting ? 'ACCEPTING EMERGENCY...' : 'ACCEPT EMERGENCY CASE'}
          </button>

          <button
            onClick={() => handleResponse('DECLINE')}
            disabled={submitting}
            style={{
              flex: 0.7,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#fca5a5',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            <XCircle style={{ width: '20px', height: '20px' }} />
            DECLINE / REROUTE
          </button>
        </div>

      </div>
    </div>
  );
};
