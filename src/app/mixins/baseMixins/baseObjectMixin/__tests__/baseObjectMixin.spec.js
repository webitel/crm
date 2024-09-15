import { shallowMount } from '@vue/test-utils';
import BaseObjectMixin from '../baseObjectMixin';

const Component = {
  render() {},
};

describe('BaseObjectMixin', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(Component, {
      data: () => ({
        itemInstance: {},
      }),
      mixins: [BaseObjectMixin],
      methods: {
        checkValidations() {
          return true;
        },
      },
      global: {
        mocks: {
          v$: {
            itemInstance: {
              $error: true,
              $touch: vi.fn(),
            },
          },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.disabledSave).toBe(true);
  });
});
