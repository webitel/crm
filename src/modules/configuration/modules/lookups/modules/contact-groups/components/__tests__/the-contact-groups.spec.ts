import { shallowMount } from '@vue/test-utils';

import TheContactGroups from '../the-contact-groups.vue';

describe('TheContactGroups', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheContactGroups, {
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
		const wrapper = shallowMount(TheContactGroups, {
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
