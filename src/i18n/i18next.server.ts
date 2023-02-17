import { resolve } from 'node:path';
import { createInstance } from 'i18next';
import Backend from 'i18next-fs-backend';
import { initReactI18next } from 'react-i18next';
import baseConfig from './i18n.config';
import remixI18next from './remix.server';
import type { EntryContext } from '@remix-run/node';
import type { i18n } from 'i18next';

let i18nextInstance: i18n;

const init = async (
  locale: string,
  remixContext: EntryContext
): Promise<i18n> => {
  if (!i18nextInstance) {
    i18nextInstance = createInstance().use(initReactI18next).use(Backend);
    await i18nextInstance.init({
      ...baseConfig,
      lng: locale,
      ns: remixI18next.getRouteNamespaces(remixContext),
      backend: {
        loadPath: resolve('../public/locales/{{lng}}/{{ns}}.json')
      }
    });
  }
  return i18nextInstance;
};

export default init;
