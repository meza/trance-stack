import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { getInitialNamespaces } from 'remix-i18next';
import { getBaseClientConfig } from './i18n.config';
import type { i18n } from 'i18next';

export default async function init(): Promise<i18n> {
  const version = window.appConfig.version;
  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
      ...getBaseClientConfig(),
      ns: getInitialNamespaces(),
      backend: {
        loadPath: `/_static/locales/{{lng}}/{{ns}}.json?v=${version}`
      },
      debug: false
    });

  return i18next;
}
