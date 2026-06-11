import { shallowMount } from '@vue/test-utils';

import TheContacts from '../the-contacts.vue';

describe('TheContacts', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheContacts, {
			global: {
				mocks: {
					$route: {
						meta: {},
						params: {},
						query: {},
					},
					$router: {
						push: vi.fn(),
						replace: vi.fn(),
					},
					$store: {
						getters: {},
						state: {},
						dispatch: vi.fn(),
						commit: vi.fn(),
					},
				},
				stubs: {
					RouterLink: true,
					RouterView: true,
				},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});
});
