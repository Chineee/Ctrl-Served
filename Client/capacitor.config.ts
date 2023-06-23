import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ctrlserved.app',
  appName: 'CtrlServed',
  webDir: 'dist/client',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      "https://10.0.2.2:5000/*",
      "https://localhost:5000/*"
    ],
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
