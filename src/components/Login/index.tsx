import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { CsrfTokenHiddenInput } from '~/components/CsrfTokenHiddenInput';

export default function Login() {
  const { t } = useTranslation();
  return (
    <div className={'centered-button'}>
      <Form action='/auth/auth0' method='post'>
        <CsrfTokenHiddenInput />
        <button>{t('login')}</button>
      </Form>
    </div>
  );
}
