import { getCSP, NONE, STRICT_DYNAMIC } from 'csp-header';

/**
 * @name contentSecurityPolicy
 * @description A better way to set CSP directives
 */
export const contentSecurityPolicy = (nonce: string): string => {
  return getCSP({
    directives: {
      'script-src': [
        `'nonce-${nonce}' ${STRICT_DYNAMIC}`
      ],
      'object-src': [NONE],
      'base-uri': [NONE]
    }
  });
};
