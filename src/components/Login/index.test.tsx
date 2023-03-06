import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '../../../testUtils';
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

  it('should render as expected', async () => {
    const component = renderWithi18n(<Login />);
    expect(component.asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <div
          class="centered-button"
        >
          <form
            action="/auth/auth0"
            method="post"
          >
            <button>
              login
            </button>
          </form>
        </div>
      </DocumentFragment>
    `);
  });
});
