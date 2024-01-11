import { redirect } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import Login from '~/components/Login';
import { Features } from '~/features';
import { hasFeature } from '~/hooks/hasFeature';

export const loader: LoaderFunction = async ({ request }) => {
  const hasAuth = await hasFeature(request, Features.AUTH);
  if (!hasAuth) {
    throw redirect('/');
  }
};

export default () => {
  return <Login/>;
};
