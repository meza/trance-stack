import { contentSecurityPolicy } from '~/utils/contentSecurityPolicy';

export const securityHeaders = (isDev: boolean): Headers => {
  const owaspHeaders = new Headers();

  owaspHeaders.set('X-Frame-Options', 'SAMEORIGIN');
  owaspHeaders.set('Content-Security-Policy', contentSecurityPolicy(isDev));
  owaspHeaders.set('X-Content-Type-Options', 'nosniff');
  owaspHeaders.set('X-Permitted-Cross-Domain-Policies', 'none');
  owaspHeaders.set('Referrer-Policy', 'origin-when-cross-origin');
  owaspHeaders.set('X-XSS-Protection', '0');

  return owaspHeaders;
};

export const addSecurityHeaders = (headers: Headers, isDev: boolean): Headers => {
  const owaspHeaders = securityHeaders(isDev);

  owaspHeaders.forEach((value, key) => {
    headers.set(key, value);
  });

  return headers;
};
