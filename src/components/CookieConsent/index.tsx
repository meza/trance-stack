import React from 'react';
import { Form } from '@remix-run/react';

export interface ConsentData {
  analytics?: boolean | undefined;
  marketing?: boolean | undefined;
  performance?: boolean | undefined;
}

interface CookieConsentContextProps {
  analytics?: boolean | undefined;
  marketing?: boolean | undefined;
  performance?: boolean | undefined;
  enableAnalytics: () => void;
  enableMarketing: () => void;
  enablePerformance: () => void;
}

export const CookieConsentContext = React.createContext<CookieConsentContextProps>({} as CookieConsentContextProps);

export const CookieConsentProvider = ({ children, consentData }: { children: React.ReactNode, consentData?: ConsentData | undefined }) => {
  const [analytics, setAnalytics] = React.useState(consentData?.analytics);
  const [marketing, setMarketing] = React.useState(consentData?.marketing);
  const [performance, setPerformance] = React.useState(consentData?.performance);
  const enableAnalytics = () => {
    setAnalytics(true);
  };

  const enableMarketing = () => {
    setMarketing(true);
  };

  const enablePerformance = () => {
    setPerformance(true);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        analytics: analytics,
        marketing: marketing,
        performance: performance,
        enableAnalytics: enableAnalytics,
        enableMarketing: enableMarketing,
        enablePerformance: enablePerformance
      }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const CookieConsentBanner = () => {
  const { analytics, marketing, performance } = React.useContext(CookieConsentContext);
  const [analyticsConsent, setAnalyticsConsent] = React.useState(analytics || false);
  const [marketingConsent, setMarketingConsent] = React.useState(marketing || false);
  const [performanceConsent, setPerformanceConsent] = React.useState(performance || false);

  if (analytics !== undefined && marketing !== undefined && performance !== undefined) {
    return null;
  }

  return (
    <div className="cookie-consent-banner">
      <Form method="post" action="/settings/cookie-consent" replace reloadDocument={true}>
        <label htmlFor={'analytics'}>Analytics</label>
        <input type={'checkbox'} name={'analytics'} id={'analytics'} defaultChecked={true} onClick={() => setAnalyticsConsent(!analyticsConsent)}/>
        <label htmlFor={'marketing'}>Marketing</label>
        <input type={'checkbox'} name={'marketing'} id={'marketing'} defaultChecked={marketingConsent} onClick={() => setMarketingConsent(!marketingConsent)}/>
        <label htmlFor={'performance'}>Performance</label>
        <input type={'checkbox'} name={'performance'} id={'performance'} defaultChecked={true} onClick={() => setPerformanceConsent(!performanceConsent)}/>
        <button type="submit">Save</button>
      </Form>
    </div>
  );
};
