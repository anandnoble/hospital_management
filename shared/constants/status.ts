import { EmergencyStatus } from '../types/emergency';

export const EMERGENCY_STATUS_ORDER: EmergencyStatus[] = [
  'REQUESTED',
  'HOSPITAL_NOTIFIED',
  'HOSPITAL_ACCEPTED',
  'AMBULANCE_SEARCHING',
  'AMBULANCE_ASSIGNED',
  'DRIVER_NAVIGATING',
  'ARRIVED_AT_PATIENT',
  'PATIENT_PICKED_UP',
  'NAVIGATING_TO_HOSPITAL',
  'ARRIVED_AT_HOSPITAL',
  'COMPLETED',
];

export const VALID_TRANSITIONS: Record<EmergencyStatus, EmergencyStatus[]> = {
  REQUESTED: ['HOSPITAL_NOTIFIED'],
  HOSPITAL_NOTIFIED: ['HOSPITAL_ACCEPTED', 'HOSPITAL_DECLINED'],
  HOSPITAL_DECLINED: ['HOSPITAL_NOTIFIED'], // Retry next hospital
  HOSPITAL_ACCEPTED: ['AMBULANCE_SEARCHING'],
  AMBULANCE_SEARCHING: ['AMBULANCE_ASSIGNED', 'DRIVER_DECLINED'],
  DRIVER_DECLINED: ['AMBULANCE_SEARCHING'], // Retry next ambulance
  AMBULANCE_ASSIGNED: ['DRIVER_NAVIGATING'],
  DRIVER_NAVIGATING: ['ARRIVED_AT_PATIENT'],
  ARRIVED_AT_PATIENT: ['PATIENT_PICKED_UP'],
  PATIENT_PICKED_UP: ['NAVIGATING_TO_HOSPITAL'],
  NAVIGATING_TO_HOSPITAL: ['ARRIVED_AT_HOSPITAL'],
  ARRIVED_AT_HOSPITAL: ['COMPLETED'],
  COMPLETED: [],
};

export function isValidTransition(current: EmergencyStatus, next: EmergencyStatus): boolean {
  return VALID_TRANSITIONS[current]?.includes(next) ?? false;
}

export function getStatusLabel(status: EmergencyStatus): string {
  const labels: Record<EmergencyStatus, string> = {
    REQUESTED: 'Emergency Submitted',
    HOSPITAL_NOTIFIED: 'Hospital Contacted',
    HOSPITAL_ACCEPTED: 'Hospital Accepted',
    HOSPITAL_DECLINED: 'Hospital Declined (Searching Next)',
    AMBULANCE_SEARCHING: 'Searching for Nearby Ambulance',
    AMBULANCE_ASSIGNED: 'Ambulance Assigned',
    DRIVER_DECLINED: 'Driver Declined (Searching Next)',
    DRIVER_NAVIGATING: 'Ambulance En Route to Patient',
    ARRIVED_AT_PATIENT: 'Ambulance Arrived at Location',
    PATIENT_PICKED_UP: 'Patient Picked Up',
    NAVIGATING_TO_HOSPITAL: 'Ambulance En Route to Hospital',
    ARRIVED_AT_HOSPITAL: 'Arrived at ER Bay',
    COMPLETED: 'Emergency Completed',
  };
  return labels[status] || status;
}
