import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Hello } from '~/components/Hello';
import { Features } from '~/features';
import { getVisitorIdFromRequest } from '~/session.server';
import splitClient from '~/split.server';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
  await splitClient.ready();
  const visitorId = await getVisitorIdFromRequest(request);
  const serverTreatment = splitClient.getTreatment(visitorId, Features.HELLO);

  return json({
    serverTreatment: serverTreatment
  });
};

export default () => {
  const { serverTreatment } = useLoaderData<typeof loader>();
  if (serverTreatment === 'on') {
    return <Hello/>;
  }
  return <div>Goodbye World!</div>;
};
