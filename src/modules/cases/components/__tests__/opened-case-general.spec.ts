import { shallowMount } from '@vue/test-utils';

import OpenedCaseGeneral from '../opened-case-general.vue';

describe('OpenedCaseGeneral', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(OpenedCaseGeneral, {
			props: {
				isNew: false,
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = shallowMount(OpenedCaseGeneral, {
			props: {
				isNew: false,
			},
		});
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
