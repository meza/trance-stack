import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  return (
    <div data-role={'loginbutton'}>
      <Form action="/auth/auth0" method="post">
        <button>{t('login')}</button>
      </Form>
    </div>
  );
}
