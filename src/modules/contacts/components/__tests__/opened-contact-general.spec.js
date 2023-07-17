import { shallowMount } from '@vue/test-utils';
import OpenedContactGeneral from '../opened-contact-general.vue';

describe('OpenedContactGeneral', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(OpenedContactGeneral, {
      props: {
        commonName: 'jest',
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
