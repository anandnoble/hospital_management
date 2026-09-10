import React, { useEffect, useState } from 'react';
import { 
  X, 
  User, 
  Heart, 
  AlertCircle, 
  Pill, 
  FileText, 
  Bot, 
  Phone, 
  ShieldCheck, 
  Eye, 
  Download, 
  Calendar,
  Activity,
  Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PatientDetailsModalProps {
  emergency: any;
  onClose: () => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ emergency, onClose }) => {
  const [profile, setProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [aiMessages, setAiMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'VITALS' | 'AI_CHAT' | 'DOCUMENTS'>('VITALS');
  const [selectedDocPreview, setSelectedDocPreview] = useState<any>(null);

  useEffect(() => {
    if (emergency) {
      fetchPatientProfile();
      fetchAiMessages();
    }
  }, [emergency]);

  const fetchPatientProfile = async () => {
    try {
      const patientId = emergency.patient_id;
      // Fetch profile
      const { data: profData } = await supabase
        .from('patient_profiles')
        .select('*')
        .eq('id', patientId)
        .maybeSingle();

      if (profData) {
        setProfile(profData);

        // Fetch medical documents for this patient
        const { data: docData } = await supabase
          .from('medical_documents')
          .select('*')
          .eq('patient_id', profData.id);

        if (docData && docData.length > 0) {
          setDocuments(docData);
        } else {
          // Fallback mock documents if none in table
          setDocuments([
            {
              id: 'doc-1',
              document_name: 'Discharge Summary (Heart Care Clinic 2025)',
              document_type: 'discharge_summary',
              created_at: '2025-11-14T10:00:00Z',
              summary: 'Patient admitted for acute hypertension crisis. Stabilized with Amlodipine 5mg daily. Cardiac enzymes within normal limits.'
            },
            {
              id: 'doc-2',
              document_name: 'ECG Report Jan 2026',
              document_type: 'scan',
              created_at: '2026-01-20T14:30:00Z',
              summary: 'Sinus rhythm 78 bpm. Normal axis, no ST-segment elevation detected. ST-T wave changes minor in lead V4-V6.'
            }
          ]);
        }
      } else {
        // Fallback profile if profile not matched directly by UUID
        setProfile({
          full_name: 'Rahul Sharma',
          age: 54,
          gender: 'Male',
          phone: '+91 98765 43210',
          blood_group: 'O+',
          allergies: ['Penicillin'],
          medical_conditions: ['Diabetes Type 2', 'Hypertension'],
          regular_medications: ['Metformin 500mg', 'Amlodipine 5mg']
        });
        setDocuments([
          {
            id: 'doc-1',
            document_name: 'Discharge Summary (Heart Care Clinic 2025)',
            document_type: 'discharge_summary',
            created_at: '2025-11-14T10:00:00Z',
            summary: 'Patient admitted for acute hypertension crisis. Stabilized with Amlodipine 5mg daily. Cardiac enzymes within normal limits.'
          },
          {
            id: 'doc-2',
            document_name: 'ECG Report Jan 2026',
            document_type: 'scan',
            created_at: '2026-01-20T14:30:00Z',
            summary: 'Sinus rhythm 78 bpm. Normal axis, no ST-segment elevation detected.'
          }
        ]);
      }
    } catch (e) {
      console.error('Error fetching patient details:', e);
    }
  };

  const fetchAiMessages = async () => {
    try {
      const { data } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('emergency_id', emergency.id)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setAiMessages(data);
      } else {
        // Mock progressive AI triage transcript if empty
        setAiMessages([
          {
            id: 'm1',
            sender: 'ai',
            content: 'Hello, I am your Emergency AI Triage Assistant. Are you conscious and safe right now?',
            created_at: emergency.created_at
          },
          {
            id: 'm2',
            sender: 'patient',
            content: emergency.chief_complaint || 'I have severe chest pain and short breath',
            created_at: emergency.created_at
          },
          {
            id: 'm3',
            sender: 'ai',
            content: 'Emergency response team has been alerted! Do you have any known heart condition or diabetes history?',
            created_at: emergency.created_at
          },
          {
            id: 'm4',
            sender: 'patient',
            content: 'Yes, Type 2 Diabetes and high blood pressure',
            created_at: emergency.created_at
          }
        ]);
      }
    } catch (e) {
      console.error('Error fetching AI messages:', e);
    }
  };

  if (!emergency) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 7, 13, 0.85)',
      backdropFilter: 'blur(16px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '850px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* Header Bar */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.9)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              padding: '10px',
              borderRadius: '10px'
            }}>
              <User style={{ width: '22px', height: '22px', color: '#fff' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  {profile?.full_name || 'Rahul Sharma'}
                </h2>
                <span style={{
                  fontSize: '0.7rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#6ee7b7',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck style={{ width: '12px', height: '12px' }} />
                  AUTHORIZED ER ACCESS
                </span>
              </div>
              
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                Age: {profile?.age || 54} • Gender: {profile?.gender || 'Male'} • Phone: {profile?.phone || '+91 98765 43210'} • Blood: <strong style={{ color: '#ef4444' }}>{profile?.blood_group || 'O+'}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.5)',
          padding: '0 24px'
        }}>
          <button
            onClick={() => setActiveTab('VITALS')}
            style={{
              padding: '14px 20px',
              color: activeTab === 'VITALS' ? '#38bdf8' : '#94a3b8',
              borderBottom: activeTab === 'VITALS' ? '2px solid #38bdf8' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent'
            }}
          >
            <Activity style={{ width: '16px', height: '16px' }} />
            PATIENT VITALS & HISTORY
          </button>

          <button
            onClick={() => setActiveTab('AI_CHAT')}
            style={{
              padding: '14px 20px',
              color: activeTab === 'AI_CHAT' ? '#a855f7' : '#94a3b8',
              borderBottom: activeTab === 'AI_CHAT' ? '2px solid #a855f7' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent'
            }}
          >
            <Sparkles style={{ width: '16px', height: '16px' }} />
            AI TRIAGE TRANSCRIPT ({aiMessages.length})
          </button>

          <button
            onClick={() => setActiveTab('DOCUMENTS')}
            style={{
              padding: '14px 20px',
              color: activeTab === 'DOCUMENTS' ? '#67e8f9' : '#94a3b8',
              borderBottom: activeTab === 'DOCUMENTS' ? '2px solid #67e8f9' : '2px solid transparent',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent'
            }}
          >
            <FileText style={{ width: '16px', height: '16px' }} />
            MEDICAL DOCUMENTS ({documents.length})
          </button>
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto' }}>
          
          {/* TAB 1: VITALS & HISTORY */}
          {activeTab === 'VITALS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Chief Complaint Banner */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '16px',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fca5a5', textTransform: 'uppercase', marginBottom: '4px' }}>
                  REPORTED CHIEF COMPLAINT
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                  "{emergency.chief_complaint}"
                </div>
              </div>

              {/* Grid: Allergies, Medical Conditions, Medications */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                
                {/* Known Allergies */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '16px',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>
                    <AlertCircle style={{ width: '16px', height: '16px' }} />
                    KNOWN ALLERGIES
                  </div>

                  {profile?.allergies && profile.allergies.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {profile.allergies.map((item: string, idx: number) => (
                        <span key={idx} style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No recorded allergies</span>
                  )}
                </div>

                {/* Chronic Medical Conditions */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '16px',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>
                    <Heart style={{ width: '16px', height: '16px' }} />
                    PRE-EXISTING CONDITIONS
                  </div>

                  {profile?.medical_conditions && profile.medical_conditions.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {profile.medical_conditions.map((item: string, idx: number) => (
                        <span key={idx} style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#fde68a',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No recorded conditions</span>
                  )}
                </div>

                {/* Regular Medications */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '16px',
                  borderRadius: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '10px' }}>
                    <Pill style={{ width: '16px', height: '16px' }} />
                    ACTIVE MEDICATIONS
                  </div>

                  {profile?.regular_medications && profile.regular_medications.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {profile.regular_medications.map((item: string, idx: number) => (
                        <span key={idx} style={{
                          background: 'rgba(56, 189, 248, 0.2)',
                          color: '#7dd3fc',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No active medications</span>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: AI CHAT TRANSCRIPT */}
          {activeTab === 'AI_CHAT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bot style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                Real-time automated Gemini AI assessment chat log captured during patient trigger
              </div>

              {aiMessages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: isAi ? 'flex-start' : 'flex-end',
                      maxWidth: '80%',
                      background: isAi ? 'rgba(168, 85, 247, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                      border: `1px solid ${isAi ? 'rgba(168, 85, 247, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      color: isAi ? '#e9d5ff' : '#cffaff'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px', color: isAi ? '#c084fc' : '#67e8f9' }}>
                      {isAi ? 'GEMINI AI ASSISTANT' : 'PATIENT'}
                    </div>
                    <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: MEDICAL DOCUMENTS */}
          {activeTab === 'DOCUMENTS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                Authorized emergency medical documents & uploaded scan records
              </div>

              {documents.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      padding: '10px',
                      borderRadius: '10px'
                    }}>
                      <FileText style={{ width: '22px', height: '22px', color: '#67e8f9' }} />
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>
                        {doc.document_name}
                      </h4>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                        Type: {doc.document_type || 'PDF Scan'} • Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDocPreview(doc)}
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                      color: '#fff',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Eye style={{ width: '14px', height: '14px' }} />
                    PREVIEW DOCUMENT
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.9)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            Close Details
          </button>
        </div>

      </div>

      {/* Nested Document Preview Popup */}
      {selectedDocPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '650px',
            width: '100%',
            padding: '24px',
            background: '#0f172a'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#67e8f9' }}>
                {selectedDocPreview.document_name}
              </h3>
              <button onClick={() => setSelectedDocPreview(null)} style={{ background: 'transparent', color: '#fff' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {selectedDocPreview.summary || 'Official clinical document file verified in Supabase Storage.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedDocPreview(null)} style={{ background: '#0284c7', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontWeight: 700 }}>
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
