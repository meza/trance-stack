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
    globals: true,
    isolate: true,
    environment: 'happy-dom',
    cache: {
      dir: '.cache/.vitest'
    },
    deps: {
      fallbackCJS: true
    },
    setupFiles: ['./vitest.setup.ts'],
    dir: 'src',
    testTimeout: 10000,
    watch: false,
    threads: false,
    outputFile: 'reports/junit.xml',
    reporters: testReporters,
    coverage: {
      // excludeNodeModules: true,
      src: ['src'],
      include: ['**/*.ts', '**/*.tsx'],
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
      reportsDirectory: './reports/coverage/unit',
      reporter: coverageReporters,
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
});
