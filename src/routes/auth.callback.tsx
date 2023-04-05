import { authenticator } from '~/auth.server';
import { createCsrfCookie } from '~/csrf-cookie.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  // const csrfToken = await getCsrfToken(request);
  await authenticator.handleCallback(request,
    {
      onSuccessRedirect: ['/dashboard', {
        'Set-Cookie': await createCsrfCookie(request, { refreshToken: true })
      }]
    }
  );
};
