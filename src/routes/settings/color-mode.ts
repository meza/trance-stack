import { redirect } from '@remix-run/node';
import { commitSession, getSessionFromRequest } from '~/session.server';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async () => {
  throw redirect('/');
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const colorMode = body.get('colorMode');

  const session = await getSessionFromRequest(request);
  session.set('colorMode', colorMode);

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
      'Cache-Control': 'no-cache'
    }
  });
};
