import { Response } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { initServerI18n } from '~/i18n';
import { createUserSession } from '~/session.server';
import { addSecurityHeaders, sanitizeHeaders } from '~/utils/securityHeaders';
import type { EntryContext } from '@remix-run/node';

export default async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) => {
  console.log(process.env);
  const locale = remixContext.staticHandlerContext.loaderData.root.locale;
  const isDevelopment = process.env.NODE_ENV === 'development';

  // initialise stuff in parallel
  const [i18nextInstance, cookie] = await Promise.all([
    initServerI18n(locale, remixContext),
    createUserSession(request)
  ]);

  const markup = renderToString(
    <I18nextProvider i18n={i18nextInstance}>
      <RemixServer context={remixContext} url={request.url}/>
    </I18nextProvider>
  );

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Set-Cookie', cookie);

  addSecurityHeaders(responseHeaders, isDevelopment);
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
    response.headers.set('Cache-Control', 'private, max-age=600');
  }
  return response;
};
