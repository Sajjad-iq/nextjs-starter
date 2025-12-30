import 'i18next';
import enDashboard from './locales/en/dashboard.json';
import enAuth from './locales/en/auth.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'dashboard';
    resources: {
      dashboard: typeof enDashboard;
      auth: typeof enAuth;
    };
  }
}
