import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Change language polyfill
 * Required due to a bug in react-i18next
 * @see https://github.com/sergiodxa/remix-i18next/issues/107
 * @param locale{string} - locale to change to
 */
export const useChangeLanguage = (locale: string) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale, i18n]);
};
