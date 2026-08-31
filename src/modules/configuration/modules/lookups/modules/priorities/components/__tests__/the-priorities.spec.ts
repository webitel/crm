import { shallowMount } from '@vue/test-utils';

import ThePriorities from '../the-priorities.vue';

describe('ThePriorities', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ThePriorities, {
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
		const wrapper = shallowMount(ThePriorities, {
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
