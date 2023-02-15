import { getCSP, SELF, UNSAFE_INLINE, BLOB, DATA, NONE } from 'csp-header';

/**
 * @name contentSecurityPolicy
 * @description A better way to set CSP directives
 */
export const contentSecurityPolicy = (isDevelopment: boolean): string => {
  return getCSP({
    directives: {
      'default-src': [SELF],
      'worker-src': [BLOB],
      'script-src': [
        SELF,
        UNSAFE_INLINE,
        'https://api-eu.mixpanel.com',
        'https://api.mixpanel.com',
        'https://*.hotjar.com',
        'https://*.hotjar.io'
      ],
      'connect-src': [
        SELF,
        UNSAFE_INLINE,
        'https://api-eu.mixpanel.com',
        'https://api.mixpanel.com',
        'wss://*.hotjar.com',
        'https://*.hotjar.com',
        'https://*.hotjar.io',
        isDevelopment ? 'ws://localhost:2222' : '',
        isDevelopment ? 'ws://localhost:8002' : ''
      ],
      'img-src': ['https:', DATA, 'http:'],
      'frame-ancestors': [NONE],
      'frame-src': [
        'https://api-eu.mixpanel.com',
        'https://api.mixpanel.com',
        'https://*.hotjar.com',
        'https://*.hotjar.io'
      ],
      'style-src': [SELF, UNSAFE_INLINE]
    }
  });
};
