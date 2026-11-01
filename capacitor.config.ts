import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.budgetdekoo.app',
  appName: 'Budget Dekoo',
  webDir: 'public',
  server: {
    // In production or development with live reload, configure URL or fallback to bundled web assets
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
