import { RemixServer } from '@remix-run/react';
import type { EntryContext } from '@remix-run/server-runtime';
import { renderToString } from 'react-dom/server';

export default async function handleRequest(
  request: Request,
  statusCode: number,
  headers: Headers,
  context: EntryContext
) {

  const markup = renderToString(
    <RemixServer context={context} url={request.url} />
  );

  headers.set('Content-Type', 'text/html');

  return new Response('<!DOCTYPE html>' + markup, {
    status: statusCode,
    headers: headers
  });
}
