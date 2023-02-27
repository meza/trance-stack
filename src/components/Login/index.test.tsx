import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '@test';
import Login from './index';
import type { PropsWithChildren } from 'react';

vi.mock('@remix-run/react', () => ({
  Form: ({ children, ...props }: PropsWithChildren) => {
    return (
      <form {...props}>
        {children}
      </form>
    );
  }
}));

describe('The Login component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render as expected', async () => {
    const component = renderWithi18n(<Login />);
    expect(component.asFragment()).toMatchInlineSnapshot();
  });
});
