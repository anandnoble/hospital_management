import React, { useState } from 'react';
import { User, FileText, Upload, ShieldCheck, Heart, AlertCircle, Plus, Check } from 'lucide-react';
import { PatientProfile } from '@shared';

interface PatientProfileViewProps {
  profile: PatientProfile | null;
  onClose: () => void;
}

export const PatientProfileView: React.FC<PatientProfileViewProps> = ({ profile, onClose }) => {
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Discharge Summary (Heart Care Clinic 2025)', type: 'discharge_summary', date: 'Jan 2025' },
    { id: '2', name: 'ECG Report Jan 2026', type: 'scan', date: 'Jan 2026' },
  ]);

  const [uploading, setUploading] = useState(false);
  const [grantedERAccess, setGrantedERAccess] = useState(true);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setTimeout(() => {
      setDocuments((prev) => [
        {
          id: Date.now().toString(),
          name: file.name,
          type: 'scan',
          date: 'Just now',
        },
        ...prev,
      ]);
      setUploading(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.25rem 1rem' }}>
      {/* Profile Header */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #06b6d4, #0284c7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={24} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{profile?.full_name || 'Rahul Sharma'}</h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phone: {profile?.phone || '+91 98765 43210'}</span>
          </div>
        </div>
        <button onClick={onClose} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
          Back Home
        </button>
      </div>

      {/* Vitals Summary Card */}
      <div className="glass-card">
        <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Heart size={16} color="#ef4444" /> Medical History & Vitals
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.82rem' }}>
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.6rem', borderRadius: '10px' }}>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Blood Group:</span>
            <strong style={{ color: '#ef4444', fontSize: '1rem' }}>{profile?.blood_group || 'O+'}</strong>
          </div>
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.6rem', borderRadius: '10px' }}>
            <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.72rem' }}>Age / Gender:</span>
            <strong>{profile?.age || 54} Yrs, {profile?.gender || 'Male'}</strong>
          </div>
        </div>

        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
          <p style={{ marginBottom: '0.35rem' }}>
            <strong style={{ color: '#f59e0b' }}>Known Conditions:</strong> Diabetes Type 2, Hypertension
          </p>
          <p>
            <strong style={{ color: '#06b6d4' }}>Allergies:</strong> Penicillin
          </p>
        </div>
      </div>

      {/* ER Authorization Toggle */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={22} color="#10b981" />
          <div>
            <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>ER Staff Document Sharing</h5>
            <span style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Allow accepting hospital to view documents</span>
          </div>
        </div>
        <button
          onClick={() => setGrantedERAccess(!grantedERAccess)}
          style={{
            background: grantedERAccess ? '#10b981' : 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '0.3rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem',
          }}
        >
          {grantedERAccess ? <Check size={14} /> : null} {grantedERAccess ? 'Granted' : 'Off'}
        </button>
      </div>

      {/* Medical Documents Section */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileText size={16} color="#06b6d4" /> Uploaded Medical Reports
          </h4>
          <label style={{ cursor: 'pointer', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#67e8f9', padding: '0.35rem 0.65rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Upload size={14} /> Upload Report
            <input type="file" onChange={handleSimulateUpload} style={{ display: 'none' }} accept=".pdf,.jpg,.png" />
          </label>
        </div>

        {uploading && (
          <div style={{ textAlign: 'center', padding: '0.75rem', fontSize: '0.8rem', color: '#06b6d4' }}>
            Uploading & encrypting report to Supabase Storage...
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {documents.map((doc) => (
            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(30, 41, 59, 0.6)', padding: '0.65rem 0.85rem', borderRadius: '10px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} color="#06b6d4" />
                <span style={{ fontWeight: 600, color: '#f8fafc' }}>{doc.name}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{doc.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
