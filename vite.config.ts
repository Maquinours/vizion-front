import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    sentryVitePlugin({
      org: 'vizeo',
      project: 'javascript-react',
    }),
  ],

  build: {
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === 'SOURCEMAP_ERROR') {
          return;
        }

        defaultHandler(warning);
      },
    },
  },
});
