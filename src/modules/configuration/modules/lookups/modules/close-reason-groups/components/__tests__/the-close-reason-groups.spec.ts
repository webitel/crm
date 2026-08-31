import { shallowMount } from '@vue/test-utils';

import TheCloseReasonGroups from '../the-close-reason-groups.vue';

describe('TheCloseReasonGroups', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheCloseReasonGroups, {
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
		const wrapper = shallowMount(TheCloseReasonGroups, {
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
