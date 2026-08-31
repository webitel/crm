import { shallowMount } from '@vue/test-utils';

import TheStatuses from '../the-statuses.vue';

describe('TheStatuses', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheStatuses, {
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
		const wrapper = shallowMount(TheStatuses, {
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
