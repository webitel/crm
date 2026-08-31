import { shallowMount } from '@vue/test-utils';

import OpenedServiceCatalogsGeneral from '../opened-service-catalogs-general.vue';

describe('OpenedServiceCatalogsGeneral', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedServiceCatalogsGeneral, {
			props: {
				modelValue: {
					name: 'Support',
					code: 'SUP',
				},
				validationFields: {},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(OpenedServiceCatalogsGeneral, {
			props: {
				modelValue: {
					name: 'Support',
					code: 'SUP',
				},
				validationFields: {},
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
