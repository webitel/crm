import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import vueDevTools from 'vite-plugin-vue-devtools';
import { vite as vidstack } from 'vidstack/plugins';

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    base: '/crm',
    build: {
      // sourcemap: true,
      // minify: false, // Disable minification for readable debugging
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
      dedupe: ['vue', '@vue/compat', 'zod', 'pinia', 'vidstack'],
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            compatConfig: {
              MODE: 2,
            },
            isCustomElement: (tag) => tag.startsWith('media-'),
          },
        },
      }),
      vidstack(),
      // https://www.npmjs.com/package/vite-plugin-node-polyfills
      nodePolyfills({
        // are needed for csv-parse
        include: ['buffer', 'stream'],
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
        },
      }),
      checker({
        typescript: false,
        vueTsc: false,
      }),
      vueDevTools({
        launchEditor: 'webstorm',
      }),
    ],
  });
};
