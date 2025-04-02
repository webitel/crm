import { shallowMount } from '@vue/test-utils';

import OpenedContactGeneral from '../opened-contact-general.vue';

describe('OpenedContactGeneral', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(OpenedContactGeneral, {
      props: {
        name: 'jest',
      },
      global: {
        provide: {
          access: {
            value: {
              hasRbacEditAccess: true,
              hasRbacDeleteAccess: true,
            },
          },
        },
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
