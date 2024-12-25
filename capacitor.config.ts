import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  ios: {
    path: './ios',
  },
  appId: 'io.ionic.starter',
  appName: 'tha-frontend',
  webDir: './www/browser/',
  server: {
    cleartext: true,
    hostname: 'localhost:8100',
    iosScheme: 'https',
  },
};

export default config;
