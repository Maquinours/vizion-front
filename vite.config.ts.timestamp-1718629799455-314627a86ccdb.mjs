// vite.config.ts
import { defineConfig } from "file:///C:/Users/BB/Projects/vizion-front-v2/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/BB/Projects/vizion-front-v2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { TanStackRouterVite } from "file:///C:/Users/BB/Projects/vizion-front-v2/node_modules/@tanstack/router-vite-plugin/dist/esm/index.js";
import svgr from "file:///C:/Users/BB/Projects/vizion-front-v2/node_modules/vite-plugin-svgr/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    svgr()
    // sentryVitePlugin({
    //   org: 'vizeo',
    //   project: 'javascript-react',
    // }),
  ],
  preview: {
    port: 3001,
    strictPort: true
  },
  build: {
    // sourcemap: true,
    rollupOptions: {
      onwarn(warning, defaultHandler) {
        if (warning.code === "SOURCEMAP_ERROR") {
          return;
        }
        defaultHandler(warning);
      }
    }
  },
  define: {
    global: {}
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCQlxcXFxQcm9qZWN0c1xcXFx2aXppb24tZnJvbnQtdjJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXEJCXFxcXFByb2plY3RzXFxcXHZpemlvbi1mcm9udC12MlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvQkIvUHJvamVjdHMvdml6aW9uLWZyb250LXYyL3ZpdGUuY29uZmlnLnRzXCI7Ly8gaW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gJ0BzZW50cnkvdml0ZS1wbHVnaW4nO1xyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcclxuaW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSAnQHRhbnN0YWNrL3JvdXRlci12aXRlLXBsdWdpbic7XHJcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgVGFuU3RhY2tSb3V0ZXJWaXRlKCksXHJcbiAgICBzdmdyKCksXHJcbiAgICAvLyBzZW50cnlWaXRlUGx1Z2luKHtcclxuICAgIC8vICAgb3JnOiAndml6ZW8nLFxyXG4gICAgLy8gICBwcm9qZWN0OiAnamF2YXNjcmlwdC1yZWFjdCcsXHJcbiAgICAvLyB9KSxcclxuICBdLFxyXG4gIHByZXZpZXc6IHtcclxuICAgIHBvcnQ6IDMwMDEsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gIH0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIC8vIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb253YXJuKHdhcm5pbmcsIGRlZmF1bHRIYW5kbGVyKSB7XHJcbiAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ1NPVVJDRU1BUF9FUlJPUicpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRlZmF1bHRIYW5kbGVyKHdhcm5pbmcpO1xyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGRlZmluZToge1xyXG4gICAgZ2xvYmFsOiB7fSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLDBCQUEwQjtBQUNuQyxPQUFPLFVBQVU7QUFHakIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sbUJBQW1CO0FBQUEsSUFDbkIsS0FBSztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLUDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsZUFBZTtBQUFBLE1BQ2IsT0FBTyxTQUFTLGdCQUFnQjtBQUM5QixZQUFJLFFBQVEsU0FBUyxtQkFBbUI7QUFDdEM7QUFBQSxRQUNGO0FBRUEsdUJBQWUsT0FBTztBQUFBLE1BQ3hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLFFBQVEsQ0FBQztBQUFBLEVBQ1g7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
