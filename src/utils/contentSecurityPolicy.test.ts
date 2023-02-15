import { describe, it } from 'vitest';
import { contentSecurityPolicy } from './contentSecurityPolicy';

describe('contentSecurityPolicy', () => {
  it('in dev mode', () => {
    expect(contentSecurityPolicy(true)).toMatchSnapshot();
  });
  it('in prod mode', () => {
    expect(contentSecurityPolicy(false)).toMatchSnapshot();
  });
});
