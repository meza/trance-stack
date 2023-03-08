import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { StaticContent } from './StaticContent';

describe('StaticContent', () => {
  it('should wrap with div by default', () => {
    // eslint-disable-next-line new-cap
    const { container } = render(<StaticContent title={'some div'}>{'div content'}</StaticContent>);
    expect(container).toMatchSnapshot();
  });

  it('should wrap with given element', () => {
    // eslint-disable-next-line new-cap
    const { container } = render(<StaticContent async element={'script'}>{'script content'}</StaticContent>);
    expect(container).toMatchSnapshot();
  });
});

