import { createPinia, setActivePinia } from 'pinia';

import { useCaseServiceCatalogsCardStore } from '../caseServiceCatalogsCardStore';

describe('useCaseServiceCatalogsCardStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('starts empty, not loading, with no item selected', () => {
		const store = useCaseServiceCatalogsCardStore();

		expect(store.itemId).toBeUndefined();
		expect(store.isLoading).toBe(false);
		expect(store.isSaving).toBe(false);
	});
});
