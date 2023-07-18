import { shallowMount } from '@vue/test-utils';
import store from '../../../../../../app/store';
import router from '../../../../../../app/router';
import TheEmails from '../the-emails.vue';

describe('TheEmails', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TheEmails, {
      props: {
        namespace: 'contacts/card',
      },
      global: {
        plugins: [store, router],
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
