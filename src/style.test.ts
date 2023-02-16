import { beforeEach, describe, expect, it, vi } from 'vitest';
import { color, typography } from '~/style';

describe('The style module', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('didn\'t get unintentionally modified', () => {
    expect(color).toMatchInlineSnapshot(`
      {
        "primary": "#1ea7fd",
        "secondary": "#ff4785",
      }
    `);
    expect(typography).toMatchInlineSnapshot(`
      {
        "size": {
          "code": 90,
          "l1": 32,
          "l2": 40,
          "l3": 48,
          "m1": 20,
          "m2": 24,
          "m3": 28,
          "s1": 12,
          "s2": 14,
          "s3": 16,
        },
        "type": {
          "code": "\\"SFMono-Regular\\", Consolas, \\"Liberation Mono\\", Menlo, Courier, monospace",
          "primary": "\\"Nunito Sans\\", \\"Helvetica Neue\\", Helvetica, Arial, sans-serif",
        },
        "weight": {
          "bold": "700",
          "extrabold": "800",
          "regular": "400",
        },
      }
    `);
  });
});
