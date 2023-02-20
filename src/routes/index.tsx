import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { authenticator } from '~/auth.server';
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
  await authenticator.isAuthenticated(request, {
    successRedirect: '/dashboard'
  });
  console.log('ROOT LOADER END', Date.now());
  return json({
    isHelloEnabled: await hasFeature(request, Features.HELLO)
  });
};

export default () => {
  const { isHelloEnabled } = useLoaderData<typeof loader>();
  if (isHelloEnabled) {
    return (<div>
      <Hello/>
      <Login/>
    </div>);
  }
  return <div>Goodbye World!</div>;
};
