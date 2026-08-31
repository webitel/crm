import { shallowMount } from '@vue/test-utils';

import TheMessaging from '../the-messaging.vue';

describe('TheMessaging', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheMessaging);
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(TheMessaging);
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
