import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    alias: {
      vue: 'vue',
    },
    server: {
      deps: {
        inline: ['@webitel/ui-sdk'],
      },
    },
    coverage: {
      enabled: false,
      reporter: 'json',
    },
    environment: 'happy-dom',
    setupFiles: ['./tests/config/config.js'],
  },
});