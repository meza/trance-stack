import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/auth.server';
import Logout from '~/components/Logout';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await authenticator.getUser(request, context);
  return json({
    user: user
  });
};

export default () => {
  const { user } = useLoaderData<typeof loader>();
  return <div>Dashboard for {user.nickname || user.givenName || user.name} - <Logout/></div>;
};

