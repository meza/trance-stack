import { describe, expect, it } from 'vitest';
import cookie from './cookie';

describe('The cookie icon', () => {
  it('should be unchanged', () => {
    expect(cookie()).toMatchSnapshot();
  });
});
