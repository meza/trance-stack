import React from 'react';
import { redirect } from '@remix-run/node';
import { CookieConsentBanner } from '~/components/CookieConsent';
import { commitSession, getSessionFromRequest } from '~/session.server';
import type { ActionFunction } from '@remix-run/node';

//
// export const loader: LoaderFunction = async () => {
//   throw redirect('/');
// };

export const action: ActionFunction = async ({ request }) => {
  let body;
  try {
    body = await request.formData();
  } catch (_) {
    body = new FormData();
  }
  const analytics = body.get('analytics') || 'false';
  const marketing = body.get('marketing') || 'false';
  const performance = body.get('performance') || 'false';

  const session = await getSessionFromRequest(request);
  const newConsentData = {
    analytics: analytics === 'true',
    marketing: marketing === 'true',
    performance: performance === 'true'
  };
  console.log(newConsentData);
  session.set('consentData', newConsentData);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
      'Cache-Control': 'no-cache'
    }
  });
};

export default () => <CookieConsentBanner />;
