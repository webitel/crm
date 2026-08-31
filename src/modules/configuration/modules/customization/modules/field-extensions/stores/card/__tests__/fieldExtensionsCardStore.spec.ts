import { createPinia, setActivePinia } from 'pinia';

import { useFieldExtensionsCardStore } from '../fieldExtensionsCardStore';

describe('useFieldExtensionsCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useFieldExtensionsCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
