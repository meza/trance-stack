import { redirect } from '@remix-run/node';
import { authenticator } from '~/auth.server';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = () => redirect('/login');

export const action: ActionFunction = ({ request }) => {
  return authenticator.authenticate('auth0', request);
};
