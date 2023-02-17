import { getVisitorIdFromRequest } from '~/session.server';
import splitClient from '~/split.server';
import type { Features } from '~/features';

/**
 * @name hasFeature
 * @description
 */
export const hasFeature = async (request: Request, feature: Features): Promise<boolean> => {
  await splitClient.ready();
  const visitorId = await getVisitorIdFromRequest(request);
  const serverTreatment = splitClient.getTreatment(visitorId, feature);

  return serverTreatment === 'on';
};

