import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'The Hey App',
  webDir: './www/browser/',
  server: {
    cleartext: true,
    hostname: 'localhost:8100',
    iosScheme: 'http',
    androidScheme: 'http',
  },
  ios: {
    path: './ios',
  },
};

export default config;
