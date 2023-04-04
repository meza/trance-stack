import { posthog } from '~/posthog.server';
import { getVisitorIdFromRequest } from '~/session.server';
import type { Features } from '~/features';

/**
 * @name hasFeature
 * @description
 */
export const hasFeature = async (request: Request, feature: Features): Promise<boolean> => {
  const visitorId = await getVisitorIdFromRequest(request);
  const isEnabled = await posthog.isFeatureEnabled(feature, visitorId);
  return !!isEnabled;
};

