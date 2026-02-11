import { shallowMount } from '@vue/test-utils';

import OpenedContactTabs from '../opened-contact-tabs.vue';

describe('OpenedContactTabs', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedContactTabs, {
			props: {
				namespace: 'jest',
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});
});
