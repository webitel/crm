import { shallowMount } from '@vue/test-utils';

import OpenedStatusGeneral from '../opened-status-general.vue';

describe('OpenedStatusGeneral', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedStatusGeneral, {
			props: {
				modelValue: {
					name: 'Open',
					description: '',
				},
				validationFields: {},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(OpenedStatusGeneral, {
			props: {
				modelValue: {
					name: 'Open',
					description: '',
				},
				validationFields: {},
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
