import i18n, { Resource } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import {
  defaultNS,
  supportedLngs,
  getBaseClientConfig
} from '~/i18n/i18n.config';

const resources: Resource = defaultNS.reduce((acc, namespace) => {
  supportedLngs.forEach((language) => {
    if (!acc[language]) {
      acc[language] = {};
    }
    acc[language] = {
      ...acc[language],
      // eslint-disable-next-line security/detect-non-literal-require
      [namespace]: require(`../public/locales/${language}/${namespace}.json`)
    };
  });
  return acc;
}, {} as Resource);

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(Backend)
  .init({
    ...getBaseClientConfig(),
    resources: resources
  });

export default i18n;
