import type { ActionFunction } from '@remix-run/node';
import { authenticator } from '~/auth.server';

export const action: ActionFunction = () => {
  authenticator.authorize();
};
