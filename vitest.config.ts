/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import isCi from 'is-ci';
import { CoverageReporter } from 'vitest';

const testReporters = ['default'];
const coverageReporters = ['text'];

if (!isCi) {
  // testReporters.push('verbose');
  coverageReporters.push('html');
} else {
  testReporters.push('junit');
  coverageReporters.push('cobertura');
}

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/setup-test-env.ts'],
    coverage: {
      excludeNodeModules: true,
      include: ['src/**/*.ts'],
      exclude: ['**/*.testGameVersion.ts', '**/__mocks__/**.*', '**/*.d.ts', '**/*.test.ts'],
      all: true,
      reportsDirectory: './reports/coverage/unit',
      reporter: coverageReporters as CoverageReporter[],
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
});
