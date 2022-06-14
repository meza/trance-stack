import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();

  return (
    <div>
      <div>{t('greeting')} {t('entity')}</div>
    </div>
  );
}
