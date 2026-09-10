import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Truck, Building2, Clock, Compass } from 'lucide-react';

interface LiveTrackingMapProps {
  emergency: any;
  hospitalLocation: { latitude: number; longitude: number; name: string };
}

export const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({ emergency, hospitalLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [etaMins, setEtaMins] = useState<number | null>(null);

  const patientLat = emergency?.patient_latitude || 17.0005;
  const patientLng = emergency?.patient_longitude || 81.7800;

  const ambulanceLat = emergency?.ambulance?.current_latitude || 17.0020;
  const ambulanceLng = emergency?.ambulance?.current_longitude || 81.7820;

  useEffect(() => {
    // Calculate Haversine distance between ambulance and hospital or patient
    const dist = calculateHaversine(ambulanceLat, ambulanceLng, hospitalLocation.latitude, hospitalLocation.longitude);
    setDistanceKm(parseFloat(dist.toFixed(2)));
    const speedKmh = 40; // average ER speed
    const calculatedEta = Math.max(1, Math.round((dist / speedKmh) * 60));
    setEtaMins(calculatedEta);
  }, [ambulanceLat, ambulanceLng, hospitalLocation]);

  useEffect(() => {
    if (!mapRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (!leafletInstanceRef.current) {
      // Initialize Leaflet map centered at Rajahmundry ER hub
      const map = L.map(mapRef.current).setView([hospitalLocation.latitude, hospitalLocation.longitude], 14);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CartoDB',
        maxZoom: 19,
      }).addTo(map);

      leafletInstanceRef.current = map;
    }

    const map = leafletInstanceRef.current;

    // Custom SVG HTML icons
    const hospitalIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="background: #9333ea; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px #9333ea; border: 2px solid #fff; font-size: 16px;">🏥</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const patientIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="background: #ef4444; color: #fff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px #ef4444; border: 2px solid #fff; font-size: 14px;">🆘</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const ambulanceIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="background: #f59e0b; color: #fff; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px #f59e0b; border: 2px solid #fff; font-size: 18px;">🚑</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Update Hospital Marker
    if (markersRef.current.hospital) {
      markersRef.current.hospital.setLatLng([hospitalLocation.latitude, hospitalLocation.longitude]);
    } else {
      markersRef.current.hospital = L.marker([hospitalLocation.latitude, hospitalLocation.longitude], { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(`<b>${hospitalLocation.name}</b><br/>ER Emergency Bay`);
    }

    // Update Patient Marker
    if (emergency) {
      if (markersRef.current.patient) {
        markersRef.current.patient.setLatLng([patientLat, patientLng]);
      } else {
        markersRef.current.patient = L.marker([patientLat, patientLng], { icon: patientIcon })
          .addTo(map)
          .bindPopup(`<b>Emergency Location</b><br/>${emergency.patient_address || 'Patient Site'}`);
      }

      // Update Ambulance Marker
      if (markersRef.current.ambulance) {
        markersRef.current.ambulance.setLatLng([ambulanceLat, ambulanceLng]);
      } else {
        markersRef.current.ambulance = L.marker([ambulanceLat, ambulanceLng], { icon: ambulanceIcon })
          .addTo(map)
          .bindPopup(`<b>Inbound Ambulance</b><br/>${emergency.ambulance?.vehicle_number || 'AP 05 AB 1234'}`);
      }

      // Fit map bounds to encompass all markers
      const bounds = L.latLngBounds([
        [hospitalLocation.latitude, hospitalLocation.longitude],
        [patientLat, patientLng],
        [ambulanceLat, ambulanceLng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [emergency, hospitalLocation, patientLat, patientLng, ambulanceLat, ambulanceLng]);

  function calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in KM
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      
      {/* Map Header Overlay */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Navigation style={{ width: '20px', height: '20px', color: '#06b6d4' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            LIVE INBOUND AMBULANCE RADAR
          </h3>
        </div>

        {emergency && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fde68a',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Truck style={{ width: '15px', height: '15px' }} />
              {emergency.ambulance?.vehicle_number || 'AP 05 AB 1234'}
            </div>

            <div style={{
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              color: '#67e8f9',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)'
            }}>
              <Clock style={{ width: '15px', height: '15px' }} />
              ETA: {etaMins ? `${etaMins} mins` : 'Calculating...'} ({distanceKm ? `${distanceKm} km` : ''})
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div 
        ref={mapRef}
        style={{
          width: '100%',
          flex: 1,
          minHeight: '380px',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1
        }}
      />

      {/* Map Legend */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        fontSize: '0.78rem',
        color: '#94a3b8',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🏥</span> Hospital ER Bay
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🆘</span> Patient Location
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>🚑</span> Inbound Ambulance
        </div>
      </div>

    </div>
  );
};
