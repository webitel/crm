import { shallowMount } from '@vue/test-utils';
import OpenedContactTabs from '../opened-contact-tabs.vue';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({})),
  useRouter: vi.fn(() => ({
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
