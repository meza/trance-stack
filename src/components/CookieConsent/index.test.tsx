import React, { useContext, useEffect } from 'react';
import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing';
import { render, waitFor, screen } from '@testing-library/react';
import { vi, it, describe, expect } from 'vitest';
import { renderWithi18n } from '@test';
import { CookieConsentBanner, CookieConsentContext, CookieConsentProvider } from '~/components/CookieConsent/index';

const TestComponent = () => {
  const { analytics } = useContext(CookieConsentContext);
  return <>{analytics ? 'true' : 'false'}</>;
};

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

  describe.skip('the banner', () => {
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
  });
});
