import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent, h } from 'vue';

import { useContactGroupsCardStore } from '../contactGroupsCardStore';

// This store reads `useRoute()` on every call (to preset a group type from
// `?type=`), which only resolves inside a mounted component's injection
// context — calling the hook bare, outside of `setup()`, throws.
function mountCardStore() {
	const wrapper = mount(
		defineComponent({
			setup() {
				return {
					store: useContactGroupsCardStore(),
				};
			},
			render: () => h('div'),
		}),
	);
	return wrapper.vm.store;
}

describe('useContactGroupsCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = mountCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});

	it('does not preset a group type without a ?type= query param', () => {
		const store = mountCardStore();

		expect(store.draftItemInstance.type).toBeUndefined();
	});
});
