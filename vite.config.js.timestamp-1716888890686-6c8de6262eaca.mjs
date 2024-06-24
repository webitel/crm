// vite.config.js
import vue
  from 'file:///Users/admin/Projects/crm/node_modules/@vitejs/plugin-vue/dist/index.mjs';
import {
  nodePolyfills,
} from 'file:///Users/admin/Projects/crm/node_modules/vite-plugin-node-polyfills/dist/index.js';
import createSvgSpritePlugin
  from 'file:///Users/admin/Projects/crm/node_modules/vite-plugin-svg-sprite/esm/index.js';
import {
  defineConfig,
  loadEnv,
} from 'file:///Users/admin/Projects/crm/node_modules/vite/dist/node/index.js';

var vite_config_default = ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return defineConfig({
    base: '/crm',
    define: {
      'process.env': JSON.parse(JSON.stringify(env)
      .replaceAll('VITE_', 'VUE_APP_')),
    },
    server: {
      host: true,
      port: 8080,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/app/css/main.scss";`,
        },
      },
    },
    resolve: {
      alias: {
        vue: '@vue/compat',
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
          },
        },
      }),
      // https://www.npmjs.com/package/vite-plugin-node-polyfills
      nodePolyfills({
        // are needed for csv-parse
        include: ['buffer', 'stream'],
        globals: {
          Buffer: true,
          // can also be 'build', 'dev', or false
        },
      }),
      createSvgSpritePlugin({
        include: '**/sprite/*.svg',
      }),
    ],
    test: {
      globals: true,
      coverage: {
        enabled: true,
        reporter: 'json',
      },
      environment: 'happy-dom',
      setupFiles: ['./tests/config/config.js'],
    },
  });
};
export {
  vite_config_default as default,
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWRtaW4vUHJvamVjdHMvY3JtXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWRtaW4vUHJvamVjdHMvY3JtL3ZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hZG1pbi9Qcm9qZWN0cy9jcm0vdml0ZS5jb25maWcuanNcIjtpbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XG5pbXBvcnQgY3JlYXRlU3ZnU3ByaXRlUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1zcHJpdGUnO1xuXG4vLyBUT0RPXG4vLyBpbXBvcnQubWV0YS5lbnYuVlVFX0FQUF9QQUNLQUdFX1ZFUlNJT04gPSByZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJyk7XG5cbiAgcmV0dXJuIGRlZmluZUNvbmZpZyh7XG4gICAgYmFzZTogJy9jcm0nLFxuICAgIGRlZmluZToge1xuICAgICAgJ3Byb2Nlc3MuZW52JzogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlbnYpXG4gICAgICAucmVwbGFjZUFsbCgnVklURV8nLCAnVlVFX0FQUF8nKSksXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgICBwb3J0OiA4MDgwLFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYEBpbXBvcnQgXCIuL3NyYy9hcHAvY3NzL21haW4uc2Nzc1wiO2AsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgdnVlOiAnQHZ1ZS9jb21wYXQnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHZ1ZSh7XG4gICAgICAgIHRlbXBsYXRlOiB7XG4gICAgICAgICAgY29tcGlsZXJPcHRpb25zOiB7XG4gICAgICAgICAgICBjb21wYXRDb25maWc6IHtcbiAgICAgICAgICAgICAgTU9ERTogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgLy8gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2Uvdml0ZS1wbHVnaW4tbm9kZS1wb2x5ZmlsbHNcbiAgICAgIG5vZGVQb2x5ZmlsbHMoe1xuICAgICAgICAvLyBhcmUgbmVlZGVkIGZvciBjc3YtcGFyc2VcbiAgICAgICAgaW5jbHVkZTogWydidWZmZXInLCAnc3RyZWFtJ10sXG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICBCdWZmZXI6IHRydWUsIC8vIGNhbiBhbHNvIGJlICdidWlsZCcsICdkZXYnLCBvciBmYWxzZVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBjcmVhdGVTdmdTcHJpdGVQbHVnaW4oe1xuICAgICAgICBpbmNsdWRlOiAnKiovc3ByaXRlLyouc3ZnJyxcbiAgICAgIH0pLFxuICAgIF0sXG4gICAgdGVzdDoge1xuICAgICAgZ2xvYmFsczogdHJ1ZSxcbiAgICAgIGNvdmVyYWdlOiB7XG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIHJlcG9ydGVyOiAnanNvbicsXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnQ6ICdoYXBweS1kb20nLFxuICAgICAgc2V0dXBGaWxlczogWycuL3Rlc3RzL2NvbmZpZy9jb25maWcuanMnXSxcbiAgICB9LFxuICB9KTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlAsT0FBTyxTQUFTO0FBQzdRLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sMkJBQTJCO0FBTWxDLElBQU8sc0JBQVEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUMzQixRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFFM0MsU0FBTyxhQUFhO0FBQUEsSUFDbEIsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLE1BQ04sZUFBZSxLQUFLLE1BQU0sS0FBSyxVQUFVLEdBQUcsRUFDM0MsV0FBVyxTQUFTLFVBQVUsQ0FBQztBQUFBLElBQ2xDO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsSUFDUjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gscUJBQXFCO0FBQUEsUUFDbkIsTUFBTTtBQUFBLFVBQ0osZ0JBQWdCO0FBQUEsUUFDbEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxJQUFJO0FBQUEsUUFDRixVQUFVO0FBQUEsVUFDUixpQkFBaUI7QUFBQSxZQUNmLGNBQWM7QUFBQSxjQUNaLE1BQU07QUFBQSxZQUNSO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGLENBQUM7QUFBQTtBQUFBLE1BRUQsY0FBYztBQUFBO0FBQUEsUUFFWixTQUFTLENBQUMsVUFBVSxRQUFRO0FBQUEsUUFDNUIsU0FBUztBQUFBLFVBQ1AsUUFBUTtBQUFBO0FBQUEsUUFDVjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0Qsc0JBQXNCO0FBQUEsUUFDcEIsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxNQUNULFVBQVU7QUFBQSxRQUNSLFNBQVM7QUFBQSxRQUNULFVBQVU7QUFBQSxNQUNaO0FBQUEsTUFDQSxhQUFhO0FBQUEsTUFDYixZQUFZLENBQUMsMEJBQTBCO0FBQUEsSUFDekM7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
