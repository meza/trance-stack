import React, { useEffect } from 'react';
import { Form, useFetcher } from '@remix-run/react';
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
  const [analytics, setAnalytics] = React.useState(consentData?.analytics);
  const [marketing, setMarketing] = React.useState(consentData?.marketing);

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
  const { t } = useTranslation();
  const { analytics, setAnalytics } = React.useContext(CookieConsentContext);
  const formRef = React.useRef<HTMLFormElement>(null);
  const fetcher = useFetcher();

  const submit = () => {
    setTimeout(() => {
      fetcher.submit(formRef.current!, {
        method: 'post',
        replace: true
      });
    }, 50);
  };

  const deny = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAnalytics(false);
    submit();
    return false;
  };

  const acceptOnKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setAnalytics(true);
      submit();
    }
  };

  useEffect(() => {
    if (analytics === undefined) {
      setAnalytics(true);
    }
  }, [analytics]);

  useEffect(() => {
    document.addEventListener('keydown', acceptOnKeyDown);

    return () => {
      document.removeEventListener('keydown', acceptOnKeyDown);
    };
  });

  return (
    <div className='cookie-consent-container'
      role={'dialog'}
      aria-describedby={'cookie-consent-text'}
      aria-labelledby={'cookie-consent-header'}
    >
      <div id={'cookie-consent-header'} className={'cookie-consent-header'}><Cookie/>{t('cookieConsent.title')}</div>
      <div id={'cookie-consent-text'} className={'cookie-consent-text'}>{t('cookieConsent.disclaimer')}</div>
      <Form ref={formRef} action='/settings/cookie-consent' replace reloadDocument={true} method={'post'}>
        <div className={'cookie-consent-switches'}>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={'necessary'} className={'cookie-consent-title'}>{t('cookieConsent.label.necessary')}</label>
            <Toggle name={'necessary'} id={'necessary'} checked={true} disabled={true} className={'cookie-consent-switch'}/>
          </div>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={'analytics'} className={'cookie-consent-title'}>{t('cookieConsent.label.analytics')}</label>
            <Toggle tabIndex={1} name={'analytics'} id={'analytics'} checked={analytics} className={'cookie-consent-switch'}/>
          </div>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={'marketing'} className={'cookie-consent-title'}>{t('cookieConsent.label.marketing')}</label>
            <Toggle name={'marketing'} id={'marketing'} checked={false} disabled={true} className={'cookie-consent-switch'}/>
          </div>
        </div>
        <div className={'cookie-consent-buttons'}>
          <button
            tabIndex={3} onClick={deny}>{t('cookieConsent.deny')}</button>
          <button
            className={'primary'} type={'submit'} tabIndex={2}>{t('cookieConsent.accept')}</button>
        </div>

      </Form>
    </div>
  );
};
