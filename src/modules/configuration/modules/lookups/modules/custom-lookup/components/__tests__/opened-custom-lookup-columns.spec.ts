import { shallowMount } from '@vue/test-utils';

import OpenedCustomLookupColumns from '../opened-custom-lookup-columns.vue';

describe('OpenedCustomLookupColumns', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedCustomLookupColumns, {
			props: {
				modelValue: {},
				validationFields: {},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(OpenedCustomLookupColumns, {
			props: {
				modelValue: {},
				validationFields: {},
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
