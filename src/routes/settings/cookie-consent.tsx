import React, { useEffect } from 'react';
import { redirect } from '@remix-run/node';
import { Form } from '@remix-run/react';
import Cookies from 'js-cookie';
import { CookieConsentContext } from '~/components/CookieConsent';
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
  const analytics = body.get('analytics') || 'off';
  const marketing = body.get('marketing') || 'off';
  const performance = body.get('performance') || 'off';

  const session = await getSessionFromRequest(request);
  session.set('consentData', {
    analytics: analytics === 'on',
    marketing: marketing === 'on',
    performance: performance === 'on'
  });

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
      'Cache-Control': 'no-cache'
    }
  });
};

export default () => {
  const { analytics, marketing, performance } = React.useContext(CookieConsentContext);
  const [analyticsConsent, setAnalyticsConsent] = React.useState(analytics || false);
  const [marketingConsent, setMarketingConsent] = React.useState(marketing || false);
  const [performanceConsent, setPerformanceConsent] = React.useState(performance || false);

  useEffect(() => {
    console.log(Cookies.get());
  }, [analytics, marketing, performance]);

  return (
    <div className="cookie-consent-banner">
      <Form method="post" action="/settings/cookie-consent" replace reloadDocument={true}>
        <label htmlFor={'analytics'}>Analytics</label>
        <input type={'checkbox'} name={'analytics'} id={'analytics'} defaultChecked={true} onClick={() => setAnalyticsConsent(!analyticsConsent)}/>
        <label htmlFor={'marketing'}>Marketing</label>
        <input type={'checkbox'} name={'marketing'} id={'marketing'} defaultChecked={marketingConsent} onClick={() => setMarketingConsent(!marketingConsent)}/>
        <label htmlFor={'performance'}>Performance</label>
        <input type={'checkbox'} name={'performance'} id={'performance'} defaultChecked={true} onClick={() => setPerformanceConsent(!performanceConsent)}/>
        <button type="submit">Save</button>
      </Form>
    </div>
  );
};
