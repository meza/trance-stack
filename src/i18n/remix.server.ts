import { resolve } from 'node:path';
import Backend from 'i18next-fs-backend';
import { RemixI18Next } from 'remix-i18next';
import { supportedLngs, fallbackLng } from './i18n.config';
import type { NewableModule } from 'i18next';

const i18next = new RemixI18Next({
  detection: {
    supportedLanguages: supportedLngs,
    fallbackLanguage: fallbackLng
  },
  i18next: {
    backend: {
      loadPath: resolve('../public/locales/{{lng}}/{{ns}}.json')
    }
  },
  backend: Backend as NewableModule<Backend>
});

export default i18next;
