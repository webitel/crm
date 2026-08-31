import { shallowMount } from '@vue/test-utils';

import TheEmails from '../the-emails.vue';

describe('TheEmails', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheEmails);
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(TheEmails);
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
