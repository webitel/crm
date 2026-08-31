import { shallowMount } from '@vue/test-utils';

import OpenedContactGroupGeneral from '../opened-contact-group-general.vue';

describe('OpenedContactGroupGeneral', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedContactGroupGeneral, {
			props: {
				modelValue: {
					name: 'VIP',
					description: '',
					enabled: true,
				},
				validationFields: {},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(OpenedContactGroupGeneral, {
			props: {
				modelValue: {
					name: 'VIP',
					description: '',
					enabled: true,
				},
				validationFields: {},
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
