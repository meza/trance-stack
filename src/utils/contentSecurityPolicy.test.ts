import { describe, it } from 'vitest';
import { contentSecurityPolicy } from './contentSecurityPolicy';

describe('contentSecurityPolicy', () => {
  it('is correctly set', () => {
    expect(contentSecurityPolicy('noncevalue')).toMatchSnapshot();
  });
});
