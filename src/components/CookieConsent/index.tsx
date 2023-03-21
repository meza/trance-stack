import React, { useEffect, useId } from 'react';
import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import Cookie from '~/atoms/Icons/cookie';
import { Toggle } from '~/atoms/Toggle';

export interface ConsentData {
  analytics?: boolean | undefined;
  marketing?: boolean | undefined;
  performance?: boolean | undefined;
}

interface CookieConsentContextProps {
  analytics: boolean;
  marketing: boolean;
  // performance: boolean;
}

export const CookieConsentContext = React.createContext<CookieConsentContextProps>({} as CookieConsentContextProps);

export const CookieConsentProvider = ({ children, consentData = {} }: { children: React.ReactNode, consentData?: ConsentData | undefined }) => {
  const { analytics, marketing } = consentData;
  return (
    <CookieConsentContext.Provider
      value={{
        analytics: typeof analytics === 'undefined' ? true : analytics,
        marketing: typeof marketing === 'undefined' ? false : marketing
      }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const CookieConsentBanner = () => {
  const id = useId();
  const { t } = useTranslation();
  const { analytics, marketing } = React.useContext(CookieConsentContext);
  const acceptFormRef = React.useRef<HTMLFormElement>(null);

  useEffect(() => {
    const acceptOnKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && acceptFormRef.current) {
        acceptFormRef.current.submit();
      }
    };

    document.addEventListener('keydown', acceptOnKeyDown);

    return () => {
      document.removeEventListener('keydown', acceptOnKeyDown);
    };
  }, []);

  return (
    <div className='cookie-consent-container'
      role={'dialog'}
      aria-describedby={id + '-text'}
      aria-labelledby={id + '-header'}
    >
      <div id={id + '-header'} className={'cookie-consent-header'}><Cookie />{t('cookieConsent.title')}</div>
      <div id={id + '-text'} className={'cookie-consent-text'}>{t('cookieConsent.disclaimer')}</div>
      <div className={'cookie-consent-switches'}>

        <Form style={{ display: 'contents' }} ref={acceptFormRef} action='/settings/cookie-consent' id={'accept-form'} replace reloadDocument={true} method={'post'}>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={id + '-necessary'} className={'cookie-consent-title'}>{t('cookieConsent.label.necessary')}</label>
            <Toggle id={id + '-necessary'} name={'necessary'} defaultChecked={true} readOnly />
          </div>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={id + '-analytics'} className={'cookie-consent-title'}>{t('cookieConsent.label.analytics')}</label>
            <Toggle id={id + '-analytics'} name={'analytics'} defaultChecked={analytics} tabIndex={1} />
          </div>
          <div className={'cookie-consent-switch'}>
            <label htmlFor={id + '-marketing'} className={'cookie-consent-title'}>{t('cookieConsent.label.marketing')}</label>
            <Toggle id={id + '-marketing'} name={'marketing'} defaultChecked={marketing} disabled={true} />
          </div>
        </Form>

        <Form action='/settings/cookie-consent' id={'deny-form'} replace method={'post'}>
          <input type={'hidden'} name={'analytics'} value={'false'} />
          <input type={'hidden'} name={'marketing'} value={'false'} />
        </Form>

      </div>
      <div className={'cookie-consent-buttons'}>
        <button tabIndex={3} type={'submit'} form={'deny-form'}>
          {t('cookieConsent.deny')}
        </button>
        <button tabIndex={2} type={'submit'} form={'accept-form'} className={'primary'}>
          {t('cookieConsent.accept')}
        </button>
      </div>
    </div>
  );
};
