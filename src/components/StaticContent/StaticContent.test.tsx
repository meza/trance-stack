import react from 'react';
import { render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { StaticContent } from './StaticContent';

describe('StaticContent', () => {
  it('should wrap with div by default', () => {
    const { container } = render(<StaticContent title={'some div'}>{'div content'}</StaticContent>);
    expect(container).toMatchSnapshot();
  });

  it('should wrap with given element', () => {
    const component = <StaticContent async element={'script'} nonce={'example-nonce'}
      dangerouslySetInnerHTML={{
        __html: 'alert("hello world")'
      }}/>;

    const { container } = render(component);
    expect(container).toMatchSnapshot();

  });
});

