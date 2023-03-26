import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { CsrfTokenHiddenInput } from '~/components/CsrfTokenHiddenInput';

export default function Logout() {
  const { t } = useTranslation();
  return (
    <Form action='/logout' method='post'>
      <CsrfTokenHiddenInput />
      <button>{t('logout')}</button>
    </Form>
  );
}
