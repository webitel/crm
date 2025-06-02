import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import createSvgSpritePlugin from 'vite-plugin-svg-sprite';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    base: '/crm',
    define: {
      'process.env': JSON.parse(
        JSON.stringify(env).replaceAll('VITE_', 'VUE_APP_'),
      ),
    },
    server: {
      host: true,
      port: 8080,
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // "modern", "modern-compiler", "legacy",
        },
      },
    },
    optimizeDeps: {
      // exclude: ['@webitel/ui-sdk'],
      include: ['clipboard-copy', 'deep-equal', 'deepmerge'],
    },
    resolve: {
      alias: {
        vue: '@vue/compat',
        '@': resolve(__dirname, 'src'),
        'lodash/fp': 'lodash-es',
        lodash: 'lodash-es',
        '@aliasedDeps/api-services/axios': resolve(
          __dirname,
          'src/app/api/instance',
        ),
        /* vue-datepicker v4 relies on date-fns v2
       where "/esm" dir still exists. need to update vue-datepicker to v8 at least */
        'date-fns/esm': 'date-fns',
      },
      dedupe: ['vue', '@vue/compat'],
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
          Buffer: true, // can also be 'build', 'dev', or false
        },
      }),
      createSvgSpritePlugin({
        include: '**/sprite/*.svg',
      }),
      checker({
        typescript: false,
        vueTsc: false,
      }),
      vueDevTools({
        launchEditor: 'webstorm',
      }),
    ],
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
        enabled: true,
        reporter: 'json',
      },
      environment: 'happy-dom',
      setupFiles: ['./tests/config/config.js'],
    },
  });
};
