import type { InitOptions } from 'i18next';

export const supportedLngs = ['en'];
export const defaultNS = ['translation'];
export const fallbackLng = 'en';

const baseConfig: InitOptions = {
  supportedLngs: supportedLngs,
  fallbackLng: fallbackLng,
  defaultNS: defaultNS,
  debug: process.env.NODE_ENV === 'development'
};

export const getBaseClientConfig = (): InitOptions => ({
  debug: baseConfig.debug,
  supportedLngs: baseConfig.supportedLngs,
  fallbackLng: baseConfig.fallbackLng,
  defaultNS: baseConfig.defaultNS,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
  detection: {
    order: ['htmlTag'],
    caches: []
  }
});

export default baseConfig;
