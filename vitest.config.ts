import vue from '@vitejs/plugin-vue';
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
		hookTimeout: 30000,
		testTimeout: 30000,
		alias: {
			vue: 'vue',
			'lodash/fp': 'lodash-es',
			lodash: 'lodash-es',
		},
		server: {
			deps: {
				inline: [
					'@webitel/ui-sdk',
					'@webitel/ui-datalist',
					'@webitel/api-services',
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
