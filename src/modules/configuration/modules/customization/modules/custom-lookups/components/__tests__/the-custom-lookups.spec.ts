import { shallowMount } from '@vue/test-utils';

import TheCustomLookups from '../the-custom-lookups.vue';

describe('TheCustomLookups', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheCustomLookups, {
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
		const wrapper = shallowMount(TheCustomLookups, {
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
