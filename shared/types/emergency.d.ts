export type EmergencyStatus = 'REQUESTED' | 'HOSPITAL_NOTIFIED' | 'HOSPITAL_ACCEPTED' | 'HOSPITAL_DECLINED' | 'AMBULANCE_SEARCHING' | 'AMBULANCE_ASSIGNED' | 'DRIVER_DECLINED' | 'DRIVER_NAVIGATING' | 'ARRIVED_AT_PATIENT' | 'PATIENT_PICKED_UP' | 'NAVIGATING_TO_HOSPITAL' | 'ARRIVED_AT_HOSPITAL' | 'COMPLETED';
export type UserRole = 'PATIENT' | 'HOSPITAL_STAFF' | 'AMBULANCE_DRIVER' | 'ADMIN';
export type InputType = 'voice' | 'text';
export interface Location {
    latitude: number;
    longitude: number;
    address_text?: string;
}
export interface PatientProfile {
    id: string;
    user_id: string;
    full_name: string;
    age: number;
    gender: string;
    phone: string;
    blood_group?: string;
    allergies?: string[];
    medical_conditions?: string[];
    regular_medications?: string[];
    created_at: string;
}
export interface Hospital {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    available_icui_beds: number;
    is_active: boolean;
}
export interface Ambulance {
    id: string;
    vehicle_number: string;
    driver_name: string;
    driver_phone: string;
    current_latitude: number;
    current_longitude: number;
    status: 'OFFLINE' | 'AVAILABLE' | 'ON_EMERGENCY' | 'RETURNING';
}
export interface EmergencyRequest {
    id: string;
    patient_id: string;
    chief_complaint: string;
    input_type: InputType;
    status: EmergencyStatus;
    patient_latitude: number;
    patient_longitude: number;
    patient_address?: string;
    hospital_id?: string;
    ambulance_id?: string;
    created_at: string;
    updated_at: string;
    patient_profile?: PatientProfile;
    hospital?: Hospital;
    ambulance?: Ambulance;
}
export interface EmergencyStatusHistory {
    id: string;
    emergency_id: string;
    previous_status: EmergencyStatus | null;
    new_status: EmergencyStatus;
    notes?: string;
    changed_at: string;
}
export interface AmbulanceLocation {
    id: string;
    ambulance_id: string;
    emergency_id: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    updated_at: string;
}
export interface AIMessage {
    id: string;
    emergency_id: string;
    sender: 'ai' | 'patient';
    content: string;
    suggested_answers?: string[];
    created_at: string;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data: T | null;
    error?: string | null;
}
