import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import { mockPatientProfile } from '../services/emergencyService';

export const ProfileScreen = ({ navigation }: any) => {
  const [profile] = useState(mockPatientProfile);
  const [documents, setDocuments] = useState<string[]>([
    'Blood_Test_Report_2025.pdf',
    'ECG_Scan_July.png'
  ]);

  const handleUploadDocument = () => {
    Alert.alert('Document Upload', 'Simulating medical record upload to Supabase Storage...', [
      {
        text: 'OK',
        onPress: () => {
          setDocuments([...documents, `Medical_Record_${Date.now()}.pdf`]);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Medical Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Basic Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>👤 Personal Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{profile.full_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Age / Gender:</Text>
            <Text style={styles.value}>{profile.age} yrs / {profile.gender}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{profile.phone}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Blood Group:</Text>
            <Text style={[styles.value, styles.highlightText]}>{profile.blood_group}</Text>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>🩺 Medical History & Conditions</Text>
          
          <Text style={styles.subLabel}>Known Allergies:</Text>
          <View style={styles.chipContainer}>
            {profile.allergies?.map((allergy, i) => (
              <View key={i} style={styles.dangerChip}>
                <Text style={styles.dangerChipText}>{allergy}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subLabel}>Pre-existing Conditions:</Text>
          <View style={styles.chipContainer}>
            {profile.medical_conditions?.map((cond, i) => (
              <View key={i} style={styles.infoChip}>
                <Text style={styles.infoChipText}>{cond}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subLabel}>Regular Medications:</Text>
          <View style={styles.chipContainer}>
            {profile.regular_medications?.map((med, i) => (
              <View key={i} style={styles.normalChip}>
                <Text style={styles.normalChipText}>{med}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Uploaded Documents */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionTitle}>📁 Emergency Documents</Text>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadDocument}>
              <Text style={styles.uploadBtnText}>+ Upload</Text>
            </TouchableOpacity>
          </View>

          {documents.map((doc, idx) => (
            <View key={idx} style={styles.docItem}>
              <Text style={styles.docName}>📄 {doc}</Text>
              <Text style={styles.docStatus}>Uploaded</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E293B',
  },
  backText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 16,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderColor: '#334155',
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  label: {
    color: '#94A3B8',
    fontSize: 14,
  },
  value: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  highlightText: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  subLabel: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 10,
    marginBottom: 6,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dangerChip: {
    backgroundColor: '#7F1D1D',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  dangerChipText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
  },
  infoChip: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  infoChipText: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '600',
  },
  normalChip: {
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  normalChipText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  uploadBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  docName: {
    color: '#F8FAFC',
    fontSize: 14,
  },
  docStatus: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
