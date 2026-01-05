/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './setupTests.ts',
    include: [
      '**/*.test.{ts,tsx}',
      'services/**/*.test.{ts,tsx}',
      'components/**/*.test.{ts,tsx}',
    ],
    pool: 'forks',
  },
  define: {
    global: 'globalThis',
  },
});
