import styles from '@styles/components/Hello/hello.css';

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
  return (
    <div className={'hello'}>Hello World!</div>
  );
};
