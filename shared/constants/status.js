"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALID_TRANSITIONS = exports.EMERGENCY_STATUS_ORDER = void 0;
exports.isValidTransition = isValidTransition;
exports.getStatusLabel = getStatusLabel;
exports.EMERGENCY_STATUS_ORDER = [
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
exports.VALID_TRANSITIONS = {
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
function isValidTransition(current, next) {
    return exports.VALID_TRANSITIONS[current]?.includes(next) ?? false;
}
function getStatusLabel(status) {
    const labels = {
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
