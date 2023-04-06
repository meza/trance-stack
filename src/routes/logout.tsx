import { authenticator } from '~/auth.server';
import { requestValidator } from '~/csrfToken.server';
import { destroySession, getSessionFromRequest } from '~/session.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  try {
    await requestValidator.validate(request);
  } catch (err) {
    console.error('Failed to validate', err);
  }
  const session = await getSessionFromRequest(request);

  const [userCookie, { cookie: csrfCookie }] = await Promise.all([
    destroySession(session),
    requestValidator.refreshCsrfTokenSession(request)
  ]);
  console.log('** new cookiee', [userCookie, csrfCookie].join(','));

  const headers = new Headers();
  headers.append('Set-Cookie', userCookie);
  headers.append('Set-Cookie', csrfCookie);

  await authenticator.logout(process.env.APP_DOMAIN, headers);
};

export const loader = action;
