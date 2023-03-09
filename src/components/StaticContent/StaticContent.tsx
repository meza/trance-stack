import { createElement, useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const useStaticContent = () => {
  const ref = useRef<HTMLElement>(null);
  const [render, setRender] = useState(typeof document === 'undefined');

  useEffect(() => {
    // check if the innerHTML is empty as client side navigation
    // need to render the component without server-side backup
    const isEmpty = ref.current?.innerHTML === '';
    if (isEmpty) {
      setRender(true);
    }
  }, []);

  return [render, ref];
};

export const StaticContent = <Elem extends keyof JSX.IntrinsicElements = 'div'>(
  { children, element, ...props }: {
    element?: Elem;
    children?: ReactNode;
  } & JSX.IntrinsicElements[Elem]
) => {
  const elem = element || 'div';
  const [render, ref] = useStaticContent();
  console.log('render');
  // if we're in the server or a spa navigation, just render it
  if (render) {
    console.log('server');
    return createElement(elem, {
      ...props,
      children: children
    });
  }
  console.log('client');
  // avoid re-render on the client
  return createElement(elem, {
    ...props,
    ref: ref,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: '' }
  });
};
