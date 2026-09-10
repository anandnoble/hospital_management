import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Building2, Compass, Phone } from 'lucide-react';
import { EmergencyRequest } from '@shared';

interface LiveAmbulanceMapProps {
  emergency: EmergencyRequest;
}

export const LiveAmbulanceMap: React.FC<LiveAmbulanceMapProps> = ({ emergency }) => {
  const [progress, setProgress] = useState(0.4);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 0.95 ? 0.2 : prev + 0.05));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const pLat = emergency.patient_latitude || 17.0005;
  const pLng = emergency.patient_longitude || 81.7800;
  const hLat = emergency.hospital?.latitude || 17.0080;
  const hLng = emergency.hospital?.longitude || 81.7850;

  const currentAmbLat = pLat + (hLat - pLat) * progress;
  const currentAmbLng = pLng + (hLng - pLng) * progress;
  const etaMinutes = Math.max(1, Math.round((1 - progress) * 10));

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
      {/* Map Header Overlay */}
      <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', right: '0.85rem', zIndex: 10, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', padding: '0.65rem 0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Navigation size={18} color="#06b6d4" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Live Ambulance GPS Radar</span>
        </div>
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Compass size={12} className="pulse-dot" /> ETA: {etaMinutes} min
        </div>
      </div>

      {/* Map Vector Canvas */}
      <div
        style={{
          width: '100%',
          height: '280px',
          background: '#090d16',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          <line x1="20%" y1="75%" x2="80%" y2="25%" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" opacity="0.6" />
        </svg>

        {/* Patient Location */}
        <div style={{ position: 'absolute', bottom: '25%', left: '20%', transform: 'translate(-50%, 50%)', textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(239, 68, 68, 0.25)', border: '2px solid #ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(239, 68, 68, 0.6)' }}>
            <MapPin size={20} color="#ef4444" />
          </div>
          <span style={{ fontSize: '0.7rem', color: '#f8fafc', fontWeight: 600, display: 'block', marginTop: '0.25rem', background: 'rgba(0,0,0,0.6)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
            My Location
          </span>
        </div>

        {/* Moving Ambulance */}
        <div
          style={{
            position: 'absolute',
            left: `${20 + progress * 60}%`,
            bottom: `${25 + progress * 50}%`,
            transform: 'translate(-50%, 50%)',
            textAlign: 'center',
            transition: 'all 1s linear',
            zIndex: 5,
          }}
        >
          <div style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #06b6d4, #0284c7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6, 182, 212, 0.8)', border: '2px solid #ffffff' }}>
            <Navigation size={22} color="#ffffff" style={{ transform: 'rotate(45deg)' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: '#67e8f9', fontWeight: 700, display: 'block', marginTop: '0.25rem', background: 'rgba(15, 23, 42, 0.85)', padding: '0.15rem 0.45rem', borderRadius: '6px', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
            🚑 {emergency.ambulance?.vehicle_number || 'AP 05 AB 1234'}
          </span>
        </div>

        {/* Hospital Destination */}
        <div style={{ position: 'absolute', top: '25%', right: '20%', transform: 'translate(50%, -50%)', textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', background: 'rgba(16, 185, 129, 0.25)', border: '2px solid #10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(16, 185, 129, 0.6)' }}>
            <Building2 size={20} color="#10b981" />
          </div>
          <span style={{ fontSize: '0.7rem', color: '#6ee7b7', fontWeight: 600, display: 'block', marginTop: '0.25rem', background: 'rgba(0,0,0,0.6)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
            {emergency.hospital?.name || 'City Hospital ER'}
          </span>
        </div>
      </div>

      {/* Driver Info & Call Footer */}
      <div style={{ padding: '0.85rem 1rem', background: 'rgba(15, 23, 42, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Driver:</span>{' '}
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
            {emergency.ambulance?.driver_name || 'Suresh Kumar'}
          </span>
        </div>
        <a
          href={`tel:${emergency.ambulance?.driver_phone || '+919876543212'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6ee7b7',
            padding: '0.35rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.78rem',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          <Phone size={14} /> Call Driver
        </a>
      </div>
    </div>
  );
};
