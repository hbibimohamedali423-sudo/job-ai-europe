import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from '@/i18n/locales/en.json'
import de from '@/i18n/locales/de.json'
import fr from '@/i18n/locales/fr.json'
import ar from '@/i18n/locales/ar.json'
import it from '@/i18n/locales/it.json'
import es from '@/i18n/locales/es.json'

export const languages = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'it', name: 'Italiano', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
] as const

export type Language = (typeof languages)[number]['code']

const resources = {
  en: { translation: en },
  de: { translation: de },
  fr: { translation: fr },
  ar: { translation: ar },
  it: { translation: it },
  es: { translation: es },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  })

export default i18n

export function getLanguageDir(code: string): 'ltr' | 'rtl' {
  return code === 'ar' ? 'rtl' : 'ltr'
}

export function isRTL(code: string): boolean {
  return code === 'ar'
}
