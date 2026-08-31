import { shallowMount } from '@vue/test-utils';

import TheSlas from '../the-slas.vue';

describe('TheSlas', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheSlas, {
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
		const wrapper = shallowMount(TheSlas, {
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
