import { shallowMount } from '@vue/test-utils';
import router from '../../../../app/router';
import store from '../../../../app/store';
import OpenedContact from '../opened-contact.vue';

describe('OpenedContact', () => {
  it('renders a component', () => {
    const wrapper = shallowMount(OpenedContact, {
      global: {
        plugins: [store, router],
      },
    });
    expect(wrapper.isVisible()).toBe(true);
  });

  it.skip('calls store "setId" with id from route', async () => {
    const id = 123;
    await router.push({ name: 'contacts-edit', params: { id } });
    console.info(router.currentRoute);
    const wrapper = shallowMount(OpenedContact, {
      global: {
        plugins: [store, router],
      },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    expect(store.state.contacts.card.itemId).toBe(id);
  });
});
