import { shallowMount } from '@vue/test-utils';

import OpenedCustomLookupGeneral from '../opened-custom-lookup-general.vue';

describe('OpenedCustomLookupGeneral', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedCustomLookupGeneral, {
			props: {
				modelValue: {
					name: 'Equipment',
					about: '',
				},
				validationFields: {},
				isNew: true,
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(OpenedCustomLookupGeneral, {
			props: {
				modelValue: {
					name: 'Equipment',
					about: '',
				},
				validationFields: {},
				isNew: true,
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
