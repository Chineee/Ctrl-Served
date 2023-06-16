import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ctrlserved.app',
  appName: 'CtrlServed',
  webDir: 'dist/client',
  server: {
    androidScheme: 'http',
    cleartext: true,
    allowNavigation: [
      "http://10.0.2.2:5000/*",
      "http://localhost:5000/*"
    ],
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
