import React, { useEffect, useId } from 'react';
import { useFetcher } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Cookie from '~/atoms/Icons/cookie';
import { Toggle } from '~/atoms/Toggle';

export interface ConsentData {
  analytics?: boolean | undefined;
  marketing?: boolean | undefined;
  performance?: boolean | undefined;
}

interface CookieConsentContextProps {
  analytics?: boolean | undefined;
  marketing?: boolean | undefined;
  performance?: boolean | undefined;
  setAnalytics: (enabled: boolean) => void;
  setMarketing: (enabled: boolean) => void;
}

export const CookieConsentContext = React.createContext<CookieConsentContextProps>({} as CookieConsentContextProps);

export const CookieConsentProvider = ({ children, consentData }: { children: React.ReactNode, consentData?: ConsentData | undefined }) => {
  const [analytics, setAnalytics] = React.useState(consentData?.analytics === undefined ? true : consentData?.analytics);
  const [marketing, setMarketing] = React.useState(consentData?.marketing === undefined ? true : consentData?.marketing);

  return (
    <CookieConsentContext.Provider
      value={{
        analytics: analytics,
        marketing: marketing,
        setAnalytics: setAnalytics,
        setMarketing: setMarketing
      }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const CookieConsentBanner = () => {
  const id = useId();
  const formId = useId();
  const { t } = useTranslation();
  const { analytics } = React.useContext(CookieConsentContext);
  const acceptFormRef = React.useRef<HTMLFormElement>(null);
  const denyFormRef = React.useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();

  const acceptOnKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && acceptFormRef.current) {
      acceptFormRef.current.submit();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', acceptOnKeyDown);

    return () => {
      document.removeEventListener('keydown', acceptOnKeyDown);
    };
  });

  const shouldHide = () => {
    return fetcher.state !== 'idle';
  };

  return shouldHide() ? null : (
    <div className='cookie-consent-container'
      role={'dialog'}
      aria-describedby={id + '-text'}
      aria-labelledby={id + '-header'}
    >
      <div id={id + '-header'} className={'cookie-consent-header'}><Cookie/>{t('cookieConsent.title')}</div>
      <div id={id + '-text'} className={'cookie-consent-text'}>{t('cookieConsent.disclaimer')}</div>
      <fetcher.Form ref={acceptFormRef} action='/settings/cookie-consent' replace reloadDocument={true} method={'post'} id={formId + '-accept'}>
        <div className={'cookie-consent-switches'}>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={id + '-necessary'} className={'cookie-consent-title'}>{t('cookieConsent.label.necessary')}</label>
            <Toggle name={id + '-necessary'} id={'necessary'} checked={true} disabled={true} className={'cookie-consent-switch'}/>
          </div>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={id + '-analytics'} className={'cookie-consent-title'}>{t('cookieConsent.label.analytics')}</label>
            <Toggle tabIndex={1} name={id + '-analytics'} id={'analytics'} checked={analytics} className={'cookie-consent-switch'}/>
          </div>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={id + '-marketing'} className={'cookie-consent-title'}>{t('cookieConsent.label.marketing')}</label>
            <Toggle name={'marketing'} id={id + '-marketing'} checked={false} disabled={true} className={'cookie-consent-switch'}/>
          </div>
        </div>
      </fetcher.Form>
      <fetcher.Form ref={denyFormRef} action='/settings/cookie-consent' replace method={'post'} id={formId + '-deny'}>
        <input type={'hidden'} name={'analytics'} value={'false'}/>
        <input type={'hidden'} name={'marketing'} value={'false'}/>
      </fetcher.Form>

      <div className={'cookie-consent-buttons'}>
        <button form={formId + '-deny'} tabIndex={3}>{t('cookieConsent.deny')}</button>
        <button form={formId + '-accept'} className={'primary'} type={'submit'} tabIndex={2}>{t('cookieConsent.accept')}</button>
      </div>
    </div>
  );
};
