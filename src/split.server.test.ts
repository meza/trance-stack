import path from 'node:path';
import { SplitFactory } from '@splitsoftware/splitio/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@splitsoftware/splitio/server');
vi.mock('node:path');

describe('The split client', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    vi.resetModules();
    vi.mocked(path.resolve).mockReturnValue('/cwd/sub/devFeatures.yml');
  });

  it('set the environments', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('SPLIT_SERVER_TOKEN', 'token');

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
        "debug": false,
        "features": "/cwd/sub/devFeatures.yml",
      }
    `);
  });
});
