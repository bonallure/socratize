/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
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
      env: env, // Make environment variables available to tests
    },
    define: {
      global: 'globalThis',
      'process.env': env, // Make process.env available
    },
  };
});
