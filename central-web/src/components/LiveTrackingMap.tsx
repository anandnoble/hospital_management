import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Building2, ShieldAlert, Compass } from 'lucide-react';
import { EmergencyRequest } from '@shared';

interface LiveTrackingMapProps {
  emergency: EmergencyRequest | null;
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ emergency }) => {
  const [progress, setProgress] = useState<number>(0.35);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 0.95 ? 0.2 : prev + 0.05));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Compute interpolated GPS coordinates for demo canvas
  const pLat = 17.0005;
  const pLng = 81.7800;
  const hLat = 17.0080;
  const hLng = 81.7850;

  const currentAmbLat = pLat + (hLat - pLat) * progress;
  const currentAmbLng = pLng + (hLng - pLng) * progress;
  const currentEtaMinutes = Math.max(1, Math.round((1 - progress) * 12));

  return (
    <div className="glass-panel" style={{ height: '100%', position: 'relative' }}>
      <div className="panel-header" style={{ position: 'absolute', top: '1rem', left: '1rem', right: '1rem', zIndex: 10, background: 'rgba(10, 15, 29, 0.85)', backdropFilter: 'blur(12px)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h2>
          <Navigation size={18} color="#06b6d4" /> Live GPS Dispatch Radar
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Compass size={14} className="pulse-dot" /> Live ETA: {currentEtaMinutes} min
          </div>
        </div>
      </div>

      {/* Interactive Map Visual Grid */}
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: '400px',
          borderRadius: '12px',
          background: '#090d16',
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* SVG Route Line */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          <line
            x1="25%"
            y1="75%"
            x2="75%"
            y2="25%"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="6,6"
            style={{ opacity: 0.7 }}
          />
        </svg>

        {/* Patient Pin */}
        <div style={{ position: 'absolute', bottom: '25%', left: '25%', transform: 'translate(-50%, 50%)', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}>
            <MapPin size={22} color="#ef4444" style={{ margin: 'auto' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#f8fafc', fontWeight: 600, display: 'block', marginTop: '0.35rem', background: 'rgba(0,0,0,0.6)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            Patient (Rahul)
          </span>
        </div>

        {/* Ambulance Moving Marker */}
        <div
          style={{
            position: 'absolute',
            left: `${25 + progress * 50}%`,
            bottom: `${25 + progress * 50}%`,
            transform: 'translate(-50%, 50%)',
            textAlign: 'center',
            transition: 'all 1s linear',
            zIndex: 5,
          }}
        >
          <div style={{ width: '46px', height: '46px', background: 'linear-gradient(135deg, #06b6d4, #0284c7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(6, 182, 212, 0.8)', border: '2px solid #ffffff' }}>
            <Navigation size={24} color="#ffffff" style={{ transform: 'rotate(45deg)' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#67e8f9', fontWeight: 700, display: 'block', marginTop: '0.35rem', background: 'rgba(15, 23, 42, 0.85)', padding: '0.15rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
            🚑 AP 05 AB 1234
          </span>
        </div>

        {/* Hospital Pin */}
        <div style={{ position: 'absolute', top: '25%', right: '25%', transform: 'translate(50%, -50%)', textAlign: 'center' }}>
          <div style={{ width: '42px', height: '42px', background: 'rgba(16, 185, 129, 0.2)', border: '2px solid #10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>
            <Building2 size={22} color="#10b981" style={{ margin: 'auto' }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 600, display: 'block', marginTop: '0.35rem', background: 'rgba(0,0,0,0.6)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            City Hospital ER
          </span>
        </div>

        {/* Location Info Overlay */}
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
          <div>
            <span style={{ color: '#94a3b8' }}>Live Coordinates:</span>{' '}
            <span style={{ color: '#06b6d4', fontWeight: 600 }}>{currentAmbLat.toFixed(4)}° N, {currentAmbLng.toFixed(4)}° E</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Speed:</span>{' '}
            <span style={{ color: '#10b981', fontWeight: 600 }}>48 km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};
