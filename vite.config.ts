import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import checker from 'vite-plugin-checker';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import vueDevTools from 'vite-plugin-vue-devtools';
import { vite as vidstack } from 'vidstack/plugins';

// https://vitejs.dev/config/
export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const isStagingEnv = !!env.VITE_STAGING_ENV;

	return defineConfig({
		base: '/crm',
		build: {
			sourcemap: isStagingEnv,
			minify: !isStagingEnv, // Disable minification for readable debugging
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
			include: [
				'clipboard-copy',
				'deep-equal',
				'deepmerge',
			],
		},
		resolve: {
			alias: [
				{
					// Force the main @webitel/ui-sdk import to use source instead of
					// dist/ui-sdk.js, which bundles its own primevue Symbol that differs
					// from the one used by the @webitel/ui-sdk/components source export.
					find: /^@webitel\/ui-sdk$/,
					replacement: resolve(
						__dirname,
						'node_modules/@webitel/ui-sdk/src/install.ts',
					),
				},
				{
					find: 'vue',
					replacement: '@vue/compat',
				},
				{
					find: 'lodash/fp',
					replacement: 'lodash-es',
				},
				{
					find: 'lodash',
					replacement: 'lodash-es',
				},
				{
					find: '@aliasedDeps/api-services/axios',
					replacement: resolve(__dirname, 'src/app/api/instance'),
				},
				/* vue-datepicker v4 relies on date-fns v2
       where "/esm" dir still exists. need to update vue-datepicker to v8 at least */
				{
					find: 'date-fns/esm',
					replacement: 'date-fns',
				},
			],
			dedupe: [
				'vue',
				'@vue/compat',
				'zod',
				'pinia',
				'vidstack',
			],
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
				include: [
					'buffer',
					'stream',
				],
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
