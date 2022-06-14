import Backend from 'i18next-fs-backend';
import { RemixI18Next } from 'remix-i18next';
import i18n from './i18n';

const i18next = new RemixI18Next({
  detection: {
    order: ['searchParams', 'header', 'session', 'cookie'],
    supportedLanguages: i18n.supportedLngs,
    fallbackLanguage: i18n.fallbackLng
  },
  // The backend you want to use to load the translations
  // Tip: You could pass `resources` to the `i18next` configuration and avoid
  // a backend here
  backend: Backend
});

export default i18next;
