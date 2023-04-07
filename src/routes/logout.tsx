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

  await authenticator.logout(process.env.APP_DOMAIN, [
    ['set-cookie', userCookie],
    ['set-cookie', csrfCookie]
  ]);
};

export const loader = action;
