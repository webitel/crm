import { shallowMount } from '@vue/test-utils';

import TheServiceCatalogs from '../the-service-catalogs.vue';

describe('TheServiceCatalogs', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheServiceCatalogs, {
			global: {
				stubs: {
					RouterLink: true,
					RouterView: true,
				},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(TheServiceCatalogs, {
			global: {
				stubs: {
					RouterLink: true,
					RouterView: true,
				},
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
