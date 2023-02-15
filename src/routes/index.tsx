import type { LoaderFunction } from '@remix-run/node';
import splitClient from '~/split.server';
import { getVisitorIdByRequest } from '~/session.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Features } from '~/features';
import { Hello } from '~/components/Hello';

export const loader: LoaderFunction = async ({ request }) => {
  await splitClient.ready();
  const visitorId = await getVisitorIdByRequest(request);
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
