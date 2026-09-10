import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { getAmbulanceLocation, fetchEmergencyDetails } from '../services/emergencyService';
import { AmbulanceLocation, EmergencyRequest } from '../types';

export const AmbulanceTrackingScreen = ({ route, navigation }: any) => {
  const { emergencyId } = route.params;
  const [emergency, setEmergency] = useState<EmergencyRequest | null>(null);
  const [location, setLocation] = useState<AmbulanceLocation | null>(null);

  useEffect(() => {
    loadDetails();
    const interval = setInterval(async () => {
      const updatedLoc = await getAmbulanceLocation(emergencyId);
      if (updatedLoc) setLocation({ ...updatedLoc });
    }, 3000);

    return () => clearInterval(interval);
  }, [emergencyId]);

  const loadDetails = async () => {
    const details = await fetchEmergencyDetails(emergencyId);
    setEmergency(details);
    const loc = await getAmbulanceLocation(emergencyId);
    if (loc) setLocation(loc);
  };

  const patientCoords = {
    latitude: emergency?.patient_latitude || 40.7128,
    longitude: emergency?.patient_longitude || -74.0060,
  };

  const ambulanceCoords = {
    latitude: location?.latitude || patientCoords.latitude + 0.015,
    longitude: location?.longitude || patientCoords.longitude + 0.015,
  };

  const callDriver = () => {
    if (emergency?.ambulance?.driver_phone) {
      Linking.openURL(`tel:${emergency.ambulance.driver_phone}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Ambulance Tracking</Text>
      </View>

      {/* Map Component */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: (patientCoords.latitude + ambulanceCoords.latitude) / 2,
            longitude: (patientCoords.longitude + ambulanceCoords.longitude) / 2,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={patientCoords}
            title="Your Location"
            description="Patient Emergency Point"
            pinColor="red"
          />

          <Marker
            coordinate={ambulanceCoords}
            title={`Ambulance (${emergency?.ambulance?.vehicle_number || 'En Route'})`}
            description={`Driver: ${emergency?.ambulance?.driver_name}`}
            pinColor="blue"
          />

          <Polyline
            coordinates={[patientCoords, ambulanceCoords]}
            strokeColor="#38BDF8"
            strokeWidth={4}
          />
        </MapView>
      </View>

      {/* Dispatch Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.vehicleNo}>🚑 {emergency?.ambulance?.vehicle_number || 'AMB-8899'}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>EN ROUTE</Text>
          </View>
        </View>

        <Text style={styles.driverName}>Driver: {emergency?.ambulance?.driver_name || 'John Doe'}</Text>
        <Text style={styles.etaText}>Estimated Arrival: ~6 mins (1.2 miles away)</Text>

        <TouchableOpacity style={styles.callBtn} onPress={callDriver}>
          <Text style={styles.callBtnText}>📞 Call Ambulance Driver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E293B',
  },
  backBtn: {
    marginRight: 16,
  },
  backText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFill,
  },
  detailsCard: {
    backgroundColor: '#1E293B',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vehicleNo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  statusBadge: {
    backgroundColor: '#166534',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: '#4ADE80',
    fontSize: 12,
    fontWeight: 'bold',
  },
  driverName: {
    color: '#CBD5E1',
    fontSize: 15,
    marginBottom: 4,
  },
  etaText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  callBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
