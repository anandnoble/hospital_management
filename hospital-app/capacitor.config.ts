import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.healthcare.hospitalapp',
  appName: 'Hospital Staff App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
