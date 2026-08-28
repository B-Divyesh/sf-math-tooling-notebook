import { defineConfig } from 'vitest/config';
import staticWebAppConfig from './public/staticwebapp.config.json';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
  preview: {
    headers: {
      'Content-Security-Policy': staticWebAppConfig.globalHeaders['Content-Security-Policy'],
    },
  },
});
