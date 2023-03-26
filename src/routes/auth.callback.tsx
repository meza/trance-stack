import { authenticator } from '~/auth.server';
import { destroyCrsfCookie, getCsrfToken } from '~/csrf-cookie.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  const csrfToken = await getCsrfToken(request);
  await authenticator.handleCallback(request,
    csrfToken ? {
      csrfToken: csrfToken,
      onSuccessRedirect: ['/dashboard', { 'Set-Cookie': await destroyCrsfCookie(request) }]
    } : {
      onSuccessRedirect: '/dashboard'
    }
  );
};
