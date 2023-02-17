import type { InitOptions } from 'i18next';

export const supportedLngs = ['en'];
export const defaultNS = ['translation'];
export const fallbackLng = 'en';

export const getBaseClientConfig = (): InitOptions => ({
  supportedLngs: ['en'],
  fallbackLng: fallbackLng,
  defaultNS: defaultNS,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  detection: {
    order: ['htmlTag'],
    caches: []
  }
});
