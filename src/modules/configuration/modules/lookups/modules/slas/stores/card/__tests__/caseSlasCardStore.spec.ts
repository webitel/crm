import { createPinia, setActivePinia } from 'pinia';

import { useCaseSlasCardStore } from '../caseSlasCardStore';

describe('useCaseSlasCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCaseSlasCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
