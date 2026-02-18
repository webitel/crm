import { shallowMount } from '@vue/test-utils';

import router from '../../../../../../app/router';
import store from '../../../../../../app/store';
import TheEmails from '../the-emails.vue';

describe('TheEmails', () => {
	it('renders a component', () => {
		const wrapper = shallowMount(TheEmails, {
			props: {
				namespace: 'contacts/card/emails',
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
