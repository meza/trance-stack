import { authenticator } from '~/auth.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  await authenticator.handleCallback(request, {
    onSuccessRedirect: '/dashboard'
  });
};
