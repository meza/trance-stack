import styles from '@styles/components/Hello/hello.css';
import { useTranslation } from 'react-i18next';

export const links = () => [
  { rel: 'stylesheet', href: styles }
];

/**
`import { Hello } from '~/components';`

The `Hello` component... (What does the Hello component do?)

_Usage:_

```jsx
<Hello/>
```
**/
export const Hello = () => {
  const { t } = useTranslation();
  return (
    <div className={'hello'}>{t('microcopy.helloWorld')}</div>
  );
};
