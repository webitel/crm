import { shallowMount } from '@vue/test-utils';

import TheContactCases from '../the-contact-cases.vue';

describe('TheContactCases', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheContactCases);
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(TheContactCases);
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
