import React from 'react';
import { useOutletContext } from '@remix-run/react';

export const CsrfTokenHiddenInput = () => {
  const { appConfig: { csrfToken, csrfTokenKey } } = useOutletContext<{ appConfig: AppConfig }>();
  if (!csrfToken) {
    throw new Error('No csrfToken found in appConfig.');
  }
  return <input type={'hidden'} name={csrfTokenKey} value={csrfToken} />;
};
