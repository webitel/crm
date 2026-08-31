import { shallowMount } from '@vue/test-utils';

import TheVariables from '../the-variables.vue';

describe('TheVariables', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheVariables);
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(TheVariables);
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
