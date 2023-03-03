import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const { user } = useLoaderData<typeof loader>();
  return (<>
    <div>{t('dashboard.for', { name: user.nickname || user.givenName || user.name })}<br/><Logout/></div>
  </>);
};

