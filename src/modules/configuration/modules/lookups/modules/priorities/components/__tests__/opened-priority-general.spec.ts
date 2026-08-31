import { shallowMount } from '@vue/test-utils';
import type { WebitelCasesPriority } from '@webitel/api-services/gen/models';

import OpenedPriorityGeneral from '../opened-priority-general.vue';

const mountPriority = () =>
	shallowMount(OpenedPriorityGeneral, {
		props: {
			modelValue: {
				name: 'High',
				color: 'red',
			} as WebitelCasesPriority,
			validationFields: {} as never,
		},
	});

describe('OpenedPriorityGeneral', () => {
	it('renders a component', () => {
		const wrapper = mountPriority();
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = mountPriority();
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
