import { authenticator } from '~/auth.server';
import type { ActionFunction } from '@remix-run/node';

export { loader } from '~/routes/login';

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, {
    redirectTo: process.env.APP_DOMAIN
  });
};
