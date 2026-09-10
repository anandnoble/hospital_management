# AI Healthcare Access & Emergency Booking Assistant

> **Emergency first. Documentation later.**

Hackathon MVP for real-time emergency healthcare coordination between Patients, Hospitals, Ambulances, and a Central Web Dashboard, powered by Supabase and Gemini AI.

---

## 🚀 System Architecture & Apps Overview

```text
                         CENTRAL PLATFORM
                              |
                         🌐 CENTRAL WEB (Vite + React)
                              |
                         ┌───────────┐
                         │  SUPABASE │
                         │  BACKEND  │
                         └─────┬─────┘
                               |
             ┌─────────────────┼─────────────────┐
             ↓                 ↓                 ↓
       📱 PATIENT        📱 HOSPITAL       📱 AMBULANCE
         ANDROID           ANDROID            ANDROID
```

- **Patient App (`patient-app/`)**: One-touch voice/text emergency submission & live GPS tracking.
- **Hospital App (`hospital-app/`)**: High-priority alert acceptance & patient triage context.
- **Ambulance App (`ambulance-app/`)**: Urgent dispatch notification, navigation, & GPS tracking.
- **Central Web (`central-web/`)**: Real-time coordination dashboard, live map visualization, and complete event timeline.
- **Backend (`supabase/`)**: State machine, RLS policies, Edge Functions, FCM notifications, and Gemini AI progressive context engine.

---

## 🛠️ Repository Layout

```text
.
├── README.md
├── AGENTS.md
├── ARCHITECTURE.md
├── API_CONTRACTS.md
├── TEAM_STATUS.md
├── CONTRIBUTING.md
├── .env.example
├── patient-app/           # Android app (Agent 1)
├── hospital-app/          # Android app (Agent 2)
├── ambulance-app/         # Android app (Agent 3)
├── central-web/           # Vite + React Dashboard (Agent 4)
├── supabase/              # Migrations, Edge Functions, Seed (Agent 4)
└── shared/                # Shared TypeScript contracts & constants (Agent 4)
```

---

## ⚡ Emergency State Machine Flow

1. `REQUESTED`: Patient submits emergency (voice/text).
2. `HOSPITAL_NOTIFIED`: Backend identifies matching hospital and sends high-priority FCM alert.
3. `HOSPITAL_ACCEPTED`: Hospital accepts emergency.
4. `AMBULANCE_SEARCHING`: Backend queries nearby available drivers.
5. `AMBULANCE_ASSIGNED`: Driver receives & accepts request.
6. `DRIVER_NAVIGATING`: Driver travels to patient location (Live GPS enabled).
7. `ARRIVED_AT_PATIENT`: Driver reaches patient location.
8. `PATIENT_PICKED_UP`: Patient onboarded into ambulance.
9. `NAVIGATING_TO_HOSPITAL`: Ambulance en route to hospital.
10. `ARRIVED_AT_HOSPITAL`: Patient safely delivered to ER.
11. `COMPLETED`: Emergency resolved.

---

## 🚦 Getting Started

### 1. Central Web Dashboard
```bash
cd central-web
npm install
npm run dev
```

### 2. Supabase Backend Local Testing
```bash
supabase start
supabase db reset
```

---

## 👥 Multi-Agent Responsibilities
See [AGENTS.md](file:///d:/hospita%20management%20system/AGENTS.md) and [API_CONTRACTS.md](file:///d:/hospita%20management%20system/API_CONTRACTS.md) for strict architectural boundary rules.
