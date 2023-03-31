import React, { useContext, useEffect } from 'react';
import { redirect } from '@remix-run/node';
import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing';
import { render, waitFor, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, it, describe, expect } from 'vitest';
import { renderWithi18n } from '@test';
import { CookieConsentBanner, CookieConsentContext, CookieConsentProvider } from '~/components/CookieConsent/index';

const TestComponent = () => {
  const { analytics } = useContext(CookieConsentContext);
  return <>{analytics ? 'true' : 'false'}</>;
};

vi.mock('~/atoms/Icons/cookie', () => ({
  default: () => <div id={'cookie-icon'}/>
}));

describe('The Cookie Consent Component', () => {
  describe('the provider', () => {
    it('sets the default state of analytics to true', async () => {
      render(
        <CookieConsentProvider>
          <TestComponent/>
        </CookieConsentProvider>
      );

      await waitFor(() => expect(screen.getByText('true')).toBeInTheDocument());
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
    it('renders the form', async () => {
      const RemixStub = createRemixStub([
        {
          path: '/*',
          element: <CookieConsentProvider><CookieConsentBanner/></CookieConsentProvider>
        }
      ]);

      const component = renderWithi18n(<RemixStub/>);
      expect(component.asFragment()).toMatchSnapshot();
    });

    it('hides and saves the form correctly on deny', async () => {
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

    it('saves the form correctly on accept', async () => {
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
      const acceptButton = screen.getByRole('button', { name: 'cookieConsent.accept' });
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      await user.click(screen.getByLabelText('cookieConsent.label.analytics'));
      await user.click(acceptButton);

      expect(settingsSpy).toHaveBeenCalled();
      expect(analytics).toBe('false');
      expect(marketing).toBe('false');
    });
  });
});
