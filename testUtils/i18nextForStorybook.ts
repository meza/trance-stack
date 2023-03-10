import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../public/locales/en/translation.json';

i18n
  .use(initReactI18next)

  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: {
        translation: en // no translations mean we can test and snapshot the translation keys used
      }
    }
  });

export default i18n;
