import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector'; // Importiere den Language Detector
import translationEN from './locales/en/translation.json';
import translationDE from './locales/de/translation.json';
import translationRU from './locales/ru/translation.json';
import translationUA from './locales/ua/translation.json';
import translationHE from './locales/he/translation.json';
import translationIN from './locales/in/translation.json';

const resources = {
  en: {
    translation: translationEN
  },
  de: {
    translation: translationDE
  },
  ru: {
    translation: translationRU
  },
  ua: {
    translation: translationUA
  },
  he: {
    translation: translationHE
  },
  in: {
    translation: translationIN
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
