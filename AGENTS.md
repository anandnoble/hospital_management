# Development Team & AI Agent Allocation

This repository is developed by four dedicated agents working on strict component ownership boundaries.

---

## 📌 Agent Roles & Ownership

### Agent 1 — Patient Application
- **Branch:** `agent/patient`
- **Primary Folder:** `patient-app/`
- **Responsibilities:** Patient authentication, profile management, medical document uploads, voice/text initial emergency trigger, AI chat interaction UI, live ambulance tracking map, patient status updates.
- **Strict Boundary:** MUST NOT modify `hospital-app/`, `ambulance-app/`, or `supabase/`.

---

### Agent 2 — Hospital Staff Application
- **Branch:** `agent/hospital`
- **Primary Folder:** `hospital-app/`
- **Responsibilities:** Hospital staff authentication, duty availability toggle, high-priority emergency FCM notification banner & sound alert, Accept/Decline emergency workflow, authorized medical document viewer, patient vitals summary.
- **Strict Boundary:** MUST NOT modify `patient-app/`, `ambulance-app/`, or `supabase/`.

---

### Agent 3 — Ambulance Driver Application
- **Branch:** `agent/ambulance`
- **Primary Folder:** `ambulance-app/`
- **Responsibilities:** Driver login & ambulance vehicle ID setup, online/offline status, urgent dispatch FCM alert screen, Accept/Reject dispatch, turn-by-turn map navigation view, background GPS stream publisher, state transition buttons (Navigate → Arrived → Picked Up → Hospital Arrival → Complete).
- **Strict Boundary:** MUST NOT modify `patient-app/`, `hospital-app/`, or `supabase/`.

---

### Agent 4 — Backend, AI, Central Web & Integration
- **Branch:** `agent/backend-ai`
- **Primary Folders:** `supabase/`, `shared/`, `central-web/`
- **Responsibilities:** Supabase database migrations, Row Level Security (RLS) policies, Realtime publishing setup, Edge Functions (`create-emergency`, `hospital-action`, `ambulance-action`, `ai-chat`), Gemini AI orchestration, FCM trigger dispatcher, shared API contracts & types, Central Web Monitoring Dashboard (`central-web/`), master documentation & controlled integration.
- **Strict Boundary:** MUST NOT modify primary UI code in `patient-app/`, `hospital-app/`, or `ambulance-app/`.

---

## 🔒 Branch & Git Workflow Rules
1. Every agent operates on its designated `agent/*` branch.
2. Direct push to `main` is strictly forbidden during active agent work.
3. API contract changes must be proposed via `API_CONTRACTS.md` updates by Agent 4.
4. Always update `TEAM_STATUS.md` after achieving functional milestones.
