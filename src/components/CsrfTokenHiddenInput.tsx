import React from 'react';
import { useOutletContext } from '@remix-run/react';

export const CsrfTokenHiddenInput = () => {
  const { appConfig: { csrfToken, csrfTokenKey } } = useOutletContext<{ appConfig: AppConfig }>();
  if (!csrfToken) {
    console.error('No CSRF token found in appConfig.');
    return null;
  }
  return <input type={'hidden'} name={csrfTokenKey} value={csrfToken} />;
};
