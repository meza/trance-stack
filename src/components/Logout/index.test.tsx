import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '../../../testUtils';
import Logout from './index';
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

describe('The Logout component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render as expected', async () => {
    const component = renderWithi18n(<Logout />);
    expect(component.asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <form
          action="/logout"
          method="post"
        >
          <button>
            logout
          </button>
        </form>
      </DocumentFragment>
    `);
  });
});
