import { SplitFactory } from '@splitsoftware/splitio/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@splitsoftware/splitio/server');

describe('The split client', () => {
  const originalEnv = structuredClone(process.env);
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    process.env.SPLIT_SERVER_TOKEN = originalEnv.SPLIT_SERVER_TOKEN;
    process.env.NODE_ENV = originalEnv.NODE_ENV;
  });

  it('set the defaults', async () => {
    delete process.env.SPLIT_SERVER_TOKEN;
    process.env.NODE_ENV = 'production';
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
    process.env.SPLIT_SERVER_TOKEN = 'token';
    process.env.NODE_ENV = 'development';

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
