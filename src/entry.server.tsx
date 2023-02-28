import crypto from 'node:crypto';
import React from 'react';
import { Response } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { initServerI18n } from '~/i18n';
import { addSecurityHeaders, sanitizeHeaders } from '~/utils/securityHeaders';
import { NonceContext } from './components/NonceContext';
import type { EntryContext } from '@remix-run/node';

export default async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) => {
  const cspNonce = crypto.randomBytes(16).toString('hex');
  const locale = 'en';
  // const isDevelopment = process.env.NODE_ENV === 'development';

  // initialise stuff in parallel
  const [i18nextInstance] = await Promise.all([
    initServerI18n(locale, remixContext)
  ]);

  const markup = renderToString(
    <NonceContext.Provider value={cspNonce}>
      <I18nextProvider i18n={i18nextInstance}>
        <RemixServer context={remixContext} url={request.url}/>
      </I18nextProvider>
    </NonceContext.Provider>
  );

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Cache-Control', 'no-cache, max-age=0, s-maxage=0');

  addSecurityHeaders(responseHeaders, cspNonce);
  sanitizeHeaders(responseHeaders);

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
};

export const handleDataRequest = (
  response: Response,
  { request }: { request: Request }
) => {
  // Cache all loader responses on the browser for 10mins, unless overridden in the loader
  if (
    !response.headers.get('Cache-Control')
    && request.method.toLowerCase() === 'get'
  ) {
    response.headers.set('Cache-Control', 'private, max-age=600, no-cache="Set-Cookie"');
  }
  return response;
};
