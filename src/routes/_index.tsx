import React from 'react';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { authenticator } from '~/auth.server';
import ColorModeSwitcher from '~/components/ColorModeSwitcher';
import { Hello, links as helloLinks } from '~/components/Hello';
import Login from '~/components/Login';
import { createCrsfCookie } from '~/csrf-cookie.server';
import { Features } from '~/features';
import { hasFeature } from '~/hooks/hasFeature';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';

export const links: LinksFunction = () => ([
  ...helloLinks()
]);

export const loader: LoaderFunction = async ({ request, context }) => {
  const isAuth = await hasFeature(request, Features.AUTH);

  if (isAuth) {
    try {
      console.log('** checking user...');
      const user = await authenticator.getUser(request, context);
      console.log('** user', user);
      return redirect('/dashboard');
    } catch (_) {
      console.error('OH NO', _);
    }
  }

  const cookieData = isAuth ? await createCrsfCookie(request) : null;
  return json({
    isHelloEnabled: await hasFeature(request, Features.HELLO),
    isAuthEnabled: isAuth
  }, {
    ...(cookieData ? { headers: { 'Set-Cookie': cookieData } } : {})
  });
};

export default () => {
  const { t } = useTranslation();
  const { isHelloEnabled, isAuthEnabled } = useLoaderData<typeof loader>();
  if (isHelloEnabled) {
    return (<div>
      <Hello />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0
        }}>
        <ColorModeSwitcher />
      </div>
      {isAuthEnabled ? <Login /> : null}
    </div>);
  }
  return <div>{t('translation:microcopy.goodBye')}</div>;
};
