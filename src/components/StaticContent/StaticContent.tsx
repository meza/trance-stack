import { createElement, useRef, useState, useEffect } from 'react';
import type { PropsWithChildren } from 'react';

const useStaticContent = () => {
  const ref = useRef<HTMLElement>(null);
  const [isFirstRender, setRender] = useState(typeof document === 'undefined');

  useEffect(() => {
    // check if the innerHTML is empty as client side navigation
    // needs to render the component without server-side backup
    const isEmpty = ref.current?.innerHTML === '';
    if (isEmpty) {
      setRender(true);
    }
  }, []);

  return [isFirstRender, ref];
};

export const StaticContent = <Elem extends keyof JSX.IntrinsicElements = 'div'>(
  { children, element, ...props }: PropsWithChildren<{ element?: Elem } & JSX.IntrinsicElements[Elem]>
) => {
  const elem = element || 'div';
  const [isFirstRender, ref] = useStaticContent();

  // if we're in the server or a spa navigation, just render it
  if (isFirstRender) {
    return createElement(elem, {
      ...props,
      children: children
    });
  }

  // avoid re-render on the client
  return createElement(elem, {
    ...props,
    ref: ref,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: '' }
  });
};
