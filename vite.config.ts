import { sentryVitePlugin } from '@sentry/vite-plugin';
// import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    svgr(),
    sentryVitePlugin({
      org: 'vizeo',
      project: 'vizion-front',
    }),
  ],
  preview: {
    port: 3001,
    strictPort: true,
  },
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
  define: {
    global: {},
  },
});
