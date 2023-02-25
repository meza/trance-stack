import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/auth.server';
import Logout from '~/components/Logout';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request, context }) => {
  const user = await getUser(request, {
    failureRedirect: '/'
  });

  console.log('DASHBOARD LOADER START', Date.now(), context.wow);
  console.log(user);
  console.log('DASHBOARD LOADER END', Date.now());
  return json({
    user: user
  });
};

export default () => {
  const { user } = useLoaderData<typeof loader>();
  return <div>Dashboard for {user.nickname || user.givenName || user.name} - <Logout/></div>;
};

