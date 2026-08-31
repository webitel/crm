import { createPinia, setActivePinia } from 'pinia';

import { useCasesCardStore } from '../casesCardStore';

describe('useCasesCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCasesCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
