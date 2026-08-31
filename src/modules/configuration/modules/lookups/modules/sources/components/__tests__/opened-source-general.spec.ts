import { shallowMount } from '@vue/test-utils';
import type { WebitelCasesSource } from '@webitel/api-services/gen/models';
import { WebitelCasesSourceType } from '@webitel/api-services/gen/models';

import OpenedSourceGeneral from '../opened-source-general.vue';

const mountSource = () =>
	shallowMount(OpenedSourceGeneral, {
		props: {
			modelValue: {
				name: 'Phone',
				type: WebitelCasesSourceType.Call,
			} as WebitelCasesSource,
			validationFields: {} as never,
		},
	});

describe('OpenedSourceGeneral', () => {
	it('renders a component', () => {
		const wrapper = mountSource();
		expect(wrapper.isVisible()).toBe(true);
	});

	it('unmounts without throwing', () => {
		const wrapper = mountSource();
		expect(() => wrapper.unmount()).not.toThrow();
	});
});
