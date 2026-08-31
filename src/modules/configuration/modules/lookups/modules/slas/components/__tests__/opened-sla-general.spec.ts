import { shallowMount } from '@vue/test-utils';

import OpenedSlaGeneral from '../opened-sla-general.vue';

describe('OpenedSlaGeneral', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedSlaGeneral, {
			props: {
				modelValue: {
					name: 'Standard SLA',
					description: '',
				},
				validationFields: {},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(OpenedSlaGeneral, {
			props: {
				modelValue: {
					name: 'Standard SLA',
					description: '',
				},
				validationFields: {},
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
