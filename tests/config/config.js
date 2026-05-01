import { config } from '@vue/test-utils';
import axiosMock from '@webitel/ui-sdk/src/tests/mocks/axiosMock'; // import instance from '../../src/app/api/instance.js';
import { createPinia } from 'pinia';

import i18n from '../../src/app/locale/i18n';
import WebitelUi from '../../src/app/plugins/webitel/ui-sdk';

config.global.plugins = [
	WebitelUi,
	i18n,
	createPinia(),
];

window.scrollTo = () => {};

/*
 * Global axios mock.
 *
 * Issue: components mounted in tests (e.g. `the-contacts.vue`) trigger API
 * calls via `@webitel/api-services` -> `webitel-sdk` `*ApiFactory(...)` ->
 * a real axios instance built by `getDefaultInstance()` (api-services
 * internal `generateInstance` -> `axios.create()`). Axios v1 in Node uses
 * the `node:net` http adapter, so requests escape happy-dom and hit the
 * network, yielding `ECONNREFUSED localhost:3000` (happy-dom origin +
 * `VITE_API_URL=/api`). These rejections are unhandled and surface as
 * vitest "Errors" in CI even when assertions pass.
 *
 * Fix: doMock the `axios` package itself so every `axios.create(...)` and
 * direct method call returns the ui-sdk axios mock. This catches
 * api-services' internal `generateInstance`, ui-sdk's wrapper, and any
 * other axios consumer regardless of the import path they take.
 */
const mockAxiosInstance = axiosMock()().default;
vi.doMock('axios', () => ({
	default: {
		...mockAxiosInstance,
		create: vi.fn(() => mockAxiosInstance),
	},
	...mockAxiosInstance,
	create: vi.fn(() => mockAxiosInstance),
}));

const axios = axiosMock();
vi.doMock('@webitel/ui-sdk/src/api/axios/generateInstance.js', () => ({
	default: () => axios().default,
}));
vi.doMock('@aliasedDeps/api-services/axios', () => ({
	default: () => axios().default,
}));

beforeAll(async () => {
	const store = (await import('../../src/app/store/index.js')).default;
	const router = (await import('../../src/app/router')).default;
	const { createUserAccessControl } = await import(
		'../../src/app/composables/useUserAccessControl'
	);
	const { useUserinfoStore } = await import(
		'../../src/modules/userinfo/store/userinfoStore'
	);
	createUserAccessControl(useUserinfoStore);
	store.commit('SET_ROUTER', router);
});
