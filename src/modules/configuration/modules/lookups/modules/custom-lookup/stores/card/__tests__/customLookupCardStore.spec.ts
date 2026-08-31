import { createPinia, setActivePinia } from 'pinia';

import { useCustomLookupCardStore } from '../customLookupCardStore';

describe('useCustomLookupCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCustomLookupCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
