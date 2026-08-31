import { createPinia, setActivePinia } from 'pinia';

import { useCasePrioritiesCardStore } from '../casePrioritiesCardStore';

describe('useCasePrioritiesCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCasePrioritiesCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
