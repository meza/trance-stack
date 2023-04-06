import React, { useContext, useEffect } from 'react';
import { redirect } from '@remix-run/node';
import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing';
import { render, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, it, describe } from 'vitest';
import { renderWithi18n } from '@test';
import { CookieConsentBanner, CookieConsentContext, CookieConsentProvider } from '~/components/CookieConsent/index';

const TestComponent = () => {
  const { analytics } = useContext(CookieConsentContext);
  return <>{analytics === undefined ? 'undefined' : String(analytics)}</>;
};

vi.mock('~/atoms/Icons/cookie', () => ({
  default: () => <div id={'cookie-icon'}/>
}));

describe('The Cookie Consent Component', () => {
  describe('the provider', () => {
    it('does not interfere with the unset status', async () => {
      render(
        <CookieConsentProvider>
          <TestComponent/>
        </CookieConsentProvider>
      );

      await waitFor(() => expect(screen.getByText('undefined')).toBeInTheDocument());
    });

    it('can pass on the initial consent data', async () => {
      render(
        <CookieConsentProvider
          consentData={
            {
              analytics: false
            }
          }>
          <TestComponent/>
        </CookieConsentProvider>
      );

      await waitFor(() => expect(screen.getByText('false')).toBeInTheDocument());
    });

    it('propagates the change', async () => {
      const TestComponent1 = () => {
        const { setAnalytics } = useContext(CookieConsentContext);
        useEffect(() => {
          setAnalytics(false);
        });
        return <></>;
      };

      render(
        <CookieConsentProvider>
          <TestComponent/>
          <TestComponent1/>
        </CookieConsentProvider>
      );

      await waitFor(() => expect(screen.getByText('false')).toBeInTheDocument());
    });
  });

  describe('the banner', () => {
    it('renders the form', async ({ expect }) => {
      const RemixStub = createRemixStub([
        {
          path: '/*',
          element: <CookieConsentProvider><CookieConsentBanner/></CookieConsentProvider>
        }
      ]);

      const component = renderWithi18n(<RemixStub/>);
      expect(component.asFragment()).toMatchSnapshot();
    });

    it('hides and saves the form correctly on deny', async ({ expect }) => {
      let analytics, marketing;
      const settingsSpy = vi.fn();
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: '/',
          element: <CookieConsentProvider><CookieConsentBanner/></CookieConsentProvider>
        },
        {
          path: '/settings/cookie-consent',
          action: async ({ request }) => {
            const formData = await request.formData();
            analytics = formData.get('analytics');
            marketing = formData.get('marketing');
            settingsSpy();
            throw redirect('/');
          }
        }
      ]);

      renderWithi18n(<RemixStub initialEntries={['/']}/>);
      const denyButton = screen.getByRole('button', { name: 'cookieConsent.deny' });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      await user.click(denyButton);

      expect(settingsSpy).toHaveBeenCalled();
      expect(analytics).toBe('false');
      expect(marketing).toBe('false');
      expect(dialog).not.toBeInTheDocument();
    });

    it.each([undefined, true, false])('is wired up correctly when %s', async (analyticsState) => {
      // As long as the form is wired up properly, we trust that the browser can do its thing.
      // We don't need to test that the submission works because there is no custom logic in the
      // submission handler.
      const RemixStub = createRemixStub([
        {
          path: '/',
          element: <CookieConsentProvider
            consentData={
              {
                analytics: analyticsState
              }
            }
          ><CookieConsentBanner/></CookieConsentProvider>
        }
      ]);

      renderWithi18n(<RemixStub initialEntries={['/']}/>);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toMatchSnapshot();
    });

    it('adds the escape key handler', async ({ expect }) => {
      const keydownSpy = vi.fn();
      const user = userEvent.setup();
      const RemixStub = createRemixStub([
        {
          path: '/',
          element: <CookieConsentProvider><CookieConsentBanner/></CookieConsentProvider>
        }
      ]);

      renderWithi18n(<RemixStub initialEntries={['/']}/>);
      const dialog = screen.getByRole('dialog');

      // This is rather ugly but since the form submit isn't implemented in jsdom, it kinda evens out
      // and gets the job done.
      dialog.querySelector('form')!.requestSubmit = () => {
        keydownSpy();
      };

      expect(dialog).toBeInTheDocument();

      await user.keyboard('[Escape]');

      expect(keydownSpy).toHaveBeenCalled();
    });
  });
});
