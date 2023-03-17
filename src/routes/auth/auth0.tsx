import { authenticator } from '~/auth.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = () => {
  authenticator.authorize();
};
