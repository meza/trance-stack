import { authenticator } from '~/auth.server';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = ({ request }) => {
  return authenticator.authenticate('auth0', request, {
    successRedirect: '/',
    failureRedirect: '/login'
  });
};
