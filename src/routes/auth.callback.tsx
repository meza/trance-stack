import { authenticator } from '~/auth.server';
import { requestValidator } from '~/csrfToken.server';
import type { ActionFunction } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
  await authenticator.handleCallback(request,
    {
      onSuccessRedirect: ['/dashboard', async () => {
        const storage = await requestValidator.refreshCsrfTokenSession(request);
        return { 'set-cookie': storage.cookie };
      }]
    }
  );
};
