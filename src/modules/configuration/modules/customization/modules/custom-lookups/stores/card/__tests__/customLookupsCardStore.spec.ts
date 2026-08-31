import { createPinia, setActivePinia } from 'pinia';

import { useCustomLookupsCardStore } from '../customLookupsCardStore';

describe('useCustomLookupsCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCustomLookupsCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
