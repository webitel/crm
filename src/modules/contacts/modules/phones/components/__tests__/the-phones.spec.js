import { shallowMount } from '@vue/test-utils';
import store from '../../../../../../app/store';
import router from '../../../../../../app/router';
import ThePhones from '../the-phones.vue';

describe('ThePhones', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(ThePhones, {
      props: {
        namespace: 'contacts/card/phones',
      },
      global: {
        plugins: [store, router],
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
