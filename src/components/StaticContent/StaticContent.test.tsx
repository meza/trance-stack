import { createElement } from 'react';
import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { StaticContent } from './StaticContent';
import type { StaticContentProps } from './StaticContent';

vi.mock('react', async () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const react: typeof import('react') = await vi.importActual('react');
  return {
    ...react,
    createElement: vi.fn()
  };
});
describe('StaticContent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should wrap with div by default', () => {
    // server
    vi.stubGlobal('document', undefined);
    renderToString(<StaticContent title={'some div'}>{'div content'}</StaticContent>);
    expect(createElement).toHaveBeenCalledWith('div', {
      title: 'some div',
      children: 'div content'
    });

    // client
    vi.unstubAllGlobals();
    render(<StaticContent title={'some div'}>{'div content'}</StaticContent>);
    expect(createElement).toHaveBeenCalledWith('div', {
      title: 'some div',
      ref: { current: null },
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: ''
      }
    });
  });

  it('should wrap with given element', () => {
    const props: StaticContentProps<'script'> = {
      element: 'script',
      async: true,
      dangerouslySetInnerHTML: {
        __html: 'alert("hello world");'
      }
    };

    // server
    vi.stubGlobal('document', undefined);
    renderToString(<StaticContent {...props} />);
    expect(createElement).toHaveBeenCalledWith('script', {
      async: true,
      dangerouslySetInnerHTML: {
        __html: 'alert("hello world");'
      }
    });

    // client
    vi.unstubAllGlobals();
    render(<StaticContent {...props} />);
    expect(createElement).toHaveBeenCalledWith('script', {
      async: true,
      ref: { current: null },
      suppressHydrationWarning: true,
      dangerouslySetInnerHTML: {
        __html: ''
      }
    });
  });

  it('should handle clientside first render', () => {
    const ui = <StaticContent element="span" title={'some span'}>{'span content'}</StaticContent>;

    // ???
  });
});

