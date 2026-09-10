import { Hospital, Ambulance } from '../types/emergency';

/**
 * Calculates the great-circle distance between two points on Earth using the Haversine formula.
 * @returns Distance in kilometers
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const EARTH_RADIUS_KM = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 100) / 100;
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Estimates travel time in minutes based on distance and average speed.
 * Default average speed: 45 km/h for urban emergency response.
 */
export function estimateETA(distanceKm: number, speedKmh: number = 45): number {
  if (distanceKm <= 0) return 1;
  const hours = distanceKm / speedKmh;
  return Math.max(1, Math.round(hours * 60));
}

/**
 * Ranks active hospitals by proximity to the patient location.
 */
export function findNearestHospital(
  patientLat: number,
  patientLng: number,
  hospitals: Hospital[]
): (Hospital & { distanceKm: number })[] {
  return hospitals
    .filter((h) => h.is_active)
    .map((h) => ({
      ...h,
      distanceKm: calculateHaversineDistance(patientLat, patientLng, h.latitude, h.longitude),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Ranks available ambulances by proximity to the patient location.
 */
export function findNearestAmbulance(
  patientLat: number,
  patientLng: number,
  ambulances: Ambulance[]
): (Ambulance & { distanceKm: number })[] {
  return ambulances
    .filter((a) => a.status === 'AVAILABLE')
    .map((a) => ({
      ...a,
      distanceKm: calculateHaversineDistance(
        patientLat,
        patientLng,
        a.current_latitude,
        a.current_longitude
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}
