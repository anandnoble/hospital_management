import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, X, AlertTriangle, Radio } from 'lucide-react';

interface EmergencyInputModalProps {
  onClose: () => void;
  onSubmitEmergency: (complaint: string, inputType: 'voice' | 'text') => void;
}

export const EmergencyInputModal: React.FC<EmergencyInputModalProps> = ({
  onClose,
  onSubmitEmergency,
}) => {
  const [complaint, setComplaint] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [inputType, setInputType] = useState<'voice' | 'text'>('text');

  // Web Speech API Voice Recognition setup
  useEffect(() => {
    let recognition: any = null;

    if (isRecording) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setComplaint(transcript);
            setInputType('voice');
          }
        };

        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);

        try {
          recognition.start();
        } catch (e) {
          console.warn("Speech recognition failed to start", e);
        }
      } else {
        alert("Web Speech Voice Recognition is not supported in this browser. Please type your problem.");
        setIsRecording(false);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint.trim()) return;
    onSubmitEmergency(complaint, inputType);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(7, 9, 14, 0.85)',
        backdropFilter: 'blur(16px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '24px 24px 0 0',
          padding: '1.5rem',
          margin: 0,
          border: '1px solid rgba(239, 68, 68, 0.4)',
          background: 'rgba(15, 23, 42, 0.95)',
          boxShadow: '0 -10px 40px rgba(239, 68, 68, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={22} color="#ef4444" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
              What problem are you facing right now?
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#94a3b8', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <textarea
              rows={4}
              value={complaint}
              onChange={(e) => {
                setComplaint(e.target.value);
                setInputType('text');
              }}
              placeholder="e.g. My father suddenly has severe chest pain and difficulty breathing..."
              style={{
                width: '100%',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '1rem',
                color: '#f8fafc',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                resize: 'none',
              }}
            />

            {/* Voice Input Waveform Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={toggleRecording}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: isRecording ? 'rgba(239, 68, 68, 0.25)' : 'rgba(6, 182, 212, 0.15)',
                  border: isRecording ? '1px solid #ef4444' : '1px solid rgba(6, 182, 212, 0.3)',
                  color: isRecording ? '#fca5a5' : '#67e8f9',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isRecording ? <MicOff size={16} color="#ef4444" /> : <Mic size={16} color="#06b6d4" />}
                {isRecording ? 'Listening... Tap to Stop' : '🎤 Speak Your Problem'}
              </button>

              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Mode: {inputType.toUpperCase()}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!complaint.trim()}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: complaint.trim() ? 'pointer' : 'not-allowed',
              opacity: complaint.trim() ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)',
            }}
          >
            <Send size={20} /> REQUEST EMERGENCY NOW
          </button>
        </form>
      </div>
    </div>
  );
};
