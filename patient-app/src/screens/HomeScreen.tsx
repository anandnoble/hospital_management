import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { createEmergencyRequest } from '../services/emergencyService';

export const HomeScreen = ({ navigation }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);

  const handleVoiceTrigger = () => {
    setIsVoiceRecording(true);
    setTimeout(async () => {
      setIsVoiceRecording(false);
      const simulatedVoiceText = "Patient experiencing severe chest pain and shortness of breath.";
      await triggerEmergency(simulatedVoiceText, 'voice');
    }, 2500);
  };

  const handleTextTrigger = () => {
    setModalVisible(true);
  };

  const submitTextEmergency = async () => {
    if (!chiefComplaint.trim()) {
      Alert.alert('Required', 'Please describe the emergency symptoms.');
      return;
    }
    setModalVisible(false);
    await triggerEmergency(chiefComplaint, 'text');
    setChiefComplaint('');
  };

  const triggerEmergency = async (complaint: string, type: 'voice' | 'text') => {
    setLoading(true);
    try {
      // Mock location: New York coordinates as baseline default
      const defaultLoc = { latitude: 40.7128, longitude: -74.0060, address: '123 Main St, NY' };
      const emergency = await createEmergencyRequest(complaint, type, defaultLoc);
      setLoading(false);
      navigation.navigate('TriageChat', { emergencyId: emergency.id });
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Failed to trigger emergency response.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>CarePulse Emergency</Text>
          <Text style={styles.subGreeting}>Select an action to request immediate help</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBadge}>
          <Text style={styles.profileText}>👤 Profile</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EF4444" />
          <Text style={styles.loadingText}>Dispatching Emergency Request...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Main One-Touch Voice Emergency Button */}
          <TouchableOpacity
            style={[styles.emergencyBtn, isVoiceRecording && styles.recordingBtn]}
            onPress={handleVoiceTrigger}
            activeOpacity={0.8}
          >
            <Text style={styles.sosIcon}>{isVoiceRecording ? '🎙️' : '🚨'}</Text>
            <Text style={styles.emergencyBtnTitle}>
              {isVoiceRecording ? 'Listening...' : 'VOICE EMERGENCY'}
            </Text>
            <Text style={styles.emergencyBtnSubtitle}>
              {isVoiceRecording ? 'Speak your symptoms clearly' : 'Tap & Speak to Trigger Instant Dispatch'}
            </Text>
          </TouchableOpacity>

          {/* Secondary Text Emergency Trigger */}
          <TouchableOpacity style={styles.textEmergencyBtn} onPress={handleTextTrigger}>
            <Text style={styles.textBtnTitle}>💬 Text Emergency Complaint</Text>
            <Text style={styles.textBtnSubtitle}>Type symptoms directly</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for Text Complaint Entry */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Describe Emergency</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Chest pain, difficulty breathing, allergic reaction..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={chiefComplaint}
              onChangeText={setChiefComplaint}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.confirmBtn]}
                onPress={submitTextEmergency}
              >
                <Text style={styles.confirmBtnText}>Dispatch Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  subGreeting: {
    fontSize: 13,
    color: '#94A3B8',
  },
  profileBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#F8FAFC',
    marginTop: 16,
    fontSize: 16,
  },
  emergencyBtn: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 40,
  },
  recordingBtn: {
    backgroundColor: '#2563EB',
  },
  sosIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  emergencyBtnTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  emergencyBtnSubtitle: {
    color: '#FEE2E2',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  textEmergencyBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
    borderColor: '#334155',
    borderWidth: 1,
  },
  textBtnTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textBtnSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#334155',
    color: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelBtn: {
    backgroundColor: '#334155',
  },
  cancelBtnText: {
    color: '#CBD5E1',
    fontWeight: '600',
  },
  confirmBtn: {
    backgroundColor: '#EF4444',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
