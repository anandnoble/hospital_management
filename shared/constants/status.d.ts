import { EmergencyStatus } from '../types/emergency';
export declare const EMERGENCY_STATUS_ORDER: EmergencyStatus[];
export declare const VALID_TRANSITIONS: Record<EmergencyStatus, EmergencyStatus[]>;
export declare function isValidTransition(current: EmergencyStatus, next: EmergencyStatus): boolean;
export declare function getStatusLabel(status: EmergencyStatus): string;
