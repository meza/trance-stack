import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export default function Register() {
  const { t } = useTranslation();
  return (
    <Form action="/auth/auth0?screen_hint=signup" method="post">
      <button>{t('register')}</button>
    </Form>
  );
}
