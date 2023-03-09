import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { StaticContent } from './StaticContent';
import type { ComponentProps } from 'react';

describe('StaticContent', () => {
  it('should wrap with div by default', () => {
    vi.stubGlobal('document', undefined);
    let html = renderToString(<StaticContent title={'some div'}>{'div content'}</StaticContent>);
    expect(html).toMatchSnapshot();

    vi.unstubAllGlobals();
    html = renderToString(<StaticContent title={'some div'}>{'div content'}</StaticContent>);
    expect(html).toMatchSnapshot();
  });

  it('should wrap with given element', () => {
    const props: ComponentProps<typeof StaticContent> = {
      async: true,
      element: 'script',
      dangerouslySetInnerHTML: {
        __html: 'alert("hello world");'
      }
    };

    vi.stubGlobal('document', undefined);
    let html = renderToString(<StaticContent {...props} />);
    expect(html).toMatchSnapshot();

    vi.unstubAllGlobals();
    html = renderToString(<StaticContent {...props} />);
    expect(html).toMatchSnapshot();
  });
});

