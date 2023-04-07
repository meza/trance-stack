import { authenticator } from '~/auth.server';
import { requestValidator } from '~/csrfToken.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  await requestValidator.validate(request);
  await authenticator.authorize(request, { forceLogin: true });
};
