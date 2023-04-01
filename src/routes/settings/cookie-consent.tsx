import { redirect } from '@remix-run/node';
import { commitSession, getSessionFromRequest } from '~/session.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  let body;
  try {
    body = await request.formData();
  } catch (_) {
    body = new FormData();
  }
  const analytics = body.get('analytics') || 'false';
  const marketing = body.get('marketing') || 'false';

  const session = await getSessionFromRequest(request);
  const newConsentData = {
    analytics: analytics === 'true',
    marketing: marketing === 'true'
  };
  session.set('consentData', newConsentData);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
      'Cache-Control': 'no-cache'
    }
  });
};
