import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/auth.server';
import { Hello, links as helloLinks } from '~/components/Hello';
import Login from '~/components/Login';
import { Features } from '~/features';
import { hasFeature } from '~/hooks/hasFeature';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => ([
  ...helloLinks()
]);

export const loader: LoaderFunction = async ({ request }) => {
  console.log('INDEX LOADER START', Date.now());
  const isAuth = await hasFeature(request, Features.AUTH);
  if (isAuth) {
    const user = await getUser(request);
    if (user) {
      throw redirect('/dashboard');
    }
  }
  console.log('ROOT LOADER END', Date.now());
  return json({
    isHelloEnabled: await hasFeature(request, Features.HELLO),
    isAuthEnabled: isAuth
  });
};

export default () => {
  const { isHelloEnabled, isAuthEnabled } = useLoaderData<typeof loader>();
  if (isHelloEnabled) {
    return (<div>
      <Hello/>
      {isAuthEnabled ? <Login/> : null}
    </div>);
  }
  return <div>Goodbye World!</div>;
};
