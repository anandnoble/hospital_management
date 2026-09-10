# API Contracts Specification

All edge function endpoints respond with standard JSON format:
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

---

## 1. `POST /functions/v1/create-emergency`
Triggered by Patient App when emergency button is pressed.

### Request Payload:
```json
{
  "patient_id": "uuid",
  "chief_complaint": "Severe chest pain and difficulty breathing",
  "input_type": "voice", // "voice" | "text"
  "location": {
    "latitude": 17.0005,
    "longitude": 81.7800,
    "address_text": "Rajahmundry Main Road"
  },
  "requires_ambulance": true
}
```

### Response Payload:
```json
{
  "success": true,
  "data": {
    "emergency_id": "uuid",
    "status": "REQUESTED",
    "notified_hospital_id": "uuid",
    "created_at": "2026-09-10T12:00:00Z"
  }
}
```

---

## 2. `POST /functions/v1/hospital-action`
Triggered by Hospital Staff App when responding to emergency alert.

### Request Payload:
```json
{
  "hospital_id": "uuid",
  "staff_id": "uuid",
  "emergency_id": "uuid",
  "action": "ACCEPT" // "ACCEPT" | "DECLINE"
}
```

### Response Payload:
```json
{
  "success": true,
  "data": {
    "emergency_id": "uuid",
    "status": "HOSPITAL_ACCEPTED", // Or "AMBULANCE_SEARCHING"
    "assigned_hospital_id": "uuid"
  }
}
```

---

## 3. `POST /functions/v1/ambulance-action`
Triggered by Ambulance Driver App for dispatch response and state transitions.

### Request Payload:
```json
{
  "driver_id": "uuid",
  "ambulance_id": "uuid",
  "emergency_id": "uuid",
  "action": "ACCEPT", // "ACCEPT" | "DECLINE" | "STATUS_UPDATE"
  "next_status": "DRIVER_NAVIGATING" // Valid target status if action === "STATUS_UPDATE"
}
```

### Response Payload:
```json
{
  "success": true,
  "data": {
    "emergency_id": "uuid",
    "status": "DRIVER_NAVIGATING",
    "updated_at": "2026-09-10T12:05:00Z"
  }
}
```

---

## 4. `POST /functions/v1/update-location`
Triggered by Ambulance Driver App GPS stream.

### Request Payload:
```json
{
  "ambulance_id": "uuid",
  "emergency_id": "uuid",
  "latitude": 17.0050,
  "longitude": 81.7850,
  "heading": 180.5,
  "speed": 45.2
}
```

### Response Payload:
```json
{
  "success": true,
  "data": {
    "logged_at": "2026-09-10T12:06:00Z"
  }
}
```

---

## 5. `POST /functions/v1/ai-chat`
Triggered by Patient App AI Chat component to ask/answer progressive questions.

### Request Payload:
```json
{
  "emergency_id": "uuid",
  "patient_id": "uuid",
  "patient_message": "He is conscious and sitting down",
  "action": "NEXT_QUESTION" // "NEXT_QUESTION" | "PROCESS_ANSWER"
}
```

### Response Payload:
```json
{
  "success": true,
  "data": {
    "ai_question": "Does he have any known heart conditions or diabetes?",
    "suggested_answers": ["Yes, diabetes", "Heart history", "No medical history"],
    "conversation_id": "uuid"
  }
}
```
