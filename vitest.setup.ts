import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { expect, afterEach, vi } from 'vitest';
import * as matchers from 'vitest-dom/matchers';

expect.extend(matchers);
afterEach(() => {
  // these run after every single test
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetAllMocks();
  vi.useRealTimers();
  cleanup();
});
