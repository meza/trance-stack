import { useTranslation } from 'react-i18next';
import styles from './hello.css';

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
    <div data-testid={'greeting'} className={'hello'}>{t('microcopy.helloWorld')}</div>
  );
};
