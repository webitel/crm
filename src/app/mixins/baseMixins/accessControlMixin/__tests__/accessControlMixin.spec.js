import { mount } from '@vue/test-utils';
import AccessControlMixin from '../accessControlMixin';

const Component = {
  render() {},
};

describe('AccessControlMixin', () => {
  it('renders a component', () => {
    const wrapper = mount(Component, {
      mixins: [AccessControlMixin],
    });
    expect(wrapper.exists()).toBe(true);
  });
});
