import path from 'node:path';
import react from '@vitejs/plugin-react';
import isCi from 'is-ci';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import type { CoverageReporter } from 'vitest';

const testReporters = ['default'];
const coverageReporters: CoverageReporter[] = ['text'];

if (!isCi) {
  // testReporters.push('cobertura');
  coverageReporters.push('html');
} else {
  testReporters.push('junit');
  coverageReporters.push('cobertura');
}

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    cache: {
      dir: '.cache/.vitest'
    },
    coverage: {
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        '**/__mocks__/**.*',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.stories.mdx',
        '**/*.stories.tsx',
        'testUtils/**.*'
      ],
      all: true,
      provider: 'v8',
      reportsDirectory: './reports/coverage/unit',
      reporter: coverageReporters,
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      }
    },
    dir: 'src',
    environment: 'jsdom',
    globals: true,
    isolate: true,
    outputFile: 'reports/junit.xml',
    reporters: testReporters,
    setupFiles: ['./vitest.setup.ts'],
    testTimeout: 10000,
    watch: false
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
});
