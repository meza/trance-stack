import React from 'react';
import { useOutletContext } from '@remix-run/react';

export const CsrfTokenHiddenInput = () => {
  const { appConfig: { csrfToken } } = useOutletContext<{ appConfig: AppConfig }>();
  return <input type={'hidden'} name={'csrf-token'} value={csrfToken} />;
};
