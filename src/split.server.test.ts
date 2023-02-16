import { SplitFactory } from '@splitsoftware/splitio/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@splitsoftware/splitio/server');

describe('The split client', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('set the defaults', async () => {

    vi.mocked(SplitFactory).mockReturnValue({
      client: vi.fn().mockReturnValue('client')
    } as never);

    const client = (await import('./split.server')).default;

    const calls = vi.mocked(SplitFactory).mock.calls;

    expect(client).toEqual('client');
    expect(calls[0][0]).toMatchInlineSnapshot(`
      {
        "core": {
          "authorizationKey": "localhost",
        },
        "debug": false,
      }
    `);
  });

  it('set the environments', async () => {

    vi.spyOn(process, 'env', 'get').mockReturnValue({
      SPLIT_SERVER_TOKEN: 'token',
      NODE_ENV: 'development'
    });

    vi.mocked(SplitFactory).mockReturnValue({
      client: vi.fn().mockReturnValue('client-2')
    } as never);

    const client = (await import('./split.server')).default;

    const calls = vi.mocked(SplitFactory).mock.calls;

    expect(client).toEqual('client-2');
    expect(calls[0][0]).toMatchInlineSnapshot(`
      {
        "core": {
          "authorizationKey": "token",
        },
        "debug": true,
      }
    `);
  });
});
