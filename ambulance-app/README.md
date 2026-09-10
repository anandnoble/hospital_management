# Ambulance Driver Android Application (`ambulance-app/`)

Owned by **Agent 3** (`agent/ambulance` branch).

## Responsibilities:
- Driver login & vehicle ID assignment
- High-priority FCM dispatch alert (Sound, Vibration, Accept / Reject buttons)
- Turn-by-turn map navigation to patient & hospital
- Background GPS location stream to Supabase (`ambulance_locations`)
- One-touch status progression (Navigate → Arrived → Picked Up → Hospital Arrival → Complete)

## Architecture Notes:
Refer to [API_CONTRACTS.md](file:///d:/hospita%20management%20system/API_CONTRACTS.md) for backend endpoints.
