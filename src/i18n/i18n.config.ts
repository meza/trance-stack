import type { InitOptions } from 'i18next';

export const supportedLngs = ['en'];
export const defaultNS = ['translation'];
export const fallbackLng = 'en';

const baseConfig: InitOptions = {
  supportedLngs: supportedLngs,
  fallbackLng: fallbackLng,
  defaultNS: defaultNS
};

export const getBaseClientConfig = (): InitOptions => ({
  ...baseConfig,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  detection: {
    order: ['htmlTag'],
    caches: []
  }
});

export default baseConfig;
