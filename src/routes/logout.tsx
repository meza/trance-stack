import { authenticator } from '~/auth.server';
import { destroySession, getSessionFromRequest } from '~/session.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSessionFromRequest(request);

  await authenticator.logout(process.env.APP_DOMAIN, {
    'Set-Cookie': await destroySession(session)
  });
};

export const loader = action;
