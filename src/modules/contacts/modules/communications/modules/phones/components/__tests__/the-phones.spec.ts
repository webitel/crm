import { shallowMount } from '@vue/test-utils';

import ThePhones from '../the-phones.vue';

describe('ThePhones', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(ThePhones);
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(ThePhones);
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
