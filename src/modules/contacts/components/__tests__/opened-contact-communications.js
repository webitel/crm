import { shallowMount } from '@vue/test-utils';

import OpenedContactCommunications from '../opened-contact-communications.vue';

describe('OpenedContactCommunications', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedContactCommunications, {
			props: {
				namespace: 'jest',
			},
			global: {
				provide: {
					access: {
						hasRbacEditAccess: true,
						hasRbacDeleteAccess: true,
					},
				},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});
});
