import { authenticator } from '~/auth.server';
import { getCsrfToken } from '~/csrf-cookie.server';
import { requestValidator } from '~/csrfToken.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  await requestValidator.validate(request);
  const csrfToken = await getCsrfToken(request);
  authenticator.authorize({ forceLogin: true, csrfToken: csrfToken });
};
