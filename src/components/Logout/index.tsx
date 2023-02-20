import { Form } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

export default function Logout() {
  const { t } = useTranslation();
  return (
    <Form action="/logout" method="post">
      <button>{t('logout')}</button>
    </Form>
  );
}
