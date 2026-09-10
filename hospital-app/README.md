# Hospital Staff Android Application (`hospital-app/`)

Owned by **Agent 2** (`agent/hospital` branch).

## Responsibilities:
- Hospital staff authentication & status toggle
- High-priority FCM emergency alerts (Sound, Vibration, Urgent Alert UI)
- Emergency request Accept / Decline workflow
- Authorized patient vitals & medical document view
- Ambulance arrival ETA & live tracking map

## Running & Building on Android:
- **Dev Server:** `npm run dev`
- **Build Web Assets & Sync to Android:** `npm run cap:sync`
- **Open in Android Studio:** `npm run cap:open` (or `npx cap open android`)
- **Build Debug APK via CLI:**
  1. Ensure Android SDK is installed via Android Studio or command-line tools.
  2. In `hospital-app/android`: `.\gradlew.bat assembleDebug`
  3. The compiled APK will be generated at `hospital-app/android/app/build/outputs/apk/debug/app-debug.apk`.

