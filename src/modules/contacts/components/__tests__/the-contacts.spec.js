import { shallowMount } from '@vue/test-utils';
import store from '../../../../app/store';
import router from '../../../../app/router';
import TheContacts from '../the-contacts.vue';

describe('TheContacts', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(TheContacts, {
      global: {
        plugins: [store, router],
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
