import { shallowMount } from '@vue/test-utils';
import OpenedContactCommunications from '../opened-contact-communications.vue';

describe('OpenedContactCommunications', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(OpenedContactCommunications, {
      props: {
        namespace: 'jest',
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
