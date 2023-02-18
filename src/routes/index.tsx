import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Hello, links as helloLinks } from '~/components/Hello';
import { Features } from '~/features';
import { hasFeature } from '~/hooks/hasFeature';
import type { LoaderFunction, LinksFunction } from '@remix-run/node';

export const links: LinksFunction = () => ([
  ...helloLinks()
]);

export const loader: LoaderFunction = async ({ request }) => {
  return json({
    isHelloEnabled: await hasFeature(request, Features.HELLO)
  });
};

export default () => {
  const { isHelloEnabled } = useLoaderData<typeof loader>();
  if (isHelloEnabled) {
    return <Hello/>;
  }
  return <div>Goodbye World!</div>;
};
