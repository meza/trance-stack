import { authenticator } from '~/auth.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = () => {
  const forceLogin = false;
  authenticator.authorize(forceLogin);
};
