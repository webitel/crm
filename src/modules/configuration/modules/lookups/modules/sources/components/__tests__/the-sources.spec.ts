import { shallowMount } from '@vue/test-utils';

import TheSources from '../the-sources.vue';

describe('TheSources', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheSources, {
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
		const wrapper = shallowMount(TheSources, {
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
