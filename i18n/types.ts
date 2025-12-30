import 'i18next';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enTable from './locales/en/table.json';
import enForm from './locales/en/form.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof enCommon;
      auth: typeof enAuth;
      table: typeof enTable;
      form: typeof enForm;
    };
  }
}
