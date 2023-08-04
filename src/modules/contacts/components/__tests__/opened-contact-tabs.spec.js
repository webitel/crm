import { shallowMount } from '@vue/test-utils';
import { useRouter, useRoute } from 'vue-router'
import OpenedContactTabs from '../opened-contact-tabs.vue';

jest.mock('vue-router', () => ({
  useRoute: jest.fn(() => ({})),
  useRouter: jest.fn(() => ({
    push: () => {}
  }))
}))

describe('OpenedContactTabs', () => {

  it('renders a component', () => {
    const wrapper = shallowMount(OpenedContactTabs, {
      props: {
        namespace: 'jest',
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });
});
