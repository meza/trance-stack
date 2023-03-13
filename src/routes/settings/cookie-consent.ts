import { redirect } from '@remix-run/node';
import { commitSession, getSessionFromRequest } from '~/session.server';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  throw redirect('/');
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
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
