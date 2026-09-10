import { Location } from '../types/emergency';

export function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function validateEmergencyInput(complaint: string, location?: Location): { isValid: boolean; error?: string } {
  if (!complaint || complaint.trim().length === 0) {
    return { isValid: false, error: 'Chief complaint is required' };
  }
  if (complaint.length > 500) {
    return { isValid: false, error: 'Chief complaint exceeds maximum character limit (500)' };
  }
  if (location && !isValidCoordinate(location.latitude, location.longitude)) {
    return { isValid: false, error: 'Invalid patient GPS location coordinates' };
  }
  return { isValid: true };
}
