# System Architecture & Technical Specifications

## 1. System Communication Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      CENTRAL BACKEND                        │
│                   (Supabase Platform)                       │
│  ┌────────────┐   ┌────────────┐   ┌─────────────────────┐  │
│  │ PostgreSQL │   │ Realtime   │   │ Edge Functions      │  │
│  │ DB & RLS   │   │ WebSockets │   │ (State Machine, AI) │  │
│  └─────┬──────┘   └─────┬──────┘   └──────────┬──────────┘  │
└────────┼────────────────┼─────────────────────┼─────────────┘
         │                │                     │
   ┌─────┴────────────────┴─────────┐           │
   │      SHARED REST & REALTIME    │           │
   └─────┬────────────────┬─────────┘           │
         │                │                     │
         ↓                ↓                     ↓
 🌐 CENTRAL WEB     📱 PATIENT APP       📱 HOSPITAL APP &
 (Monitoring Dash)  (Android App)        📱 AMBULANCE APP
```

---

## 2. Emergency State Machine Transitions

The central backend owns state consistency. Invalid state jumps are rejected by database constraints & Edge Functions.

```text
               ┌────────────────┐
               │   REQUESTED    │
               └───────┬────────┘
                       │ (Hospital search & FCM alert)
                       ▼
            ┌─────────────────────┐
            │  HOSPITAL_NOTIFIED  │
            └──────────┬──────────┘
                       │
       ┌───────────────┴───────────────┐
 (Hospital Accept)               (Hospital Decline)
       │                               │
       ▼                               ▼
┌──────────────────┐         ┌────────────────────┐
│ HOSPITAL_ACCEPTED│         │ HOSPITAL_DECLINED  │
└──────┬───────────┘         └─────────┬──────────┘
       │                               │ (Fallback next hospital)
       ▼                               └──────────────┐
┌─────────────────────┐                               │
│ AMBULANCE_SEARCHING │ ◄─────────────────────────────┘
└──────────┬──────────┘
           │
     ┌─────┴─────────────────────┐
 (Driver Accept)           (Driver Decline)
     │                           │
     ▼                           ▼
┌──────────────────┐   ┌──────────────────┐
│AMBULANCE_ASSIGNED│   │ DRIVER_DECLINED  │ (Fallback next ambulance)
└──────────┬───────┘   └─────────┬────────┘
           │                     └─────────┐
           ▼                               │
┌──────────────────┐ ◄─────────────────────┘
│ DRIVER_NAVIGATING│
└──────────┬───────┘
           │ (Reaches Patient location)
           ▼
┌────────────────────┐
│ ARRIVED_AT_PATIENT │
└──────────┬─────────┘
           │ (Boarding patient)
           ▼
┌────────────────────┐
│ PATIENT_PICKED_UP  │
└──────────┬─────────┘
           │ (En route to ER)
           ▼
┌───────────────────────┐
│ NAVIGATING_TO_HOSPITAL│
└──────────┬────────────┘
           │ (Arrives at ER bay)
           ▼
┌────────────────────┐
│ARRIVED_AT_HOSPITAL │
└──────────┬─────────┘
           │ (Handover completed)
           ▼
┌──────────────────┐
│    COMPLETED     │
└──────────────────┘
```

---

## 3. Data Protection & Security (RLS)

- **Patient Personal Vitals & History:** Read access strictly restricted to the emergency patient and authorized hospital staff upon emergency acceptance (`HOSPITAL_ACCEPTED`).
- **Ambulance Drivers:** Receive patient location, emergency status, and emergency contact phone number. Drivers do NOT receive detailed historical medical documents or scan reports.
- **Central Admin / Web Monitor:** Read access to active emergency statuses, locations, and timelines for coordination.

---

## 4. Real-Time Tracking Protocol

Ambulance drivers publish GPS coordinates to `ambulance_locations` table at regular intervals during active emergencies.
Subscribers listening via Supabase Realtime WebSocket channel `ambulance-location:{emergency_id}`:
1. Patient Android App (Map marker update)
2. Hospital Android App (ER preparation ETA timer & Map)
3. Central Web Monitoring Dashboard (Live grid map)
