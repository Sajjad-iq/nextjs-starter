import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enDashboard from './locales/en/dashboard.json'
import arDashboard from './locales/ar/dashboard.json'
import enAuth from './locales/en/auth.json'
import arAuth from './locales/ar/auth.json'

const resources = {
  en: {
    dashboard: enDashboard,
    auth: enAuth
  },
  ar: {
    dashboard: arDashboard,
    auth: arAuth
  }
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

// Check if there's a saved language preference (only in browser)
const savedLanguage = isBrowser ? localStorage.getItem('i18nextLng') : null

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'ar', // Fallback to Arabic if no language is detected
    lng: savedLanguage || 'ar', // Use saved language or default to Arabic
    defaultNS: 'dashboard',
    ns: ['dashboard', 'auth'],
    debug: false,

    interpolation: {
      escapeValue: false // React already safes from xss
    },

    detection: {
      // Order of detection methods - localStorage has highest priority
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  })

// Save default language to localStorage if nothing is saved (only in browser)
if (isBrowser && !savedLanguage) {
  localStorage.setItem('i18nextLng', 'ar')
}

export default i18n
