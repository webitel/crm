import { shallowMount } from '@vue/test-utils';

import TheFieldExtensions from '../the-field-extensions.vue';

describe('TheFieldExtensions', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheFieldExtensions, {
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
		const wrapper = shallowMount(TheFieldExtensions, {
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
