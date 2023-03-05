import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithi18n } from '@test';
import { authenticator } from '~/auth.server';
import Dashboard, { loader } from '~/routes/dashboard';

vi.mock('@remix-run/node');
vi.mock('@remix-run/react');
vi.mock('~/components/Logout');
vi.mock('~/auth.server', () => {
  return {
    authenticator: {
      getUser: vi.fn()
    }
  };
});

describe('The Dashboard Route', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns the user from the auth service', async () => {
    vi.mocked(authenticator.getUser).mockResolvedValue({ name: 'test' } as never);
    const request = new Request('https://example.com/dashboard');
    const context = {};

    await loader({ request: request, context: context } as never);

    expect(json).toHaveBeenCalledWith({ user: { name: 'test' } });
    expect(authenticator.getUser).toHaveBeenCalledWith(request, context);
  });

  it('prioritises the nickname over anything', () => {
    vi.mocked(useLoaderData).mockReturnValue({
      user: {
        nickname: 'test-nickname',
        givenName: 'test-given-name',
        name: 'test-name'
      }
    } as never);

    const comp = renderWithi18n(<Dashboard />);
    expect(comp.asFragment()).toMatchSnapshot();
  });

  it('prioritises the givenName over name', () => {
    vi.mocked(useLoaderData).mockReturnValue({
      user: {
        givenName: 'test-given-name',
        name: 'test-name'
      }
    } as never);

    const comp = renderWithi18n(<Dashboard />);
    expect(comp.asFragment()).toMatchSnapshot();
  });

  it('uses the name if nothing else is present', () => {
    vi.mocked(useLoaderData).mockReturnValue({
      user: {
        name: 'test-name'
      }
    } as never);

    const comp = renderWithi18n(<Dashboard />);
    expect(comp.asFragment()).toMatchSnapshot();
  });
});
