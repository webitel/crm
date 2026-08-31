import { shallowMount } from '@vue/test-utils';

import TheCustomLookup from '../the-custom-lookup.vue';

describe('TheCustomLookup', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheCustomLookup, {
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
		const wrapper = shallowMount(TheCustomLookup, {
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
