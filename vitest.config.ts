import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
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
	],
	test: {
		globals: true,
		alias: {
			vue: 'vue',
			'@aliasedDeps/api-services/axios': resolve(
				__dirname,
				'src/app/api/instance',
			),
		},
		server: {
			deps: {
				inline: [
					'@webitel/ui-sdk',
					'@webitel/ui-datalist',
				],
			},
		},
		coverage: {
			enabled: false,
			reporter: 'json',
		},
		environment: 'happy-dom',
		setupFiles: [
			'./tests/config/config.js',
		],
	},
});
