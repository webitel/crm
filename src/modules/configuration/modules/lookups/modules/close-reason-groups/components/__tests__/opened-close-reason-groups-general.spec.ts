import { shallowMount } from '@vue/test-utils';

import OpenedCloseReasonGroupsGeneral from '../opened-close-reason-groups-general.vue';

describe('OpenedCloseReasonGroupsGeneral', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedCloseReasonGroupsGeneral, {
			props: {
				modelValue: {
					name: 'No response',
					description: '',
				},
				validationFields: {},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(OpenedCloseReasonGroupsGeneral, {
			props: {
				modelValue: {
					name: 'No response',
					description: '',
				},
				validationFields: {},
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
