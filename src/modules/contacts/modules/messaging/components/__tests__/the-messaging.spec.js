import { shallowMount } from '@vue/test-utils';

import router from '../../../../../../app/router';
import store from '../../../../../../app/store';
import TheMessaging from '../the-messaging.vue';

describe('TheEmails', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheMessaging, {
			props: {
				namespace: 'contacts/card/messaging',
			},
			global: {
				plugins: [
					store,
					router,
				],
				provide: {
					access: {
						hasRbacEditAccess: true,
						hasRbacDeleteAccess: true,
					},
				},
			},
		});
		expect(wrapper.isVisible()).toBe(true);
	});
});
